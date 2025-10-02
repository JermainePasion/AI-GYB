const SummaryTable = ({ logs }) => {
  if (!logs || logs.length === 0) return <p className="text-white">No data yet</p>;

  const flexAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
  const gyroYAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;
  const gyroZAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;

  const dailyMap = {};

  logs.forEach((l) => {
    const day = l.timestamp.split(" ")[0]; // timestamp is string from CSV
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(l);
  });

  const summary = Object.entries(dailyMap).map(([day, entries]) => {
    const flexArr = entries.map((e) => e.flex);
    const yArr = entries.map((e) => e.gyroY);
    const zArr = entries.map((e) => e.gyroZ);
    const badDuration = entries.filter((e) => e.stage > 0).length;

    return {
      day,
      flexAvg: flexAvg(flexArr).toFixed(2),
      flexMax: Math.max(...flexArr).toFixed(2),
      gyroYAvg: gyroYAvg(yArr).toFixed(2),
      gyroYMax: Math.max(...yArr).toFixed(2),
      gyroZAvg: gyroZAvg(zArr).toFixed(2),
      gyroZMax: Math.max(...zArr).toFixed(2),
      badDuration,
    };
  });

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-[#1f2937] text-white rounded-lg overflow-hidden">
        <thead className="bg-[#374151]">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2">Flex Avg</th>
            <th className="px-4 py-2">Flex Max</th>
            <th className="px-4 py-2">GyroY Avg</th>
            <th className="px-4 py-2">GyroY Max</th>
            <th className="px-4 py-2">GyroZ Avg</th>
            <th className="px-4 py-2">GyroZ Max</th>
            <th className="px-4 py-2">Bad Posture Count</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.day} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="px-4 py-2">{row.day}</td>
              <td className="px-4 py-2 text-center">{row.flexAvg}</td>
              <td className="px-4 py-2 text-center">{row.flexMax}</td>
              <td className="px-4 py-2 text-center">{row.gyroYAvg}</td>
              <td className="px-4 py-2 text-center">{row.gyroYMax}</td>
              <td className="px-4 py-2 text-center">{row.gyroZAvg}</td>
              <td className="px-4 py-2 text-center">{row.gyroZMax}</td>
              <td className="px-4 py-2 text-center">{row.badDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;
