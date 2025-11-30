import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TimeSeriesGraph = ({ logs }) => {
  if (!logs || logs.length === 0)
    return <p className="text-center text-black">No data yet</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={logs}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
        />
        <YAxis unit="°" />
        <Tooltip
          labelFormatter={(ts) => new Date(ts).toLocaleString()}
          formatter={(value, name) => [value.toFixed(2), name]}
        />
        <Legend />
        <Line type="monotone" dataKey="flex" stroke="#60a5fa" dot={false} />
        <Line type="monotone" dataKey="gyroY" stroke="#34d399" dot={false} />
        <Line type="monotone" dataKey="gyroZ" stroke="#f87171" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesGraph;
