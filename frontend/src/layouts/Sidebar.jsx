import { useState } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const [isOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 text-white"
      >
        {isMobileOpen ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${isOpen ? "w-56" : "w-16"} 
          bg-gray-800 text-white 
          h-[calc(100vh-64px)] 
          fixed top-16 left-0 
          transition-all duration-300 
          z-40 
          hidden md:block
        `}
      >
        <nav className="flex flex-col mt-4 space-y-2">
          <NavLink to="/Home" className="p-3 hover:bg-gray-700 rounded">
            Home
          </NavLink>
          <NavLink to="/upload" className="p-3 hover:bg-gray-700 rounded">
            Upload
          </NavLink>
         <NavLink to="/control" className="p-3 hover:bg-gray-700 rounded">
            Control
          </NavLink>
         <NavLink to="/connection" className="p-3 hover:bg-gray-700 rounded">
            Connection
          </NavLink>
         <NavLink to="/figures" className="p-3 hover:bg-gray-700 rounded">
            Score
          </NavLink>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsMobileOpen(false)}
          ></div>

          {/* Sidebar Panel */}
          <div className="w-56 bg-gray-800 text-white h-full p-4 z-50 relative mt-20">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              ✖
            </button>

            <nav className="flex flex-col mt-8 space-y-2">
              <NavLink
                to="/home"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/upload"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Upload
              </NavLink>
              <NavLink
                to="/figures"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Figures
              </NavLink>
             <NavLink
                to="/control"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Control
              </NavLink>
             <NavLink
                to="/connection"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Connection
              </NavLink>
             <NavLink
                to="/score"
                className="p-3 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileOpen(false)}
              >
                Score
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
