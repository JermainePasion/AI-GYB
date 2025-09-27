import { useContext, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { BluetoothContext } from "../context/BluetoothContext";
import { UserContext } from "../context/UserContext";

export default function ConnectionScreen() {
  const { connected, connectBLE, characteristic, flexAngle, gyroY, gyroZ } =
    useContext(BluetoothContext);
  const { user } = useContext(UserContext);

  const [baseline, setBaseline] = useState(null);

  const handleSetBaseline = () => {
    if (!flexAngle && !gyroY && !gyroZ) {
      alert("No sensor data yet!");
      return;
    }
    const newBaseline = { flexAngle, gyroY, gyroZ };
    setBaseline(newBaseline);
    alert("✅ Baseline set:\n" + JSON.stringify(newBaseline, null, 2));
  };

  const sendThresholds = async () => {
    if (!characteristic) {
      alert("Please connect to ESP32 first!");
      return;
    }

    if (!user?.posture_thresholds) {
      alert("No thresholds available! Set thresholds first.");
      return;
    }

    const t = user.posture_thresholds;
    const payload = `${t.flex_min},${t.flex_max},${t.gyroY_min},${t.gyroY_max},${t.gyroZ_min},${t.gyroZ_max}`;
    try {
      const encoder = new TextEncoder();
      await characteristic.writeValue(encoder.encode(payload));
      alert("✅ Thresholds sent!");
      console.log("Thresholds sent:", payload);
    } catch (err) {
      console.error("Failed to send thresholds:", err);
      alert("❌ Failed to send thresholds");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <div className="max-w-md w-full bg-secondary rounded-2xl p-6 shadow-xl bg-[#a4ccd9] flex flex-col gap-4 animate-fadeIn">
          <p className="text-sm">
            Bluetooth Status:{" "}
            <span className="font-bold">
              {connected ? "Connected ✅" : "Disconnected ❌"}
            </span>
          </p>

          <button
            onClick={connectBLE}
            className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 transition"
          >
            🔗 Connect to ESP32
          </button>

          <button
            onClick={sendThresholds}
            disabled={!connected}
            className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 disabled:opacity-50 transition"
          >
            ⬆ Upload Thresholds
          </button>

          <div className="mt-4">
            <p className="font-semibold mb-2">Live Sensor Data:</p>
            <p>Flex Angle: {flexAngle?.toFixed(1) || "--"}°</p>
            <p>Gyro Y: {gyroY?.toFixed(1) || "--"}°</p>
            <p>Gyro Z: {gyroZ?.toFixed(1) || "--"}°</p>
          </div>

          <button
            onClick={handleSetBaseline}
            className="mt-4 w-full py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-red-600 transition"
          >
            Set Baseline
          </button>

          {baseline && (
            <div className="mt-2 text-sm text-gray-200">
              Baseline: {JSON.stringify(baseline)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
