import { useEffect, useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import { UserContext } from '../context/UserContext';
import LivePosture from '../components/LivePosture';
import PainInputPosture from '../components/painPoints/PainInputPosture';
import { usePostureLogs } from '../hooks/UsePostureLogs';

import ThresholdCard from '../components/graphs/ThresholdCard';
import PosturePieChart from '../components/graphs/PosturePieChart';
import SummaryTable from '../components/graphs/SummaryTable';
import TimeSeriesGraph from '../components/graphs/TimeSeriesGraph';
import PostureHeatmap from '../components/graphs/PostureHeatmap';
import FadeInSection from '../components/animation/FadeInSection';

import GraphHeader from '../components/graphs/GraphHeader';

import { getThresholds } from '../api/users';
import Spinner from '../components/Spinner/Spinner';
const USE_MOCK = true;

function HomeScreen() {
  const [thresholds, setThresholds] = useState(null);
  const [activeView, setActiveView] = useState("live");
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
        setThresholds({
          flex_min: 5,
          flex_max: 25,
          gyroY_min: -10,
          gyroY_max: 10,
          gyroZ_min: -8,
          gyroZ_max: 8,
        });
        return;
      }

      if (!token) return;

      try {
        const res = await getThresholds();

        const src = res.data?.posture_thresholds ?? res.data ?? {};

        setThresholds({
          flex_min: toNum(src.flex_min),
          flex_max: toNum(src.flex_max),
          gyroY_min: toNum(src.gyroY_min),
          gyroY_max: toNum(src.gyroY_max),
          gyroZ_min: toNum(src.gyroZ_min),
          gyroZ_max: toNum(src.gyroZ_max),
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
      { name: "Tilt", Min: user.posture_thresholds.gyroY_min.toFixed(1), Max: user.posture_thresholds.gyroY_max.toFixed(1) },
      { name: "Side", Min: user.posture_thresholds.gyroZ_min.toFixed(1), Max: user.posture_thresholds.gyroZ_max.toFixed(1) },
    ];
  }, [user?.posture_thresholds]);

  if (loading || logsLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          <Spinner/>
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
          <div className="w-full mt-6 relative overflow-hidden">

            <div
              className={`w-full transition-transform duration-500 ease-in-out
                ${activeView === "live" ? "translate-x-0" : "translate-x-full"}`}
            >
              {activeView === "live" && (
                <div className="relative w-full flex flex-col items-center lg:block">
                  <div className="w-full max-w-4xl mx-auto">
                    <LivePosture />
                  </div>
                  {user?.posture_thresholds && (
                    <div
                      className="
                        mt-6
                        flex justify-center
                        w-full
                        max-w-[260px] sm:max-w-[280px]
                        lg:absolute lg:right-0 lg:top-0
                        lg:w-[300px] lg:max-w-none
                      "
                    >
                      <ThresholdCard data={thresholdData} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              className={`w-full transition-transform duration-500 ease-in-out
                ${activeView === "pain" ? "translate-x-0" : "-translate-x-full"}`}
            >
              {activeView === "pain" && <PainInputPosture />}
            </div>

          </div>

        {activeView === "live" && user?.posture_thresholds && (
          <>
            <div className="w-full flex flex-col items-center gap-8 mt-10">
              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
                  <GraphHeader
                    title="Live Posture Timeline"
                    description="Displays real-time flex and gyroscope angles throughout your session. Helps detect posture imbalance trends."
                  />
                  <TimeSeriesGraph logs={logs.sampled} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl mt-5 bg-white">
                  <GraphHeader
                    title="Posture Summary"
                    description="Shows the distribution of good, mild, and severe posture stages for this session."
                  />
                  <PosturePieChart logs={logs.full} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl mt-5 bg-white">
                  <GraphHeader
                    title="Posture Rhythm Chart"
                    description="Breaks down posture stages by hour to reveal daily posture patterns."
                  />
                  <PostureHeatmap logs={logs.full} />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
                  <GraphHeader
                    title="Daily Summary & Trends"
                    description="Displays average sensor angles and total posture stage counts for the selected period."
                  />
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
