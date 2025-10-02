const SummaryTable = ({ logs }) => {
  if (!logs || logs.length === 0) 
    return <p className="text-white">No data yet</p>;

  // Calculate averages
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;

  const flexArr = logs.map((l) => l.flex);
  const gyroYArr = logs.map((l) => l.gyroY);
  const gyroZArr = logs.map((l) => l.gyroZ);

  // Count occurrences of each stage
  const stageCounts = logs.reduce(
    (acc, l) => {
      if (l.stage === 0) acc[0]++;
      else if (l.stage === 1) acc[1]++;
      else if (l.stage === 2) acc[2]++;
      return acc;
    },
    [0, 0, 0] // [stage0, stage1, stage2]
  );

  const summary = {
    flexAvg: avg(flexArr).toFixed(2),
    gyroYAvg: avg(gyroYArr).toFixed(2),
    gyroZAvg: avg(gyroZArr).toFixed(2),
    stage0: stageCounts[0],
    stage1: stageCounts[1],
    stage2: stageCounts[2],
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-[#1f2937] text-white rounded-lg overflow-hidden">
        <thead className="bg-[#374151]">
          <tr>
            <th className="px-4 py-2">Flex Avg</th>
            <th className="px-4 py-2">GyroY Avg</th>
            <th className="px-4 py-2">GyroZ Avg</th>
            <th className="px-4 py-2">Good Posture (0)</th>
            <th className="px-4 py-2">Stage 1</th>
            <th className="px-4 py-2">Stage 2</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-700 hover:bg-gray-800">
            <td className="px-4 py-2 text-center">{summary.flexAvg}</td>
            <td className="px-4 py-2 text-center">{summary.gyroYAvg}</td>
            <td className="px-4 py-2 text-center">{summary.gyroZAvg}</td>
            <td className="px-4 py-2 text-center">{summary.stage0}</td>
            <td className="px-4 py-2 text-center">{summary.stage1}</td>
            <td className="px-4 py-2 text-center">{summary.stage2}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
