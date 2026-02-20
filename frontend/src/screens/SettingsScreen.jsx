import { useEffect, useState, useContext, useMemo } from "react";
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

  /* =======================
     FETCH LOGS
  ======================== */
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

  useEffect(() => {
    if (showUploadPopup) fetchLogs();
  }, [showUploadPopup]);

  /* =======================
     DELETE LOG
  ======================== */
  const handleDelete = async (logId) => {
    const confirmDelete = window.confirm(
      "Delete this session log permanently?"
    );
    if (!confirmDelete) return;

    setDeletingId(logId);

    try {
      await deleteLog(logId);
      toast.success("Log deleted successfully");
      setLogs((prev) => prev.filter((l) => l._id !== logId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete log");
    } finally {
      setDeletingId(null);
    }
  };

  const sortedLogs = useMemo(() => {
    return [...logs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [logs]);

  return (
    <DashboardLayout>
      <div className="h-screen bg-background text-white flex flex-col">

        {/* Header */}
        <div className="px-6 pt-10 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mt-11">
            Your Session Logs
          </h1>
        </div>

        {/* Scrollable Logs Section */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">

            {sortedLogs.length === 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center text-gray-300">
                No CSV logs found.
              </div>
            )}

            {sortedLogs.map((log) => {
              const date = new Date(log.createdAt);
              const formattedDate = date.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={log._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-md 
                             flex flex-col sm:flex-row sm:items-center sm:justify-between 
                             gap-4 hover:bg-white/10 transition"
                >
                  {/* Log Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">
                      Session Log
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 items-center">

                    {/* Download Button */}
                    <CSVButton log={log}>
                      <span className="material-symbols-outlined text-white">
                        Download
                      </span>
                    </CSVButton>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(log._id)}
                      disabled={deletingId === log._id}
                      className="p-2 bg-red-600 rounded-lg shadow 
                                 hover:bg-red-700 transition 
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined">
                        {deletingId === log._id ? "hourglass_top" : "delete"}
                      </span>
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default SettingsScreen;