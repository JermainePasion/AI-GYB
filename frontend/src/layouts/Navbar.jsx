import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Navbar() {
  const { token, logout, user } = useContext(UserContext); 
  // make sure your UserContext has a `user` object with `role`

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p--1">
        <a href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/ai-gyb-logo.png"
            className="h-25 w-full "
            alt="AI-GYB Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            AI-Got Your Back
          </span>
        </a>

        {/* Mobile toggle button */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Menu links */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 
            border border-gray-100 rounded-lg bg-gray-50 
            md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 
            md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            
            <li><a href="/home" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Home</a></li>
            <li><a href="/upload" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Upload</a></li>
            <li><a href="/figures" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Figures</a></li>
            <li><a href="/control" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Control</a></li>
            <li><a href="/connection" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Connection</a></li>
            <li><a href="/score" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Score</a></li>
            <li><a href="/settings" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white">Settings</a></li>

            {/* Admin link only for admin users */}
            {user?.role === "admin" && (
              <li>
                <a
                  href="/admin"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                    md:hover:bg-transparent md:border-0 md:hover:text-purple-700 
                    md:p-0 dark:text-white md:dark:hover:text-purple-400 
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Admin
                </a>
              </li>
            )}

            {token && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block py--1 px-1 text-red-600 rounded-sm hover:bg-gray-100 
                    md:hover:bg-transparent md:hover:text-red-700"
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
