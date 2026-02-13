import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { adjustThresholdOnLogout } from "../api/auth";

import "../index.css";

function Navbar() {
  const { token, logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;

    try {
      await adjustThresholdOnLogout();
    } catch (err) {
      console.error("Threshold adjustment failed:", err);
    }

    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-main fixed w-full top-0 z-50 shadow-md">
      <div className="w-full flex flex-wrap items-center justify-between p-0">
        {/* Logo */}
        <a href="/home" className="flex items-center space-x-3">
          <span className="navbar-brand ml-2 text-sm font-bold">
            AI-Got Your Back
          </span>
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-toggle inline-flex items-center mt-5 mb-5 mr-2 p-2 w-10 h-10 rounded-lg custom-hidden"
          aria-expanded={isOpen}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {/* Menu */}
        <div className={`${isOpen ? "block" : "hidden"} w-full custom-block custom-w-auto`}>
          <ul className="navbar-menu font-bold flex flex-col md:flex-row md:justify-between md:w-full md:h-full">

            {/* Settings */}
            <li className="md:h-full">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `navbar-link ${
                    isActive ? "navbar-link-active" : "navbar-link-inactive"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                Settings
              </NavLink>
            </li>

            {/* Admin */}
            {(user?.role === "admin" || user?.role === "doctor") && (
              <li className="md:h-full">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `navbar-link navbar-admin ${
                      isActive ? "navbar-link-active" : "navbar-link-inactive"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}

            {/* Logout */}
            {token && (
              <li className="md:h-full">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="navbar-link navbar-logout w-full text-left"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
