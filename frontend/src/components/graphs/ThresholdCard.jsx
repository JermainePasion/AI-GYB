import FadeInSection from "../animation/FadeInSection";
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

function ThresholdCard({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <FadeInSection>
      <div className="w-[380px] bg-secondary rounded-2xl p-6 shadow-xl bg-white">
        <p className="text-black mb-4 font-semibold text-center">
          Your Saved Thresholds
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="°" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Min" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Max" fill="#34d399" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </FadeInSection>
  );
}

export default ThresholdCard;
