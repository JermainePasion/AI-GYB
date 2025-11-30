import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import CSVButton from "../components/CSVButton";

function SettingsScreen() {
  const { token } = useContext(UserContext);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/logs/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, [token]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <h1 className="text-2xl font-bold mb-6">Your CSV Logs</h1>
        <div className="w-full max-w-md flex flex-col gap-4">
          {logs.length === 0 && (
            <p className="text-gray-300">No CSV logs found.</p>
          )}

          {logs.map((log) => (
            <div
              key={log._id}
              className="mb-4 p-4 border rounded-lg shadow flex justify-between items-center"
            >
              <span className="font-medium">{log.filename}</span>
              <CSVButton log={log} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsScreen;
