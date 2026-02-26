import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Sidebar() {
  const { user } = useContext(UserContext);
  const [isOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const linkBase =
    "p-3 rounded flex items-center relative transition-all duration-200 ease-in-out";

  const Icon = ({ name }) => (
    <span className="material-symbols-outlined mr-3 text-xl">
      {name}
    </span>
  );

  return (
    <>
      {/* Burger Button (UNCHANGED ICON) */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 text-white transition-transform duration-200 active:scale-90"
      >
        {isMobileOpen ? "✖" : "☰"}
      </button>

      {/* Desktop Sidebar */}
      <div
        className={`
          ${isOpen ? "w-56" : "w-16"}
          bg-gray-800 text-white
          h-[calc(100vh-64px)]
          fixed top-16 left-0
          transition-all duration-300 ease-in-out
          shadow-xl
          z-40
          hidden lg:block
        `}
      >
        <nav className="flex flex-col mt-4 space-y-2 px-2">
          <NavItem to="/home" icon="home" label="Home" linkBase={linkBase} />
          <NavItem to="/control" icon="settings_remote" label="Control" linkBase={linkBase} />
          <NavItem to="/upload" icon="accessibility_new" label="Upload" linkBase={linkBase} />
          <NavItem to="/connection" icon="bluetooth" label="Bluetooth" linkBase={linkBase} />
          <NavItem to="/score" icon="score" label="Score" linkBase={linkBase} />

          {(user?.role === "admin" || user?.role === "doctor") && (
            <NavItem
              to="/admin"
              icon="admin_panel_settings"
              label="Admin"
              linkBase={linkBase}
            />
          )}
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`
          fixed top-4 left-0 right-0 bottom-0 z-50 lg:hidden
          transition-opacity duration-300
          ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={`
            absolute top-16 left-0
            w-56 h-[calc(100vh-64px)]
            bg-gray-800 text-white p-4
            shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="flex flex-col mt-4 space-y-2">
            <MobileNavItem to="/home" label="Home" setIsMobileOpen={setIsMobileOpen} />
            <MobileNavItem to="/upload" label="Upload" setIsMobileOpen={setIsMobileOpen} />
            <MobileNavItem to="/control" label="Control" setIsMobileOpen={setIsMobileOpen} />
            <MobileNavItem to="/connection" label="Connection" setIsMobileOpen={setIsMobileOpen} />
            <MobileNavItem to="/score" label="Score" setIsMobileOpen={setIsMobileOpen} />
          </nav>
        </div>
      </div>
    </>
  );
}

/* =========================
   Desktop Nav Item
========================= */

function NavItem({ to, icon, label, linkBase }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        ${linkBase}
        ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}
      `
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r transition-all duration-300" />
          )}
          <Icon name={icon} />
          <span className="ml-2">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function Icon({ name }) {
  return (
    <span className="material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-110">
      {name}
    </span>
  );
}

/* =========================
   Mobile Nav Item
========================= */

function MobileNavItem({ to, label, setIsMobileOpen }) {
  return (
    <NavLink
      to={to}
      onClick={() => setIsMobileOpen(false)}
      className={({ isActive }) =>
        `
        p-3 rounded transition-all duration-200
        ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}
      `
      }
    >
      {label}
    </NavLink>
  );
}

export default Sidebar;