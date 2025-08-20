import React from 'react'

function LandingNavbar() {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            AI-GYB
          </span>
        </a>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg 
            bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white 
            dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            
            <li>
              <a href="/" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white md:p-0">
                Home
              </a>
            </li>
            <li>
              <a href="#about" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white md:p-0">
                About us
              </a>
            </li>
            <li>
              <a href="#contact" className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white md:p-0">
                Contact us
              </a>
            </li>
            <li>
            <a
              href="/signup"
              className="block px-2 py-.9 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Sign in
            </a>
          </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default LandingNavbar
