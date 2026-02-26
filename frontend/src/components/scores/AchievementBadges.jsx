import { useState, useEffect, useRef } from "react";

export default function AchievementBadges({ logs = [] }) {
  const [active, setActive] = useState(null);
  const containerRef = useRef(null);

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
    {
      id: "first_session",
      label: "First Session",
      desc: "Logged posture data today."
    },
    {
      id: "daily_goal",
      label: "Daily Goal",
      desc: "Maintained good posture for 30+ minutes."
    },
    {
      id: "consistency_pro",
      label: "Steady Pro",
      desc: "10-minute continuous good posture streak."
    },
    {
      id: "perfect_day",
      label: "Perfect Day",
      desc: "45+ minutes of good posture today."
    },
  ];

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setActive(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {all.map((b) => {
        const isUnlocked = unlocked.includes(b.id);
        const isActive = active === b.id;

        return (
          <div
            key={b.id}
            onClick={() =>
              setActive(isActive ? null : b.id)
            }
            className={`relative group p-3 sm:p-4 rounded-lg text-center transition cursor-pointer min-h-[110px] flex flex-col items-center justify-center ${
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

            <p className="
              text-xs sm:text-sm
              mt-2
              text-[#012646]
              font-bold
              leading-tight
              break-words
            ">
              {b.label}
            </p>

            {/* Tooltip */}
            <div
              className={`
                absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                w-44 text-xs bg-black text-white px-3 py-2 rounded-md
                shadow-lg z-20
                transition
                ${
                  isActive
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none group-hover:opacity-100"
                }
              `}
            >
              {b.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}