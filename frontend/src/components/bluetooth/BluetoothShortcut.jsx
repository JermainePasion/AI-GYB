import { useContext, useEffect, useRef, useState } from "react";
import { BluetoothContext } from "../../context/BluetoothContext";

const HOLD_DELAY = 180;
const SIZE = 56;
const SNAP_MARGIN = 12;

export default function BluetoothShortcut() {
  const {
    connected,
    flexAngle,
    gyroY,
    gyroZ,
    connectBLE,
  } = useContext(BluetoothContext);

  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const holdTimerRef = useRef(null);
  const didDragRef = useRef(false);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 20, y: 20 });

  /* 🔒 Restrict movement to <main> */
  useEffect(() => {
    containerRef.current = document.querySelector("main");
  }, []);

  /* 🖱 Click + Hold */
  const onMouseDown = (e) => {
    if (open) return; // 🔒 prevent dragging while popup open

    e.stopPropagation();
    didDragRef.current = false;

    holdTimerRef.current = setTimeout(() => {
      draggingRef.current = true;
    }, HOLD_DELAY);
  };

  const onMouseUp = () => {
    clearTimeout(holdTimerRef.current);

    if (draggingRef.current) {
      snapToEdge();
    } else if (!didDragRef.current) {
      setOpen(true);
    }

    draggingRef.current = false;
  };

  const onMouseMove = (e) => {
    if (!draggingRef.current || !containerRef.current) return;
    didDragRef.current = true;

    const rect = containerRef.current.getBoundingClientRect();

    const x = Math.min(
      Math.max(e.clientX - rect.left - SIZE / 2, 0),
      rect.width - SIZE
    );
    const y = Math.min(
      Math.max(e.clientY - rect.top - SIZE / 2, 0),
      rect.height - SIZE
    );

    setPos({ x, y });
  };

  /* 🧲 Correct snap logic (FIXED) */
  const snapToEdge = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const centerX = pos.x + SIZE / 2;

    const snapLeft = centerX < containerWidth / 2;

    setPos((p) => ({
      ...p,
      x: snapLeft
        ? SNAP_MARGIN
        : containerWidth - SIZE - SNAP_MARGIN,
    }));
  };

  /* 🌍 Global listeners */
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  /* 🧠 Determine which side we're on */
  const isLeftSide =
    containerRef.current &&
    pos.x + SIZE / 2 < containerRef.current.clientWidth / 2;

  return (
    <div
      className="absolute z-40 pointer-events-auto"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="relative">
        {/* 🔵 CIRCLE ICON */}
        <div
          onMouseDown={onMouseDown}
          className={`
            flex items-center justify-center rounded-full cursor-pointer
            transition-all duration-300 ease-out
            ${connected ? "bg-green-500" : "bg-gray-400"}
            ${connected ? "bluetooth-pulse" : ""}
            ${open ? "scale-110" : "scale-100"}
          `}
          style={{ width: SIZE, height: SIZE }}
        >
          <span className="material-symbols-outlined text-white text-3xl">
            bluetooth
          </span>
        </div>

        {/* 🧩 POPUP (ATTACHED TO ICON CORNER) */}
        <div
          className={`
            absolute transition-all duration-300 ease-out
            ${open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75 pointer-events-none"}
          `}
          style={{
            top: SIZE + 8,
            left: isLeftSide ? 0 : "auto",
            right: isLeftSide ? "auto" : 0,
            transformOrigin: isLeftSide ? "top left" : "top right",
          }}
        >
          <div className="bg-[#A4CCD9] rounded-2xl p-5 w-[300px] shadow-xl">
            <p className="text-center text-sm text-gray-50 mb-3">
              {connected ? "Connected" : "Disconnected"}
            </p>

            <div className="space-y-2">
              <DataCard label="Flex" value={`${flexAngle.toFixed(2)}°`} />
              <DataCard label="Gyro Y" value={`${gyroY.toFixed(2)}°`} />
              <DataCard label="Gyro Z" value={`${gyroZ.toFixed(2)}°`} />
            </div>

            <button
              onClick={connectBLE}
              className="mt-4 w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
            >
              Connect
            </button>

            <button
              onClick={() => setOpen(false)}
              className="mt-2 w-full text-xs text-gray-700 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const DataCard = ({ label, value }) => (
  <div className="bg-white/10 p-2 rounded-md flex justify-between text-sm">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);