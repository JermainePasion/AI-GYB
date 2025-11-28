import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Sidebar() {
   const { token, logout, user } = useContext(UserContext);
  const [isOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const linkClasses =
    "p-3 rounded transition-colors duration-300 ease-in-out"; // shared styles

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
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Upload
          </NavLink>
          <NavLink
            to="/control"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Control
          </NavLink>
          <NavLink
            to="/connection"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Connection
          </NavLink>
          <NavLink
            to="/score"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            Score
          </NavLink>

         {(user?.role === "admin" || user?.role === "doctor") && (
  <li className="md:h-full">
    <NavLink
      to="/admin"
      className={({ isActive }) =>
        `navbar-link ${isActive ? "navbar-admin-active" : "navbar-admin-inactive"}`
      }
    >
      Admin
    </NavLink>
  </li>
)}
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
          <div className="w-56 bg-gray-800 text-white h-full p-4 z-50 relative mt-20 transition-transform duration-300 ease-in-out transform translate-x-0">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              ✖
            </button>

            <nav className="flex flex-col mt-8 space-y-2">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Upload
              </NavLink>
              <NavLink
                to="/figures"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Figures
              </NavLink>
              <NavLink
                to="/control"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Control
              </NavLink>
              <NavLink
                to="/connection"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Connection
              </NavLink>
              <NavLink
                to="/score"
                className={({ isActive }) =>
                  `${linkClasses} ${
                    isActive ? "bg-gray-700" : "hover:bg-gray-700"
                  }`
                }
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
