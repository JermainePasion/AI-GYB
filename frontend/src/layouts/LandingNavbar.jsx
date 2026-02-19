import React, { useState } from "react";
import "../index.css";

function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar-color fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo + Brand */}
        <a href="/" className="flex items-center space-x-3">
          {/* <img
            src="/ai-gyb-logo.png"
            className="h-10 w-auto"
            alt="AI-GYB Logo"
          /> */}
          <span className="self-center text-xl font-bold whitespace-nowrap brand-color">
            AI-Got Your Back
          </span>
        </a>

        {/* Mobile toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm toggle-color md:hidden rounded-lg focus:outline-none"
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
          <ul className="flex flex-col p-4 md:p-0 mt-4 border rounded-lg menu-color text-white-500 md:flex-row md:items-center md:space-x-6 md:mt-0 md:border-0">
            <li>
              <a href="/" className="nav-link" onClick={() => setIsOpen(false)}>
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="nav-link" onClick={() => setIsOpen(false)}>
                About us
              </a>
            </li>
            <li>
              <a href="/signup" className="nav-button" onClick={() => setIsOpen(false)}>
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
