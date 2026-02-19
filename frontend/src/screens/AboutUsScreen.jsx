import React from 'react'
import LandingNavbar from "../layouts/LandingNavbar";

function AboutUsScreen() {
  return (
   <div className="bg-[#8dbcc7] min-h-screen scroll-smooth">
      <LandingNavbar />

      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
  
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 mt-10">
          About Us
        </h1>

        <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          We’re dedicated to creating a seamless and efficient platform for buying
          and selling products online. Our mission is to connect buyers and sellers
          in a trusted environment where every transaction feels smooth, secure,
          and reliable.
        </p>

        <div className="mt-10">
          <a
            href="/signup"
            className="inline-block px-8 py-3 text-base md:text-lg font-semibold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </a>
        </div>

      </div>

          <div className="max-w-6xl mx-auto px-6 space-y-16 mb-24">

            {/* Section 1 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2">
              
              <div className="h-72 md:h-full">
                <img
                  src="/team.jpg"
                  alt="Our Team"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center p-10">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Who We Are
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    We are passionate innovators who believe in the power of technology
                    to transform everyday experiences. Our mission is to continuously
                    improve our platform and deliver meaningful value to our users.
                  </p>
                </div>
              </div>

            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2">
              
              <div className="flex items-center p-10 order-2 md:order-1">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Our Vision
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    We aim to create a seamless and intelligent platform that adapts
                    to evolving user needs, ensuring innovation remains at the core
                    of everything we build.
                  </p>
                </div>
              </div>

              <div className="h-72 md:h-full order-1 md:order-2">
                <img
                  src="/team.jpg"
                  alt="Vision"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>
          



  </div>
  )
}

export default AboutUsScreen
