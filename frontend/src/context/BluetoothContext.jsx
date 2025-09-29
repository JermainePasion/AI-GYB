import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  // CSV buffering refs (so state doesn’t reset mid-transfer)
  const csvBuffer = useRef([]);
  const csvPromiseResolve = useRef(null);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  // --- Send thresholds to ESP32 ---
  const sendUserThresholds = async () => {
    if (!characteristic || !user?.posture_thresholds) return;

    const t = user.posture_thresholds;
    const payload = `${t.flex_min},${t.flex_max},${t.gyroY_min},${t.gyroY_max},${t.gyroZ_min},${t.gyroZ_max}`;

    try {
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(payload));
      console.log("✅ Thresholds sent to ESP32:", payload);
    } catch (err) {
      console.error("Failed to send thresholds:", err);
    }
  };

  // --- Unified notification handler ---
  const handleNotifications = (event) => {
    const value = new TextDecoder().decode(event.target.value).trim();

    // --- If posture update ---
    if (value.includes(",")) {
      const [flex, y, z] = value.split(",").map(parseFloat);
      setFlexAngle(flex);
      setGyroY(y);
      setGyroZ(z);
      console.log("📡 Posture update:", value);
      return;
    }

    // --- If CSV streaming ---
    if (value === "END_CSV") {
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
    }
  };

  // --- Connect to BLE ---
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

      // Clear old listener
      char.removeEventListener("characteristicvaluechanged", handleNotifications);

      // Save and start
      setCharacteristic(char);
      await char.startNotifications();
      char.addEventListener("characteristicvaluechanged", handleNotifications);

      // Send thresholds immediately after connecting
      if (user?.posture_thresholds) {
        await sendUserThresholds();
      }

      console.log("✅ BLE connected:", device.name);
    } catch (err) {
      console.error("BLE connection failed:", err);
      setConnected(false);
    }
  };

  // --- Request CSV (line-by-line streaming) ---
  const requestCsvFromEsp32 = async () => {
    if (!characteristic) throw new Error("No BLE characteristic available");

    const encoder = new TextEncoder();
    try {
      await characteristic.writeValue(encoder.encode("GET_CSV"));
    } catch (err) {
      console.error("❌ Failed to request CSV:", err);
      throw err;
    }

    return new Promise((resolve) => {
      csvBuffer.current = [];
      csvPromiseResolve.current = resolve;
    });
  };


  // --- Send delete command to ESP32 ---
  const sendDeleteCommand = async () => {
    if (!characteristic) throw new Error("No BLE characteristic available");

    const encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode("DELETE_CSV"));
    console.log("🗑 Delete command sent to ESP32");
  };

  return (
    <BluetoothContext.Provider
      value={{
        device,
        server,
        characteristic,
        connected,
        flexAngle,
        gyroY,
        gyroZ,
        connectBLE,
        sendUserThresholds,
        requestCsvFromEsp32,
        sendDeleteCommand,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
