export default function ConsistencyScore({ logs }) {
  let breaks = 0;
  for (let i = 1; i < logs.length; i++) {
    if (logs[i - 1].stage === 0 && logs[i].stage !== 0) breaks++;
  }

  const score = Math.max(100 - breaks * 5, 0);

  return (
    <div className="p-6 rounded-xl shadow-md bg-[#A4CCD9] text-center">
      <h2 className="font-semibold">Consistency</h2>
      <p className="text-4xl font-bold text-[#EBFFD8]">{score}</p>
      <p className="text-sm mt-1">Fewer posture breaks = higher score</p>
    </div>
  );
}
