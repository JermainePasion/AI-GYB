import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import { BluetoothContext } from "../context/BluetoothContext";
import CSVButton from "../components/CSVButton";

function ConnectionScreen() {
  const navigate = useNavigate();
  const { user, token } = useContext(UserContext);
  const {
    connected,
    flexAngle,
    gyroY,
    gyroZ,
    connectBLE,
  } = useContext(BluetoothContext);
  const [logs, setLogs] = useState([]);

  const goToControl = () => navigate("/control");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("http://localhost:3000/api/logs/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLogs(data);
    };

    fetchLogs();
  }, []);


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <div className="max-w-md w-full bg-secondary rounded-2xl p-6 shadow-xl bg-[#a4ccd9] flex flex-col animate-fadeIn">

          {/* Bluetooth Status */}
          <p className="mt-2 text-sm text-gray-300">
            Bluetooth Status: <span className="font-bold">{connected ? "Connected" : "Disconnected"}</span>
          </p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={connectBLE}
              className="px-3 py-1 rounded bg-[#8DBCC7] text-sm hover:bg-[#638f99]"
            >
            Connect
            </button>
          </div>

          {/* Sensor Data */}
          <div className="space-y-4 mt-4">
            <DataCard label="Flex Angle" value={`${flexAngle.toFixed(2)}°`} />
            <DataCard label="Gyro Y" value={`${gyroY.toFixed(2)}°`} />
            <DataCard label="Gyro Z" value={`${gyroZ.toFixed(2)}°`} />
          </div>

          <div className="pt-6">
            <button
              onClick={goToControl}
              className="w-full py-2 rounded-lg bg-primary text-black text-sm font-semibold shadow hover:bg-[#EBFFD8]  transition duration-200"
            >
              Go to Control Page
            </button>
          </div>
           {logs.map((log) => (
        <div key={log._id} className="mb-4 p-4 border rounded-lg shadow mt-5">
          <p className="mb-2">{log.filename}</p>
          <CSVButton log={log} />
        </div>
      ))}
        </div>

        
      </div>
    </DashboardLayout>
  );
}

const DataCard = ({ label, value }) => (
  <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center text-sm">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

export default ConnectionScreen;
