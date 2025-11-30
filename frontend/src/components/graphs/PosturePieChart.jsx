import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PosturePieChart = ({ logs }) => {
  if (!logs || logs.length === 0)
    return <p className="text-center text-black">No data yet</p>;

  // Count occurrences of each stage
  const stageCounts = [0, 1, 2].map(
    (stage) => logs.filter((l) => l.stage === stage).length
  );

  const data = [
    { name: "Stage 0 (Good)", value: stageCounts[0] },
    { name: "Stage 1", value: stageCounts[1] },
    { name: "Stage 2", value: stageCounts[2] },
  ];

  const COLORS = ["#60a5fa", "#facc15", "#f87171"]; // Blue, Yellow, Red

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
