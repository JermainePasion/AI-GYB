import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user, token } = useContext(UserContext);
  const characteristicRef = useRef(null);
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  const dataLogRef = useRef([]);
  const [dataLog, setDataLog] = useState([]);

  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  // --- Session filename (one per BLE session) ---
  const sessionFilenameRef = useRef(`log-${Date.now()}.csv`);
  
  // pang notification ng bluetooth delay
  let lastNotificationTime = null; 
  const [latencyLog, setLatencyLog] = useState([]);
  const latencyLogRef = useRef([]);

  // --- Notification handler ---
  const handleNotifications = (event) => {
  const now = performance.now(); 

  // 🔹 Compute BLE latency
  if (lastNotificationTime !== null) {
    const latency = now - lastNotificationTime;

    // Save latency
    const latencyEntry = {
      timestamp: new Date().toISOString(),
      latency: latency.toFixed(2) // ms
    };

    setLatencyLog(prev => [...prev, latencyEntry]);
    latencyLogRef.current.push(latencyEntry);

    console.log("BLE Latency:", latencyEntry.latency, "ms");
  }

  lastNotificationTime = now;

  // 🔹 Existing parsing
  const value = new TextDecoder().decode(event.target.value).trim();

  if (value.includes(",")) {
    const [flexStr, yStr, zStr, stageStr] = value.split(",");
    const flex = parseFloat(flexStr);
    const y = parseFloat(yStr);
    const z = parseFloat(zStr);
    const stage = parseInt(stageStr, 10) || 0;

    setFlexAngle(flex);
    setGyroY(y);
    setGyroZ(z);

    const newEntry = {
      timestamp: new Date().toISOString(),
      flex,
      gyroY: y,
      gyroZ: z,
      stage
    };

    setDataLog(prev => [...prev, newEntry]);
    dataLogRef.current.push(newEntry);
  }
};


  // --- Chunked CSV upload ---
const uploadCSVChunk = async (chunkSize = 500) => {
  if (!dataLogRef.current.length) return;

  const chunks = [];
  for (let i = 0; i < dataLogRef.current.length; i += chunkSize) {
    chunks.push(dataLogRef.current.slice(i, i + chunkSize));
  }

  for (const [index, chunk] of chunks.entries()) {
    const header = index === 0 ? "timestamp,flex,gyroY,gyroZ,stage\n" : "";
    const rows = chunk
      .map(r => `${r.timestamp},${r.flex},${r.gyroY},${r.gyroZ},${r.stage}`)
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
          filename: sessionFilenameRef.current,
          append: true, // backend will append
        }),
      });

      if (!res.ok) throw new Error("Upload failed");
      await res.json();
    } catch (err) {
      console.error("❌ Upload chunk error:", err);
    }
  }

  setDataLog([]);
  dataLogRef.current = [];
  setShowUploadPopup(true); 

  console.log("CSV uploaded! All chunks successfully sent.");

  setTimeout(() => setShowUploadPopup(false), 3000);
};

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

  // --- BLE connection ---
  const connectBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: [SERVICE_UUID],
      });
      setDevice(device);

      device.addEventListener("gattserverdisconnected", async () => {
        setConnected(false);
        if (dataLogRef.current.length > 0) {
          console.log("Uploading remaining data on disconnect.");
          await uploadCSVChunk();
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
        uploadCSVChunk,
        showUploadPopup,
        latencyLog,            // <-- ADD THIS
        latencyLogRef
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
