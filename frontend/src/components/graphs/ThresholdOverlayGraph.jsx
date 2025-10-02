import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ThresholdOverlayGraph = ({ logs, thresholds }) => {
  if (!logs || logs.length === 0) return <p>No data yet</p>;
  if (!thresholds) return <p>No thresholds defined</p>;

  // Add threshold lines
  const data = logs.map((l) => ({
    ...l,
    flex_max: thresholds.flex_max,
    flex_min: thresholds.flex_min,
    gyroY_max: thresholds.gyroY_max,
    gyroY_min: thresholds.gyroY_min,
    gyroZ_max: thresholds.gyroZ_max,
    gyroZ_min: thresholds.gyroZ_min,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
        />
        <YAxis unit="°" />
        <Tooltip
          labelFormatter={(ts) => new Date(ts).toLocaleString()}
          formatter={(v) => v.toFixed(2)}
        />
        <Legend />
        {/* Sensor Lines */}
        <Line type="monotone" dataKey="flex" stroke="#60a5fa" dot={false} />
        <Line type="monotone" dataKey="gyroY" stroke="#34d399" dot={false} />
        <Line type="monotone" dataKey="gyroZ" stroke="#f87171" dot={false} />
        {/* Threshold Lines */}
        <Line type="monotone" dataKey="flex_max" stroke="#3b82f6" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="flex_min" stroke="#3b82f6" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="gyroY_max" stroke="#10b981" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="gyroY_min" stroke="#10b981" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="gyroZ_max" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="gyroZ_min" stroke="#ef4444" strokeDasharray="5 5" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ThresholdOverlayGraph;
