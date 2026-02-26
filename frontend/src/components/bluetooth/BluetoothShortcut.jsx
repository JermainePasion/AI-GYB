import { useContext, useEffect, useRef, useState } from "react";
import { BluetoothContext } from "../../context/BluetoothContext";

const SIZE = 60;
const SNAP_MARGIN = 16;
const NAVBAR_HEIGHT = 104;
const SIDEBAR_WIDTH = 224;

export default function BluetoothShortcut() {
  const { connected, flexAngle, gyroY, gyroZ, connectBLE } =
    useContext(BluetoothContext);

  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const startOffsetRef = useRef({ x: 0, y: 0 });

  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({
    x: window.innerWidth >= 1024
      ? SIDEBAR_WIDTH + SNAP_MARGIN
      : SNAP_MARGIN,
    y: NAVBAR_HEIGHT + SNAP_MARGIN,
  });


  const onPointerDown = (e) => {
    e.stopPropagation();

    draggingRef.current = true;
    didDragRef.current = false;
    setIsDragging(true);

    startOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };

    document.body.style.userSelect = "none";
  };


  const onPointerMove = (e) => {
    if (!draggingRef.current) return;

    didDragRef.current = true;

    const x = e.clientX - startOffsetRef.current.x;
    const y = e.clientY - startOffsetRef.current.y;

    const minX = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
    const maxX = window.innerWidth - SIZE;
    const minY = NAVBAR_HEIGHT;
    const maxY = window.innerHeight - SIZE;

    setPos({
      x: Math.min(Math.max(minX, x), maxX),
      y: Math.min(Math.max(minY, y), maxY),
    });
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;

    if (didDragRef.current) {
      snapToEdge();
    } else {
      setOpen((prev) => !prev);
    }

    draggingRef.current = false;
    setIsDragging(false);
    document.body.style.userSelect = "auto";
  };

  const snapToEdge = () => {
    const minX = window.innerWidth >= 1024 ? SIDEBAR_WIDTH : 0;
    const maxX = window.innerWidth - SIZE - SNAP_MARGIN;

    const centerX = pos.x + SIZE / 2;
    const mid = (minX + window.innerWidth) / 2;

    const snapLeft = centerX < mid;

    setPos((prev) => ({
      ...prev,
      x: snapLeft
        ? minX + SNAP_MARGIN
        : maxX,
    }));
  };

  useEffect(() => {
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [pos]);

  const isLeftSide = pos.x + SIZE / 2 < window.innerWidth / 2;
  const isNearBottom = pos.y + SIZE + 220 > window.innerHeight;

  return (
    <div
      className={`fixed z-50 pointer-events-auto ${
        isDragging ? "" : "transition-all duration-300 ease-out"
      }`}
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="relative select-none">

        {/* Circle */}
        <div
          onPointerDown={onPointerDown}
          style={{ width: SIZE, height: SIZE, touchAction: "none" }}
          className={`
            flex items-center justify-center rounded-full cursor-pointer
            shadow-xl transition-transform duration-200
            ${connected ? "bg-green-500 bluetooth-pulse" : "bg-gray-400"}
            ${open ? "scale-110" : "scale-100"}
          `}
        >
          <span className="material-symbols-outlined text-white text-3xl select-none">
            bluetooth
          </span>
        </div>

        {/* Popup */}
        <div
          className={`
            absolute transition-all duration-300 ease-out
            ${open
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"}
          `}
          style={{
            top: isNearBottom ? "auto" : SIZE + 8,
            bottom: isNearBottom ? SIZE + 8 : "auto",
            left: isLeftSide ? 0 : "auto",
            right: isLeftSide ? "auto" : 0,
            transformOrigin: `
              ${isNearBottom ? "bottom" : "top"}
              ${isLeftSide ? " left" : " right"}
            `,
          }}
        >
          <div className="relative">

            <div
              className="absolute w-5 h-5 bg-[#8ec2d3] rotate-45"
              style={{
                top: isNearBottom ? "auto" : -10,
                bottom: isNearBottom ? -10 : "auto",
                left: isLeftSide ? 22 : "auto",
                right: isLeftSide ? "auto" : 22,
              }}
            />

            <div className="bg-[#A4CCD9]  rounded-2xl p-5 w-[300px] shadow-2xl border border-white/20 backdrop-blur-md">

              <p className="text-center text-sm text-white mb-4 font-semibold">
                {connected ? "Connected" : "Disconnected"}
              </p>

              <div className="space-y-2">
                <DataCard label="Flex" value={`${flexAngle.toFixed(2)}°`} />
                <DataCard label="Gyro Y" value={`${gyroY.toFixed(2)}°`} />
                <DataCard label="Gyro Z" value={`${gyroZ.toFixed(2)}°`} />
              </div>

              <button
                onClick={connectBLE}
                className="mt-4 w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
              >
                Connect
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const DataCard = ({ label, value }) => (
  <div className="bg-white/20 p-2 rounded-md flex justify-between text-sm text-white">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);