import { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { UserContext } from '../context/UserContext';
import LivePosture from '../components/LivePosture';
import PainInputPosture from '../components/painPoints/PainInputPosture';
import { usePostureLogs } from '../hooks/UsePostureLogs';

import PosturePieChart from '../components/graphs/PosturePieChart';
import SummaryTable from '../components/graphs/SummaryTable';
import TimeSeriesGraph from '../components/graphs/TimeSeriesGraph';
import PostureHeatmap from '../components/graphs/PostureHeatmap';
import FadeInSection from '../components/animation/FadeInSection';

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

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const BACKEND_IP = 'localhost';
const USE_MOCK = true;

function HomeScreen() {
  const [thresholds, setThresholds] = useState(null);
  const [activeView, setActiveView] = useState("live"); // <-- track active view
  const navigate = useNavigate();
  const { user, loading, token } = useContext(UserContext);

  const { logs: rawLogs, loading: logsLoading } = usePostureLogs();
  const [logs, setLogs] = useState({ full: [], sampled: [] });

  const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : null);

  // Sample logs for graph rendering
  useEffect(() => {
    if (rawLogs && rawLogs.length > 0) {
      const sortedLogs = [...rawLogs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      const maxPoints = 1000;
      const step = Math.max(1, Math.floor(sortedLogs.length / maxPoints));
      const sampledLogs = sortedLogs.filter((_, i) => i % step === 0);
      setLogs({ full: sortedLogs, sampled: sampledLogs });
    }
  }, [rawLogs]);

  // Fetch thresholds
  useEffect(() => {
    const fetchThresholds = async () => {
      if (USE_MOCK) {
        setThresholds({ flex_min: 5, flex_max: 25, gyroY_min: -10, gyroY_max: 10, gyroZ_min: -8, gyroZ_max: 8 });
        return;
      }
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/users/thresholds`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const src = res.data?.posture_thresholds ?? res.data ?? {};
        setThresholds({
          flex_min: toNum(src.flex_min), flex_max: toNum(src.flex_max),
          gyroY_min: toNum(src.gyroY_min), gyroY_max: toNum(src.gyroY_max),
          gyroZ_min: toNum(src.gyroZ_min), gyroZ_max: toNum(src.gyroZ_max),
        });
      } catch (err) {
        console.error("Error fetching thresholds", err);
      }
    };
    if (token || USE_MOCK) fetchThresholds();
  }, [token]);

  // Memoize thresholds for bar chart
  const thresholdData = useMemo(() => {
    if (!user?.posture_thresholds) return [];
    return [
      { name: "Spine", Min: user.posture_thresholds.flex_min.toFixed(1), Max: user.posture_thresholds.flex_max.toFixed(1) },
      { name: "Left", Min: user.posture_thresholds.gyroY_min.toFixed(1), Max: user.posture_thresholds.gyroY_max.toFixed(1) },
      { name: "Right", Min: user.posture_thresholds.gyroZ_min.toFixed(1), Max: user.posture_thresholds.gyroZ_max.toFixed(1) },
    ];
  }, [user?.posture_thresholds]);

  if (loading || logsLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading user info and logs...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-10">
        <h1 className="text-6xl font-extrabold text-white text-center">
          Hello, {user?.username}!
        </h1>

        {/* Toggle buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setActiveView("live")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
              ${activeView === "live"
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-gray-200 text-black hover:bg-gray-300 hover:scale-105"}`
            }
          >
            Live Posture
          </button>

          <button
            onClick={() => setActiveView("pain")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300
              ${activeView === "pain"
                ? "bg-blue-500 text-white shadow-md scale-105"
                : "bg-gray-200 text-black hover:bg-gray-300 hover:scale-105"}`
            }
          >
            Pain Input
          </button>
        </div>

        {/* Conditional rendering */}
        <div className="w-full flex flex-col items-center mt-6 relative overflow-hidden">
          <div
            className={`w-full transition-transform duration-500 ease-in-out
              ${activeView === "live" ? "translate-x-0" : "translate-x-full"}`}
          >
            {activeView === "live" && <LivePosture />}
          </div>
          <div
            className={`w-full transition-transform duration-500 ease-in-out
              ${activeView === "pain" ? "translate-x-0" : "-translate-x-full"}`}
          >
            {activeView === "pain" && <PainInputPosture />}
          </div>
        </div>

        {/* Only show thresholds/charts when LivePosture is active */}
        {activeView === "live" && user?.posture_thresholds && (
          <>
            <FadeInSection>
              <div className="max-w-md w-full bg-secondary rounded-2xl p-6 shadow-xl flex flex-col bg-white">
                <p className="text-black mb-4 font-semibold text-center">
                  Your Saved Thresholds
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={thresholdData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="°" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Min"
                      fill="#60a5fa"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey="Max"
                      fill="#34d399"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </FadeInSection>

            <div className="w-full flex flex-col items-center gap-8 mt-8">
              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
                  <h2 className="text-center font-semibold mb-2 text-black">
                    Live Posture Timeline
                  </h2>
                  <TimeSeriesGraph logs={logs.sampled} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl mt-5 bg-white">
                  <h2 className="text-center font-semibold mb-2 text-black">Posture Summary</h2>
                  <PosturePieChart logs={logs.full} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl mt-5 bg-white">
                  <h2 className="text-center font-semibold mb-2 text-black">
                    Posture Rhythm Chart
                  </h2>
                  <PostureHeatmap logs={logs.full} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
                  <h2 className="text-center font-semibold mb-2 text-black">
                    Daily Summary & Trends
                  </h2>
                  <SummaryTable logs={logs.full} />
                </div>
              </FadeInSection>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default HomeScreen;
