import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user, token } = useContext(UserContext);

  const characteristicRef = useRef(null);
  const dataLogRef = useRef([]);
  const sessionFilenameRef = useRef(`log-${Date.now()}.csv`);

  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  const [dataLog, setDataLog] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const pendingPainRef = useRef(null);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  /* =========================
     ADD PAIN POINT
  ========================= */
  const addPainPoint = ({ x, y }) => {
  pendingPainRef.current = { x, y };
  console.log("🩸 Pain queued:", x, y);
};


  
  const lastCsvLogTimeRef = useRef(0);
  /* =========================
     BLE NOTIFICATIONS
  ========================= */
  const handleNotifications = (event) => {
    const value = new TextDecoder().decode(event.target.value).trim();
    if (!value.includes(",")) return;

    const [flexStr, yStr, zStr, stageStr] = value.split(",");

    const flex = parseFloat(flexStr);
    const gyroY = parseFloat(yStr);
    const gyroZ = parseFloat(zStr);
    const stage = parseInt(stageStr, 10) || 0;

    // ✅ INSTANT UI FEEDBACK (unchanged)
    setFlexAngle(flex);
    setGyroY(gyroY);
    setGyroZ(gyroZ);

    // ✅ REDUCED CSV LOGGING (1 Hz)
    const now = Date.now();
    if (now - lastCsvLogTimeRef.current < 1000) return;
    lastCsvLogTimeRef.current = now;

    const entry = {
      timestamp: new Date(now).toISOString(),
      flex,
      gyroY,
      gyroZ,
      stage,
      painX: 0,
      painY: 0,
    };

    if (pendingPainRef.current) {
      entry.painX = pendingPainRef.current.x * 1000;
      entry.painY = pendingPainRef.current.y * 1000;
      pendingPainRef.current = null;
    }

    dataLogRef.current.push(entry);
    setDataLog(prev => [...prev, entry]);
  };

  /* =========================
     UPLOAD CSV
  ========================= */
 const uploadCSVChunk = async () => {
    if (!dataLogRef.current.length) return;

    const header = "timestamp,flex,gyroY,gyroZ,stage,painX,painY\n";
    const rows = dataLogRef.current
      .map(r =>
        `${r.timestamp},${r.flex},${r.gyroY},${r.gyroZ},${r.stage},${r.painX ?? 0},${r.painY ?? 0}`
      )
      .join("\n");

    try {
      const res = await fetch("http://localhost:3000/api/logs/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          csv: header + rows,
          filename: sessionFilenameRef.current,
          append: false,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");
      await res.json();

      toast.success("CSV upload completed successfully");
      setShowUploadPopup(true);

      setDataLog([]);
      dataLogRef.current = [];

      setTimeout(() => setShowUploadPopup(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  /* =========================
     SEND THRESHOLDS
  ========================= */
  const sendUserThresholds = async () => {
    if (!characteristicRef.current || !user?.posture_thresholds) return;

    const t = user.posture_thresholds;
    const payload = `${t.flex_min},${t.flex_max},${t.gyroY_min},${t.gyroY_max},${t.gyroZ_min},${t.gyroZ_max}`;

    try {
      await characteristicRef.current.writeValue(
        new TextEncoder().encode(payload)
      );
    } catch (err) {
      console.error("❌ Failed to send thresholds:", err);
    }
  };

  /* =========================
     BLE CONNECT
  ========================= */
  const connectBLE = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: [SERVICE_UUID],
      });

      setDevice(device);

      device.addEventListener("gattserverdisconnected", async () => {
        setConnected(false);
        if (dataLogRef.current.length) await uploadCSVChunk();
      });

      const server = await device.gatt.connect();
      setServer(server);
      setConnected(true);

      const service = await server.getPrimaryService(SERVICE_UUID);
      const char = await service.getCharacteristic(CHARACTERISTIC_UUID);
      characteristicRef.current = char;

      await char.startNotifications();
      char.addEventListener("characteristicvaluechanged", handleNotifications);

      if (user?.posture_thresholds) await sendUserThresholds();
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
        addPainPoint,
        isUploading,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
