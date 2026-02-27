import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Skeleton3D from "../Skeleton";

const labelMap = {
  flex: "Spine Flex",
  gyroY: "Upper Back Tilt",
  gyroZ: "Side Tilt",
};

/* ================= CUSTOM TOOLTIP ================= */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0]?.payload ?? {};

  return (
    <div className="bg-white px-4 py-3 rounded-xl shadow-xl border border-gray-200 w-[380px] overflow-hidden">

      {/* Timestamp */}
      <p className="text-xs font-semibold text-gray-700 mb-2">
        {new Date(label).toLocaleString()}
      </p>

      {/* Values */}
      <div className="text-xs space-y-1 mb-3">
        {payload.map((entry, index) => {
          const key = entry.dataKey;
          const formattedLabel = labelMap[key] || key;
          const value = entry.value;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3"
            >
              <span
                className="whitespace-nowrap"
                style={{ color: entry.color }}
              >
                {formattedLabel}
              </span>

              <span className="font-medium text-gray-800">
                {typeof value === "number"
                  ? `${value.toFixed(2)}°`
                  : "-"}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3D Model */}
      <div className="h-[200px] w-full">
        <Skeleton3D
          flexAngle={Number(data.flex) || 0}
          gyroY={Number(data.gyroY) || 0}
          gyroZ={Number(data.gyroZ) || 0}
        />
      </div>

    </div>
  );
};

/* ================= MAIN GRAPH ================= */
const TimeSeriesGraphWithModel = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-center text-black">
        No data yet
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={logs}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={(ts) =>
            new Date(ts).toLocaleTimeString()
          }
        />

        <YAxis unit="°" />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ strokeWidth: 1 }}
        />

        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="top"
        />

        <Line
          type="monotone"
          dataKey="flex"
          name="Spine Flex"
          stroke="#60a5fa"
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="gyroY"
          name="Upper Back Tilt"
          stroke="#34d399"
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="gyroZ"
          name="Side Tilt"
          stroke="#f87171"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesGraphWithModel;