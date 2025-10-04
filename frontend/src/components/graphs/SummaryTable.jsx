const SummaryTable = ({ logs }) => {
  if (!logs || logs.length === 0) 
    return <p className="text-black text-center">No data yet</p>;

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
      <table className="min-w-full rounded-xl overflow-hidden shadow-md">
        <thead className="bg-[#A4CCD9] text-white">
          <tr>
            <th className="px-4 py-3">Flex Avg</th>
            <th className="px-4 py-3">GyroY Avg</th>
            <th className="px-4 py-3">GyroZ Avg</th>
            <th className="px-4 py-3">Good Posture (0)</th>
            <th className="px-4 py-3">Stage 1</th>
            <th className="px-4 py-3">Stage 2</th>
          </tr>
        </thead>
        <tbody className="text-center text-black">
          <tr className="bg-[#EBFFD8] hover:bg-[#C4E1E6] transition-colors">
            <td className="px-4 py-3">{summary.flexAvg}</td>
            <td className="px-4 py-3">{summary.gyroYAvg}</td>
            <td className="px-4 py-3">{summary.gyroZAvg}</td>
            <td className="px-4 py-3 font-semibold text-green-600">{summary.stage0}</td>
            <td className="px-4 py-3 font-semibold text-yellow-600">{summary.stage1}</td>
            <td className="px-4 py-3 font-semibold text-red-600">{summary.stage2}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
