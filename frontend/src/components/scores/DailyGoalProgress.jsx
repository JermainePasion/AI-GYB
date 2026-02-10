export default function DailyGoalProgress({ logs = [], goalMinutes = 60 }) {
  const isToday = (date) => {
    const t = new Date();
    return (
      date.getFullYear() === t.getFullYear() &&
      date.getMonth() === t.getMonth() &&
      date.getDate() === t.getDate()
    );
  };

  const todaysGood = logs
    .filter(l => l.stage === 0 && l.timestamp)
    .filter(l => isToday(new Date(l.timestamp)));

  if (todaysGood.length < 2) {
    return (
      <div className="p-6 rounded-xl shadow-md bg-[#EBFFD8] text-black">
        <h2 className="font-semibold mb-2">Daily Goal</h2>
        <p className="text-sm">0 / {goalMinutes} minutes</p>
      </div>
    );
  }

  const start = new Date(todaysGood[0].timestamp);
  const end = new Date(todaysGood[todaysGood.length - 1].timestamp);
  const minutes = (end - start) / 1000 / 60;

  const percent = Math.min((minutes / goalMinutes) * 100, 100);

  return (
    <div className="p-6 rounded-xl shadow-md bg-[#8DBCC7] text-black">
      <h2 className="font-semibold mb-2">Daily Goal</h2>

      <div className="h-3 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: "#EBFFD8" }}
        />
      </div>

      <p className="mt-2 text-sm">
        {minutes.toFixed(1)} / {goalMinutes} minutes
      </p>

      {percent >= 100 && (
        <p className="mt-1 text-xs font-semibold text-green-700">
          Daily goal completed!
        </p>
      )}
    </div>
  );
}