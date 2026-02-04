export default function AchievementBadges({ badges }) {
  const all = [
    { id: "first_session", label: "First Session" },
    { id: "daily_goal", label: "Daily Goal" },
    { id: "consistency_pro", label: "Consistency Pro" },
    { id: "perfect_day", label: "Perfect Day" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {all.map(b => (
        <div
          key={b.id}
          className={`p-4 rounded-lg text-center ${
            badges.includes(b.id)
              ? "bg-[#EBFFD8]"
              : "bg-gray-300 opacity-40"
          }`}
        >
          🏅
          <p className="text-sm mt-1">{b.label}</p>
        </div>
      ))}
    </div>
  );
}
