import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const characteristicRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  // CSV buffering refs
  const csvBuffer = useRef([]);
  const csvPromiseResolve = useRef(null);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  // --- Send thresholds to ESP32 ---
  const sendUserThresholds = async () => {
    const char = characteristicRef.current;
    if (!char || !user?.posture_thresholds) return;

    const t = user.posture_thresholds;
    const payload = `${t.flex_min},${t.flex_max},${t.gyroY_min},${t.gyroY_max},${t.gyroZ_min},${t.gyroZ_max}`;

    try {
      const encoder = new TextEncoder();
      await char.writeValue(encoder.encode(payload));
      console.log("✅ Thresholds sent:", payload);
    } catch (err) {
      console.error("❌ Failed to send thresholds:", err);
    }
  };

  // --- Notification handler ---
  const handleNotifications = async (event) => {
    const value = new TextDecoder().decode(event.target.value).trim();

    if (value.includes(",")) {
      const [flex, y, z] = value.split(",").map(parseFloat);
      setFlexAngle(flex);
      setGyroY(y);
      setGyroZ(z);
      console.log("📡 Posture update:", value);
      return;
    }

    if (value === "CSV_END") {
      console.log("📤 CSV transfer complete");
      if (csvPromiseResolve.current) {
        csvPromiseResolve.current(csvBuffer.current.join("\n"));
      }
      csvBuffer.current = [];
      csvPromiseResolve.current = null;
      return;
    }

    if (csvPromiseResolve.current) {
      csvBuffer.current.push(value);
      console.log("📥 CSV line:", value);

      try {
        const encoder = new TextEncoder();
        await characteristicRef.current.writeValue(encoder.encode("NEXT_CHUNK"));
      } catch (err) {
        console.error("❌ NEXT_CHUNK failed:", err);
      }
    }
  };

  // --- Connect BLE ---
  const connectBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: [SERVICE_UUID],
      });
      setDevice(device);

      const server = await device.gatt.connect();
      setServer(server);
      setConnected(true);

      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHARACTERISTIC_UUID);

      characteristicRef.current = char;

      char.removeEventListener("characteristicvaluechanged", handleNotifications);
      await char.startNotifications();
      char.addEventListener("characteristicvaluechanged", handleNotifications);

      if (user?.posture_thresholds) {
        await sendUserThresholds();
      }

      console.log("✅ BLE connected:", device.name);
    } catch (err) {
      console.error("❌ BLE connection failed:", err);
      setConnected(false);
    }
  };

  // --- Request CSV ---
  const requestCsvFromEsp32 = async () => {
    const char = characteristicRef.current;
    if (!char) throw new Error("No BLE characteristic available");

    const encoder = new TextEncoder();
    await char.writeValue(encoder.encode("GET_CSV"));
    console.log("📡 Requested CSV");

    return new Promise((resolve) => {
      csvBuffer.current = [];
      csvPromiseResolve.current = resolve;
    });
  };

  // --- Delete CSV ---
  const sendDeleteCommand = async () => {
    const char = characteristicRef.current;
    if (!char) throw new Error("No BLE characteristic available");

    const encoder = new TextEncoder();
    await char.writeValue(encoder.encode("DELETE_CSV"));
    console.log("🗑 CSV delete sent");
  };

  // --- Pause logging ---
const pauseLogging = async () => {
  const char = characteristicRef.current;
  if (!char) throw new Error("No BLE characteristic available");

  const encoder = new TextEncoder();
  await char.writeValue(encoder.encode("PAUSE_LOG"));
  console.log("⏸ Logging paused");
};

// --- Resume logging ---
const resumeLogging = async () => {
  const char = characteristicRef.current;
  if (!char) throw new Error("No BLE characteristic available");

  const encoder = new TextEncoder();
  await char.writeValue(encoder.encode("RESUME_LOG"));
  console.log("▶️ Logging resumed");
};

  return (
    <BluetoothContext.Provider
      value={{
        device,
        server,
        connected,
        flexAngle,
        gyroY,
        gyroZ,
        connectBLE,
        sendUserThresholds,
        requestCsvFromEsp32,
        sendDeleteCommand,
        pauseLogging,
        resumeLogging,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
