function OverallScore({ logs }) {
  if (!logs || logs.length === 0) return <p>No data available</p>;

  const goodCount = logs.filter((l) => l.stage === 0).length;
  const totalCount = logs.length;
  const score = ((goodCount / totalCount) * 100).toFixed(1);

  return (
    <div className="p-6 rounded-xl shadow-md text-center flex flex-col justify-center"
         style={{ backgroundColor: "#A4CCD9", color: "#222" }}>
      <h2 className="text-lg font-semibold mb-2">Overall Posture Score</h2>
      <p className="text-5xl font-bold" style={{ color: "#EBFFD8" }}>{score}%</p>
      <p className="mt-2 text-sm" style={{ color: "#333" }}>
        {goodCount} / {totalCount} entries were good posture
      </p>
    </div>
  );
}

export default OverallScore;
