import { createContext, useState, useContext, useRef } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const { user, token } = useContext(UserContext);

  const characteristicRef = useRef(null);
  const dataLogRef = useRef([]);
  const pendingPainPointsRef = useRef([]); // <-- store clicks temporarily
  const sessionFilenameRef = useRef(`log-${Date.now()}.csv`);

  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);
  const [connected, setConnected] = useState(false);

  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  const [dataLog, setDataLog] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
  const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

  /* =========================
     ADD PAIN POINT
  ========================= */
  const addPainPoint = ({ x, y }) => {
    const timestamp = new Date().toISOString();

    // Save to pending queue
    pendingPainPointsRef.current.push({ timestamp, x, y });

    // Optionally push a dedicated row so it's visible immediately
    const entry = {
      timestamp,
      flex: flexAngle,
      gyroY,
      gyroZ,
      stage: 0,
      painX: x,
      painY: y,
    };
    dataLogRef.current.push(entry);
    setDataLog(prev => [...prev, entry]);

    console.log("Pain point added:", entry);
  };

  

  /* =========================
     BLE NOTIFICATIONS
  ========================= */
  const handleNotifications = (event) => {
    const value = new TextDecoder().decode(event.target.value).trim();
    if (!value.includes(",")) return;

    const [flexStr, yStr, zStr, stageStr] = value.split(",");
    const flex = parseFloat(flexStr);
    const y = parseFloat(yStr);
    const z = parseFloat(zStr);
    const stage = parseInt(stageStr, 10) || 0;

    setFlexAngle(flex);
    setGyroY(y);
    setGyroZ(z);

    // Append a new BLE row
    const entry = {
      timestamp: new Date().toISOString(),
      flex,
      gyroY: y,
      gyroZ: z,
      stage,
      painX: null,
      painY: null,
    };

    dataLogRef.current.push(entry);
    setDataLog(prev => [...prev, entry]);
  };

  /* =========================
     MERGE PENDING PAIN POINTS
  ========================= */
  const mergePendingPainPoints = () => {
    pendingPainPointsRef.current.forEach(p => {
      // Find the closest BLE row by timestamp
      let closest = null;
      let minDiff = Infinity;
      dataLogRef.current.forEach(row => {
        const diff = Math.abs(new Date(row.timestamp) - new Date(p.timestamp));
        if (diff < minDiff) {
          minDiff = diff;
          closest = row;
        }
      });

      if (closest) {
        closest.painX = p.x;
        closest.painY = p.y;
      }
    });

    pendingPainPointsRef.current = [];
};

  /* =========================
     UPLOAD CSV
  ========================= */
 const uploadCSVChunk = async () => {
    if (!dataLogRef.current.length) return;

    // Merge pain clicks into BLE rows
    mergePendingPainPoints();

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
      pendingPainPointsRef.current = [];

      setTimeout(() => setShowUploadPopup(false), 3000);
    } catch (err) {
      console.error("❌ Upload error:", err);
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
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};
