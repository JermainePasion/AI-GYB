function LongestStreak({ logs }) {
  if (!logs || logs.length === 0) return <p>No data available</p>;

  let longestStreak = 0;
  let currentStreak = 0;

  logs.forEach((row) => {
    if (row.stage === 0) {
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  });

  const streakMinutes = ((longestStreak * 0.5) / 60).toFixed(1);

  return (
    <div className="p-6 rounded-xl shadow-md text-center flex flex-col justify-center h-full"
         style={{ backgroundColor: "#A4CCD9", color: "#222" }}>
      <h2 className="text-lg font-semibold mb-2">Longest Good Posture Streak</h2>
      <p className="text-4xl font-bold" style={{ color: "#EBFFD8" }}>
        {streakMinutes} minutes
      </p>
      <p className="mt-2 text-sm" style={{ color: "#333" }}>
        Longest continuous streak of good posture
      </p>
    </div>
  );
}

export default LongestStreak;
