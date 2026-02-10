export default function ConsistencyScore({ logs = [] }) {
  if (!logs.length) return <p>No data available</p>;

  const byDay = {};

  logs.forEach((l) => {
    if (!l.timestamp || l.stage !== 0) return;
    const day = new Date(l.timestamp).toDateString();
    byDay[day] = (byDay[day] || 0) + 1;
  });

  const days = Object.keys(byDay);
  if (days.length === 0) return <p>No consistency data</p>;

  const validDays = days.filter((d) => {
    const minutes = (byDay[d] * 1) / 60; 
    return minutes >= 10;
  });

  const score = Math.round((validDays.length / 7) * 100);

  return (
    <div className="p-6 rounded-xl shadow-md text-center"
         style={{ backgroundColor: "#A4CCD9", color: "#222" }}>
      <h2 className="text-lg font-semibold mb-2">Consistency Score</h2>
      <p className="text-4xl font-bold" style={{ color: "#EBFFD8" }}>
        {score}%
      </p>
      <p className="mt-2 text-sm">
        Days with ≥10 min good posture (last 7 days)
      </p>
    </div>
  );
}