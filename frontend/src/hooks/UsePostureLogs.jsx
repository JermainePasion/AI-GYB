import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

// Hook to fetch posture logs for the current user
export const usePostureLogs = () => {
  const { token } = useContext(UserContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/logs/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert CSV string to structured array
        const allLogs = [];
        res.data.forEach((log) => {
          const lines = log.data.split("\n");
          const header = lines.shift(); // remove header
          lines.forEach((line) => {
            if (!line) return;
            const [timestamp, flex, gyroY, gyroZ, stage] = line.split(",");
            allLogs.push({
              timestamp,
              flex: parseFloat(flex),
              gyroY: parseFloat(gyroY),
              gyroZ: parseFloat(gyroZ),
              stage: parseInt(stage, 10),
            });
          });
        });

        setLogs(allLogs);
      } catch (err) {
        console.error("Failed to fetch posture logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  return { logs, loading };
};
