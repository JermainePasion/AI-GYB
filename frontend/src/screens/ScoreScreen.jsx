import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { usePostureLogs } from "../hooks/UsePostureLogs";

import OverallScore from "../components/scores/OverallScore";
import LongestStreak from "../components/scores/LongestStreak";
import PainInputPosture from "../components/painPoints/PainInputPosture";


function ScoreScreen() {
  const { logs, loading } = usePostureLogs();
  const [processedLogs, setProcessedLogs] = useState([]);

  useEffect(() => {
    if (logs && logs.length > 0) {
      const sorted = [...logs].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setProcessedLogs(sorted);
    }
  }, [logs]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading posture logs...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-6 mt-10">
        <h1 className="text-5xl font-extrabold text-white text-center mb-8">
          Your Posture Score
        </h1>

        <div className="w-full max-w-6xl bg-secondary rounded-2xl p-6 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transition-transform duration-300 hover:scale-105">
              <OverallScore logs={processedLogs} />
            </div>
            <div className="transition-transform duration-300 hover:scale-105 ">
              <LongestStreak logs={processedLogs} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ScoreScreen;
