import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PosturePieChart = ({ logs }) => {
  if (!logs || logs.length === 0)
    return <p className="text-center text-black">No data yet</p>;

  const good = logs.filter((l) => l.stage === 0).length;
  const bad = logs.filter((l) => l.stage > 0).length;

  const data = [
    { name: "Good Posture", value: good },
    { name: "Bad Posture", value: bad },
  ];

  const COLORS = ["#60a5fa", "#f87171"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PosturePieChart;
