import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext"; // adjust path if needed
import SensorGauge from "./SensorGauge";
import Skeleton3D from "./skeleton";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

const USE_MOCK = false;

function FrontViewHuman({ flexAngle, gyroY, gyroZ }) {
  return (
    <div className="w-full h-[400px]">
      <Skeleton3D
        flexAngle={flexAngle}
        gyroY={gyroY}
        gyroZ={gyroZ}
        cameraPosition={[0, 1.5, 5]} // front view
      />
    </div>
  );
}

function SideViewHuman({ flexAngle, gyroY, gyroZ }) {
  return (
    <div className="w-full h-[400px]">
      <Skeleton3D
        flexAngle={flexAngle}
        gyroY={gyroY}
        gyroZ={gyroZ}
        cameraPosition={[5, 1.5, 0]} // side view
      />
    </div>
  );
}

export default function LivePosture() {
  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);
  const [connected, setConnected] = useState(false);
  const [characteristic, setCharacteristic] = useState(null);

  const { user } = useContext(UserContext);

  // --- BLE Connect ---
  async function connectBLE() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "AI-GYB" }],
        optionalServices: [SERVICE_UUID],
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
      setCharacteristic(characteristic);

      await characteristic.startNotifications();
      setConnected(true);

      characteristic.addEventListener("characteristicvaluechanged", (event) => {
        const value = new TextDecoder().decode(event.target.value);
        const [flex, y, z] = value.split(",").map(parseFloat);

        setFlexAngle(flex);
        setGyroY(y);
        setGyroZ(z);
      });

      // === Send user thresholds once connected ===
      if (user?.posture_thresholds) {
        const {
          flex_min,
          flex_max,
          gyroY_min,
          gyroY_max,
          gyroZ_min,
          gyroZ_max,
        } = user.posture_thresholds;

        const thresholdsString = `${flex_min},${flex_max},${gyroY_min},${gyroY_max},${gyroZ_min},${gyroZ_max}`;
        console.log("Sending thresholds:", thresholdsString);

        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode(thresholdsString));
      }
    } catch (err) {
      console.error("BLE Connection failed:", err);
    }
  }

  useEffect(() => {
    if (!USE_MOCK) {
      connectBLE();
    } else {
      // mock fallback
      const interval = setInterval(() => {
        setFlexAngle((p) => (p + 1) % 45);
        setGyroY((p) => (p + 1) % 70);
        setGyroZ((p) => (p + 1) % 40);
      }, 100);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background text-gray-800 py-5 w-full px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Live Posture</h1>

      {/* Connect button */}
      {!connected && (
        <button
          onClick={connectBLE}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Connect to ESP32
        </button>
      )}

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Gauges */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <SensorGauge title="Flex Sensor" angle={flexAngle} maxAngle={45} sensor="flex" />
          <SensorGauge title="Gyro Y (Front/Back)" angle={gyroY} maxAngle={70} sensor="gyroY" />
          <SensorGauge title="Gyro Z (Side Tilt)" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
        </div>

        {/* Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:w-2/3">
          <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-2">Front View</h2>
            <FrontViewHuman flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} />
          </div>
          <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white">
            <h2 className="text-lg font-semibold mb-2">Side View</h2>
            <SideViewHuman flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} />
          </div>
        </div>
      </div>
    </div>
  );
}
