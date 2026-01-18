import React from 'react'
import LandingNavbar from "../layouts/LandingNavbar";

function AboutUsScreen() {
  return (
   <div className="bg-[#8dbcc7] min-h-screen scroll-smooth">
      <LandingNavbar />

      <div className="max-w-6xl mx-auto px-4 py-25 ">
        <h1 className="text-4xl text-black font-bold text-center mb-1">About Us</h1>
        <p className="text-lg text-black mb-0">
          Welcome to our platform! We are dedicated to providing a seamless and efficient experience for users looking to buy and sell products online. Our mission is to connect buyers and sellers in a trustworthy environment, ensuring that every transaction is smooth and satisfactory.
        </p>
      </div>
      <div className = "max-w-6xl mx-auto px-4 py-0 text-center mb-20">
           <a href="/signup"
            className="px-8 py-4 flex justify-center text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Get Started
          </a>
      </div>

          <div className = "bg-gray-300 grid grid-cols-2 gap-4 border-1 rounded-xl max-w-6xl mx-auto px-0 py-0 mb-20">

            <div className = "w-full h-full object-fill">
              <img class="h-full w-full rounded-xl object-none " src="/img/mountains.jpg" />
            </div>

            <div className='mb-8'>
              <p className='text-lg text-black mb-1'>
              Our team is composed of passionate individuals who believe in the power of technology to transform the way we shop. We are committed to innovation and continuously improving our platform to meet the evolving needs of our users.
            </p>
            </div>

          </div>

          <div className = "bg-gray-300 grid grid-cols-2 gap-4 border-1 rounded-xl max-w-6xl mx-auto px-0 py-0 mb-20">
            <div className='mb-8'>
              <p className='text-lg text-black mb-1'>
              Our team is composed of passionate individuals who believe in the power of technology to transform the way we shop. We are committed to innovation and continuously improving our platform to meet the evolving needs of our users.
            </p>
            </div>
            <div className = "w-full h-full object-fill">
               <img class="h-full w-full rounded-xl object-none " src="/img/mountains.jpg" />
            </div>
          </div>
          



  </div>
  )
}

export default AboutUsScreen
