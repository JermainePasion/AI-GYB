import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { UserContext } from '../context/UserContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ESP_IP = '192.168.100.66';
const BACKEND_IP = 'localhost'; // try localhost first for testing
const USE_MOCK = false; // CHANGE TO TRUE IF U ARE JERROLD
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

function ConnectionScreen() {

  const [data, setData] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [thresholds, setThresholds] = useState(null);

  // New Bluetooth states
  const [btDevice, setBtDevice] = useState(null);
  const [btServer, setBtServer] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  const navigate = useNavigate();
  const { user, loading, token } = useContext(UserContext);

  const POLL_INTERVAL = 1000; 
  const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);
  // Fetch thresholds from backend
const fetchThresholds = async () => {
  if (USE_MOCK) {
    // mock thresholds for teammate
    const mockThresholds = {
      flex_min: 5,
      flex_max: 25,
      gyroY_min: -10,
      gyroY_max: 10,
      gyroZ_min: -8,
      gyroZ_max: 8
    };
    setThresholds(mockThresholds);
    return;
  }

  if (!token) {
    console.warn("No token yet, skipping thresholds fetch");
    return;
  }

  try {
    console.log("Fetching thresholds with token:", token);
    const res = await axios.get(`http://${BACKEND_IP}:3000/api/users/thresholds`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const norm = normalizeThresholds(res.data);
    setThresholds(norm);
  } catch (err) {
    console.error("Error fetching thresholds", err.response?.data || err.message || err);
  }
};

  // Fetch mock or real sensor data
  const fetchSensorData = async () => {
    if (USE_MOCK) {
      const mockData = {
        angleY: Math.random() * 60 - 30,
        angleZ: Math.random() * 40 - 20,
        flexAngle: Math.random() * 40
      };
      setData(mockData);
      return;
    }

    try {
      const response = await axios.get(`http://${ESP_IP}/read`);
      setData(response.data);

      await axios.post(`http://${BACKEND_IP}:3000/log`, response.data);
    } catch (err) {
      console.error("Error fetching sensor data", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchThresholds();
    }
  }, [token]);

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleSetBaseline = () => {
    if (!data) {
      alert("No data yet.");
      return;
    }
    const newBaseline = {
      angleY: data.angleY,
      angleZ: data.angleZ,
      flexAngle: data.flexAngle,
    };
    setBaseline(newBaseline);
    alert("✅ Baseline set:\n" + JSON.stringify(newBaseline, null, 2));
  };

  const handleClick = () => {
    navigate('/figures');
  };

  // Bluetooth connect
  const connectBluetooth = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],        // ESP32 BLE name
        optionalServices: [SERVICE_UUID]      // must match ESP32 service UUID
      });
      setBtDevice(device);

      const server = await device.gatt.connect();
      setBtServer(server);
      setConnectionStatus("Connected");
    } catch (err) {
      console.error("Bluetooth connection failed", err);
      setConnectionStatus("Failed");
    }
  };

const normalizeThresholds = (t) => {
  // Your API sometimes returns { posture_thresholds: { ... } } or { ... }.
  const src = t?.posture_thresholds ?? t ?? {};
  const norm = {
    flex_min: toNum(src.flex_min),
    flex_max: toNum(src.flex_max),
    gyroY_min: toNum(src.gyroY_min),
    gyroY_max: toNum(src.gyroY_max),
    gyroZ_min: toNum(src.gyroZ_min),
    gyroZ_max: toNum(src.gyroZ_max),
  };
  return norm;
};

const allSixFinite = (o) => Object.values(o).every(Number.isFinite);

  // Send thresholds to ESP32
  const sendThresholds = async () => {
  if (!thresholds) {
    alert("No thresholds to send!");
    return;
  }
  if (!btServer) {
    alert("Please connect to ESP32 first!");
    return;
  }

  const norm = normalizeThresholds(thresholds);
  if (!allSixFinite(norm)) {
    alert("Your thresholds are incomplete. Please generate/set thresholds first.");
    console.warn("Refusing to send invalid thresholds:", norm);
    return;
  }

  try {
    const payload = [
      norm.flex_min.toFixed(2),
      norm.flex_max.toFixed(2),
      norm.gyroY_min.toFixed(2),
      norm.gyroY_max.toFixed(2),
      norm.gyroZ_min.toFixed(2),
      norm.gyroZ_max.toFixed(2),
    ].join(",") + "\n";

    console.log("Sending thresholds payload:", payload);

    const encoder = new TextEncoder();
    const service = await btServer.getPrimaryService(SERVICE_UUID);
    const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
    await characteristic.writeValue(encoder.encode(payload));

    alert("✅ Thresholds sent to ESP32 via Bluetooth!");
  } catch (err) {
    console.error("Failed to send thresholds", err);
  }
};

useEffect(() => {
  fetchThresholds();
  fetchSensorData();
  const interval = setInterval(() => {
    fetchThresholds();
    fetchSensorData();
  }, POLL_INTERVAL);
  return () => clearInterval(interval);
}, [token]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <div className=" max-w-md w-full bg-secondary rounded-2xl p-6 shadow-xl bg-[#a4ccd9]  flex flex-col animate-fadeIn">

        {/* Bluetooth status */}
        <p className="mt-2 text-sm text-gray-300">
          Bluetooth Status: <span className="font-bold">{connectionStatus}</span>
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={connectBluetooth}
            className="px-3 py-1 rounded bg-blue-500 text-sm hover:bg-blue-600"
          >
            🔗 Connect
          </button>
          <button
            onClick={sendThresholds}
            disabled={!btServer}
            className="px-3 py-1 rounded bg-green-500 text-sm hover:bg-green-600 disabled:opacity-50"
          >
            ⬆ Upload Thresholds
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          {data ? (
            <>
              <div className="space-y-4 mt-4">
                <DataCard label="Angle Y" value={`${data.angleY.toFixed(2)}°`} />
                <DataCard label="Angle Z" value={`${data.angleZ.toFixed(2)}°`} />
                <DataCard label="Flex Angle" value={`${data.flexAngle.toFixed(1)}°`} />
              </div>

              <button
                onClick={handleSetBaseline}
                className="mt-6 w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold shadow hover:bg-red-600 transition duration-200"
              >
                Set Baseline
              </button>
            </>
          ) : (
            <p className="text-center text-gray-400 text-sm mt-6">
              Loading sensor data...
            </p>
          )}

          <div className="pt-6">
            <button
              onClick={handleClick}
              className="w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold shadow hover:bg-green-600 transition duration-200"
            >
              Go to Figures Page
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default ConnectionScreen