import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import TimeSeriesGraph from "../components/graphs/TimeSeriesGraph";
import PosturePieChart from "../components/graphs/PosturePieChart";
import PostureHeatmap from "../components/graphs/PostureHeatmap";
import SummaryTable from "../components/graphs/SummaryTable";
import FadeInSection from "../components/animation/FadeInSection";
import { UsePatientLogs } from "../hooks/usePatientLogs";
import { getUserById } from "../api/users";

const BACKEND_IP = "localhost";

export default function PatientGraphs() {
  const { id } = useParams();
  const { token } = useContext(UserContext);

  const { logs, loading: logsLoading } = UsePatientLogs(id);

  const [patientData, setPatientData] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(true);

  // Fetch patient's basic info (name, etc.)
  useEffect(() => {
    if (!token || !id) return;

    const fetchPatient = async () => {
      setLoadingPatient(true);
      try {
        const res = await getUserById(id);
        setPatientData(res.data);
      } catch (err) {
        console.error("Failed to fetch patient info:", err);
        setPatientData(null);
      } finally {
        setLoadingPatient(false);
      }
    };

    fetchPatient();
  }, [token, id]);

  if (loadingPatient || logsLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading patient data and logs...
        </div>
      </DashboardLayout>
    );
  }

  if (!patientData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center text-white">
          Patient not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {patientData.username}'s Posture Graphs
        </h1>
      </div>

      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-4 mt-4 w-full">
        <div className="w-full flex flex-col items-center gap-8 mt-4">

          <FadeInSection>
            <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
              <h2 className="text-center font-semibold mb-2 text-black">Live Posture Timeline</h2>
              <TimeSeriesGraph logs={logs.sampled} />
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
              <h2 className="text-center font-semibold mb-2 text-black">Posture Summary</h2>
              <PosturePieChart logs={logs.full} />
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
              <h2 className="text-center font-semibold mb-2 text-black">Posture Rhythm Chart</h2>
              <PostureHeatmap logs={logs.full} />
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="w-full max-w-6xl bg-secondary rounded-2xl p-4 shadow-xl bg-white">
              <h2 className="text-center font-semibold mb-2 text-black">Daily Summary & Trends</h2>
              <SummaryTable logs={logs.full} />
            </div>
          </FadeInSection>

        </div>
      </div>
    </DashboardLayout>
  );
}
