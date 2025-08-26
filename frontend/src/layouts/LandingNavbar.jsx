import React, { useState } from "react";

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo + Brand */}
        <a href="/" className="flex items-center space-x-3">
          <img
            src="/ai-gyb-logo.png"
            className="h-10 w-auto"
            alt="AI-GYB Logo"
          />
          <span className="self-center text-xl font-bold whitespace-nowrap dark:text-white">
            AI-Got Your Back
          </span>
        </a>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
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
              d={isOpen ? "M4 4l9 9M4 13L13 4" : "M1 1h15M1 7h15M1 13h15"}
            />
          </svg>
        </button>

        {/* Menu links */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul
            className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg 
            bg-gray-50 md:flex-row md:items-center md:space-x-6 md:mt-0 
            md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <a
                href="/"
                className="block py-2 px-4 text-gray-900 hover:text-blue-700 dark:text-white md:p-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="block py-2 px-4 text-gray-900 hover:text-blue-700 dark:text-white md:p-2"
                onClick={() => setIsOpen(false)}
              >
                About us
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="block py-2 px-4 text-gray-900 hover:text-blue-700 dark:text-white md:p-2"
                onClick={() => setIsOpen(false)}
              >
                Contact us
              </a>
            </li>
            <li>
              <a
                href="/signup"
                className="block py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 md:ml-2"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;
