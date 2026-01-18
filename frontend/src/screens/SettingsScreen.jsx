import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import CSVButton from "../components/CSVButton";
import { BluetoothContext } from "../context/BluetoothContext";
import { toast } from "react-toastify";
import { getMyLogs, deleteLog } from "../api/logs";

function SettingsScreen() {
  const { token } = useContext(UserContext);
  const { showUploadPopup } = useContext(BluetoothContext);

  const [logs, setLogs] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLogs = async () => {
    if (!token) return;
    try {
      const res = await getMyLogs();
      setLogs(res.data);
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

  /* =====================
     DELETE LOG
  ===================== */
  const handleDelete = async (logId) => {
    const confirm = window.confirm("Delete this log permanently?");
    if (!confirm) return;

    setDeletingId(logId);

    try {
      await deleteLog(logId);
      toast.success("Log deleted");
      setLogs((prev) => prev.filter((l) => l._id !== logId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete log");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <h1 className="text-2xl font-bold mb-6">Your Logs</h1>

        <div className="w-full max-w-md flex flex-col gap-4">
          {logs.length === 0 && (
            <p className="text-gray-300">No CSV logs found.</p>
          )}

          {logs
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                  className="p-4 border rounded-lg shadow flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">Session Log</span>
                    <span className="text-gray-400 text-sm">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <CSVButton log={log} />

                    <button
                      onClick={() => handleDelete(log._id)}
                      disabled={deletingId === log._id}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {deletingId === log._id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsScreen;
