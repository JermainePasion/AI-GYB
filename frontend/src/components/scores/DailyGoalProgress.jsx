export default function DailyGoalProgress({ logs = [], goalMinutes = 60 }) {
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const todaysLogs = logs.filter((l) => {
    if (!l.timestamp) return false;
    return isToday(new Date(l.timestamp));
  });

  const goodToday = todaysLogs.filter((l) => l.stage === 0).length;


  const minutes = (goodToday * 0.5) / 60;
  const percent = Math.min((minutes / goalMinutes) * 100, 100);

  return (
    <div className="p-6 rounded-xl shadow-md bg-[#EBFFD8] text-black">
      <h2 className="font-semibold mb-2">Daily Goal</h2>

      <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: "#8DBCC7",
          }}
        />
      </div>

      <p className="mt-2 text-sm">
        {minutes.toFixed(1)} / {goalMinutes} minutes
      </p>

      {percent >= 100 && (
        <p className="mt-1 text-xs font-semibold text-green-700">
          🎉 Daily goal completed!
        </p>
      )}
    </div>
  );
}
