import LandingNavbar from "../layouts/LandingNavbar";
import { motion } from "framer-motion";

export default function LandingScreen() {
  return (
    <div className="bg-gray-300 min-h-screen font-sans scroll-smooth overflow-x-hidden">
      <LandingNavbar />

      {/* HERO SECTION */}
      <motion.section
        id="home"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="relative flex items-center justify-center min-h-screen px-6 pt-24 text-center"
        style={{
          backgroundImage: "url('/posture-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6">
            Welcome to <span className="text-blue-400">AI-GYB</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            AI-GYB is an AI-powered wearable device designed to help you
            maintain good posture, reduce back pain, and improve overall wellness.
          </p>

          <a
            href="/signup"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Started
          </a>
        </div>
      </motion.section>

      {/* PRODUCT SECTION */}
      <motion.section
        id="product"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 grid md:grid-cols-2 gap-10 items-center">
          
          {/* Image */}
          <div className="flex justify-center">
            <img
              src="/posture-vest.jpg"
              alt="AI-GYB Wearable"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-2xl shadow-md"
            />
          </div>

          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              AI-GYB
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Improve your posture, reduce back pain, and stay confident with
              <span className="font-semibold text-blue-600"> AI-GYB</span>,
              an AI-powered wearable that monitors and corrects your sitting position in real time.
            </p>
          </div>
        </div>
      </motion.section>

      {/* BENEFITS SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="flex items-center justify-center px-6 py-20 bg-gray-100"
      >
        <div className="max-w-4xl w-full p-6 sm:p-10 md:p-12 text-center bg-white rounded-3xl shadow-xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Benefits of Good Posture
          </h2>

          <ul className="list-disc list-inside text-base sm:text-lg text-gray-700 text-left mx-auto max-w-xl space-y-3">
            <li>Reducing strain on muscles and joints</li>
            <li>Improving circulation and respiratory function</li>
            <li>Decreasing the risk of injuries</li>
            <li>Increasing energy and focus</li>
            <li>Improving self-confidence and body image</li>
            <li>Reducing stress and anxiety</li>
            <li>Enhancing appearance</li>
            <li>Essential for overall health and well-being</li>
          </ul>
        </div>
      </motion.section>

      {/* BLOG SECTION */}
      <motion.section
        id="blog"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="flex items-center justify-center px-6 py-20"
      >
        <div className="max-w-6xl w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center mb-14">
            Learn More About Posture
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                img: "/blog-1-image.webp",
                title: "3 Surprising Risks of Poor Posture",
                desc: "Poor posture affects breathing, digestion, and mental health.",
              },
              {
                img: "/blog-2-image.webp",
                title: "How Posture Affects Productivity",
                desc: "Posture directly impacts focus and performance.",
              },
              {
                img: "/blog-3-image.webp",
                title: "Tips for Better Posture",
                desc: "Small daily habits create long-term improvements.",
              },
            ].map((post, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.desc}</p>
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-200 px-6 py-12 text-center">
        <div className="max-w-6xl mx-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Us</h2>
          <p className="text-gray-400">Have questions or want to collaborate?</p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@posturesense.com"
              className="text-blue-400 hover:underline"
            >
              support@posturesense.com
            </a>
          </p>
          <p>Manila, Philippines | +63 912 345 6789</p>
          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AI-GYB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}