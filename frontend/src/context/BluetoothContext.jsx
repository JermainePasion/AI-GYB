import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user, loading, token } = useContext(UserContext);
  
  const characteristicRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  // --- new: session data log
  const dataLogRef = useRef([]);
  const [dataLog, setDataLog] = useState([]);

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
  const handleNotifications = (event) => {
    const value = new TextDecoder().decode(event.target.value).trim();

    if (value.includes(",")) {
      const parts = value.split(",");
      const flex = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      const z = parseFloat(parts[2]);
      const stage = parseInt(parts[3], 10) || 0; // 0, 1, or 2

      setFlexAngle(flex);
      setGyroY(y);
      setGyroZ(z);

      const newEntry = {
        timestamp: new Date().toLocaleString("sv-SE", { timeZone: "Asia/Manila" }), // 2025-10-02 21:35:12
        flex,
        gyroY: y,
        gyroZ: z,
        stage
      };

        setDataLog((prev) => [...prev, newEntry]);
        dataLogRef.current.push(newEntry);
      }
  };
  // --- Generate CSV from dataLog ---
  const generateCSV = () => {
  const header = "timestamp,flex,gyroY,gyroZ,stage\n"; // include stage
  const rows = dataLog
    .map(
      (row) => `${row.timestamp},${row.flex},${row.gyroY},${row.gyroZ},${row.stage}`
    )
    .join("\n");
  return header + rows;
};
  // --- Upload CSV to backend ---
  const uploadCSV = async (logData = dataLogRef.current) => {
  const header = "timestamp,flex,gyroY,gyroZ,stage\n"; // include stage
  const rows = logData
    .map((row) => `${row.timestamp},${row.flex},${row.gyroY},${row.gyroZ},${row.stage}`)
    .join("\n");
  const csvContent = header + rows;

  try {
    const res = await fetch("http://localhost:3000/api/logs/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        csv: csvContent,
        filename: `log-${Date.now()}.csv`,
      }),
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    console.log("✅ CSV uploaded!", data);

    setDataLog([]);
    dataLogRef.current = [];
  } catch (err) {
    console.error("❌ Upload error:", err);
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

      // 🔌 Handle auto-upload on disconnect
      device.addEventListener("gattserverdisconnected", async () => {
        console.log("📴 BLE disconnected");
        setConnected(false);

        if (dataLogRef.current.length > 0) {
          console.log("📤 Uploading CSV after disconnect...");
          await uploadCSV(dataLogRef.current);
        } else {
          console.log("ℹ️ No data to upload");
        }
      });
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


  return (
    <BluetoothContext.Provider
      value={{
        device,
        server,
        connected,
        flexAngle,
        gyroY,
        gyroZ,
        dataLog,
        connectBLE,
        sendUserThresholds,
        generateCSV,
        uploadCSV,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
