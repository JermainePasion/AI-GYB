import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchPatientLogs } from "../api/logs";
import Papa from "papaparse";

export const UsePatientLogs = (patientId) => {
  const { token } = useContext(UserContext);
  const [logs, setLogs] = useState({ full: [], sampled: [] });
  const [loading, setLoading] = useState(true);

  const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

  useEffect(() => {
    if (!token || !patientId) return;

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await fetchPatientLogs(patientId);

        if (!res.data || res.data.length === 0) {
          setLogs({ full: [], sampled: [] });
          return;
        }

        // Use latest log
        const latestCsv = res.data[0].data;

        // Parse CSV
        const parsed = Papa.parse(latestCsv, {
          header: true,
          skipEmptyLines: true,
        });

        const parsedLogs = parsed.data.map((row) => ({
          timestamp: new Date(row.timestamp),
          flex: toNum(row.flex),
          gyroY: toNum(row.gyroY),
          gyroZ: toNum(row.gyroZ),
          stage: row.stage !== undefined ? parseInt(row.stage, 10) : null,
        }));

        // Sort by time
        const sortedLogs = parsedLogs.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Downsample if large
        const maxPoints = 1000;
        const step = Math.max(1, Math.floor(sortedLogs.length / maxPoints));
        const sampledLogs = sortedLogs.filter((_, i) => i % step === 0);

        setLogs({ full: sortedLogs, sampled: sampledLogs });
      } catch (err) {
        console.error("Failed to fetch patient logs:", err);
        setLogs({ full: [], sampled: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token, patientId]);

  return { logs, loading };
};
