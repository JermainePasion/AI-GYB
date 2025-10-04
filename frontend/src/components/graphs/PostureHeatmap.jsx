import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PostureHeatmap = ({ logs }) => {
  if (!logs || logs.length === 0) return <p>No data yet</p>;

  // Group logs by hour of the day
  const hourlyMap = {};
  logs.forEach((l) => {
    const hour = new Date(l.timestamp).getHours(); // 0-23
    if (!hourlyMap[hour]) hourlyMap[hour] = { hour, stage0: 0, stage1: 0, stage2: 0 };
    if (l.stage === 0) hourlyMap[hour].stage0++;
    if (l.stage === 1) hourlyMap[hour].stage1++;
    if (l.stage === 2) hourlyMap[hour].stage2++;
  });

  const data = Object.values(hourlyMap).sort((a, b) => a.hour - b.hour);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="stage0" stackId="a" fill="#60a5fa" name="Good (0)" />
        <Bar dataKey="stage1" stackId="a" fill="#fbbf24" name="Mild (1)" />
        <Bar dataKey="stage2" stackId="a" fill="#ef4444" name="Severe (2)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PostureHeatmap;
