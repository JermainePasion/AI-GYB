export default function AchievementBadges({ logs = [] }) {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0, 0
  );

  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23, 59, 59, 999
  );

  const todayLogs = logs.filter((l) => {
    if (!l.timestamp) return false;
    const t = new Date(l.timestamp);
    return t >= startOfToday && t <= endOfToday;
  });

  const goodLogs = todayLogs.filter((l) => l.stage === 0);

  const goodMinutes = goodLogs.length / 60;

  let maxStreak = 0;
  let current = 0;

  todayLogs.forEach((l) => {
    if (l.stage === 0) {
      current++;
      maxStreak = Math.max(maxStreak, current);
    } else {
      current = 0;
    }
  });

  const streakMinutes = maxStreak / 60;

  const unlocked = [];
  if (todayLogs.length > 0) unlocked.push("first_session");
  if (goodMinutes >= 30) unlocked.push("daily_goal");
  if (streakMinutes >= 10) unlocked.push("consistency_pro");
  if (goodMinutes >= 45) unlocked.push("perfect_day");

  const all = [
    { id: "first_session", label: "First Session" },
    { id: "daily_goal", label: "Daily Goal" },
    { id: "consistency_pro", label: "Consistency Pro" },
    { id: "perfect_day", label: "Perfect Day" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {all.map((b) => {
        const isUnlocked = unlocked.includes(b.id);

        return (
          <div
            key={b.id}
            className={`p-4 rounded-lg text-center transition ${
              isUnlocked
                ? "bg-[#EBFFD8]"
                : "bg-gray-300 opacity-40"
            }`}
          >
            <span
              className={`material-symbols-outlined text-4xl ${
                isUnlocked ? "text-[#8DBCC7]" : "text-gray-500"
              }`}
            >
              workspace_premium
            </span>

            <p className="text-sm mt-2 text-[#012646] font-bold">{b.label}</p>
          </div>
        );
      })}
    </div>
  );
}