import { useState, useRef, useEffect } from "react";

export default function GraphHeader({ title, description }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center mb-2"
    >
      <h2 className="text-center font-semibold text-black">
        {title}
      </h2>

      <span
        onClick={() => setOpen(!open)}
        className="material-symbols-outlined text-gray-500 text-lg ml-2 cursor-pointer hover:text-black transition"
      >
        info
      </span>

      <div
        className={`absolute top-full mt-2 w-64 text-xs bg-black text-white px-3 py-2 rounded-md shadow-lg transition z-20
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        {description}
      </div>
    </div>
  );
}