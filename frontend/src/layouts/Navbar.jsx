import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { token, logout, user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-900 shadow-md flex flex-col">
      {/* Logo + Brand */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
        <img src="/ai-gyb-logo.png" className="h-10 w-auto" alt="AI-GYB Logo" />
        <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white">
          AI-Got Your Back
        </span>
      </div>

      {/* Menu links */}
      <ul className="flex flex-col flex-grow p-4 space-y-2">
        <li>
          <a href="/home" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Home
          </a>
        </li>
        <li>
          <a href="/upload" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Upload
          </a>
        </li>
        <li>
          <a href="/figures" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Figures
          </a>
        </li>
        <li>
          <a href="/control" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Control
          </a>
        </li>
        <li>
          <a href="/connection" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Connection
          </a>
        </li>
        <li>
          <a href="/score" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Score
          </a>
        </li>
        <li>
          <a href="/settings" className="block py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
            Settings
          </a>
        </li>

        {/* Admin only */}
        {user?.role === "admin" && (
          <li>
            <a
              href="/admin"
              className="block py-2 px-3 text-purple-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-purple-400"
            >
              Admin
            </a>
          </li>
        )}
      </ul>

      {/* Logout at the bottom */}
      {token && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-3 text-red-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
