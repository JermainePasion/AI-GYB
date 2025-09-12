import React, { useContext, useState } from "react";
import {NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import "../index.css";

function Navbar() {
  const { token, logout, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar-main fixed w-full top-0 z-50 shadow-md">
        <div className="w-full flex flex-wrap items-center justify-between p-0">
        {/* Logo + Brand */}
        <a href="/home" className="flex items-center space-x-3">
          {/* <img src="/ai-gyb-logo.png" className="h-10 w-auto" alt="AI-GYB Logo" /> */}
          <span className="self-center text-sm font-bold whitespace-nowrap navbar-brand ml-2">
            AI-Got Your Back
          </span>
        </a>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="navbar-toggle inline-flex items-center mt-5 mb-5 mr-2 p-2 w-10 h-10 justify-center text-sm rounded-lg custom-hidden"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {/* Menu links */}
        <div className={`${isOpen ? "block" : "hidden"} w-full custom-block custom-w-auto`} id="navbar-default">
          <ul className="navbar-menu font-bold flex flex-col items-stretch p-0 mt-0 rounded-lg md:flex-row md:justify-between md:w-full md:mt-0 md:h-full">
            <li className="md:h-full">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : "navbar-link-inactive"}`
                }
              >
                Settings
              </NavLink>
            </li>

            {/* Admin only */}
            {user?.role === "admin" && (
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

            {/* Logout (unchanged) */}
            {token && (
            <li className="md:h-full">
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="navbar-link navbar-logout"
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
