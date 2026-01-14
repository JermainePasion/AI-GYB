import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import CSVButton from "../components/CSVButton";
import { BluetoothContext } from "../context/BluetoothContext";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function SettingsScreen() {
  const { token } = useContext(UserContext);
  const { uploadCSVChunk, showUploadPopup } = useContext(BluetoothContext);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/logs/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [token]);

  // Refresh logs automatically after upload
  useEffect(() => {
    if (showUploadPopup) {
      fetchLogs();
    }
  }, [showUploadPopup]);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <h1 className="text-2xl font-bold mb-6">Your CSV Logs</h1>

        {/* Optional: Manual upload button */}
        <button
          onClick={uploadCSVChunk}
          className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
        >
          Upload Current Session CSV
        </button>

        <div className="w-full max-w-md flex flex-col gap-4">
          {logs.length === 0 && (
            <p className="text-gray-300">No CSV logs found.</p>
          )}

          {logs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // latest first
            .map((log) => {
              const date = new Date(log.createdAt);
              const formattedDate = date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <div
                  key={log._id}
                  className="mb-4 p-4 border rounded-lg shadow flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Session Log</span>
                    <span className="text-gray-400 text-sm">{formattedDate}</span>
                  </div>

                  <CSVButton log={log} />
                </div>
              );
            })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsScreen;
