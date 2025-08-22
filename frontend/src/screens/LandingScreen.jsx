import LandingNavbar from "../layouts/LandingNavbar";

export default function LandingScreen() {
  return (
    <div className="bg-[#FFFFFF] min-h-screen scroll-smooth">
      <LandingNavbar />

      {/* Hero / Brief Intro */}
      <section
        id="home"
        style={{
          backgroundImage: "url('/posture-bg.webp')", // ✅ no need for /public prefix
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex items-center justify-center h-screen px-6 pt-20"
      >
        <div className="max-w-3xl text-center p-10 ">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to AI-GYB
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            PostureSense is an AI-powered wearable device designed to help you
            maintain good posture, reduce back pain, and improve overall wellness.
            Stay confident, stay healthy!
          </p>

          {/* Get Started Button */}
          <a
            href="/signup"
            className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300"
          >
            Get Started
          </a>
        </div>

      </section>

        {/* Product Section */}
        <section
          id="product"
          className="flex items-center justify-center h-screen px-6"
        >
          <div className="max-w-5xl w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 grid md:grid-cols-2 gap-10 items-center">
            
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src="/posture-vest.jpg" // ✅ replace with your product image
                alt="PostureSense Wearable"
                className="w-80 h-auto rounded-xl shadow-md"
              />
            </div>

            {/* Product Details */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">PostureSense</h2>
              <p className="text-lg text-gray-600 mb-6">
                Improve your posture, reduce back pain, and stay confident with
                <span className="font-semibold text-blue-600"> PostureSense</span>, 
                an AI-powered wearable that monitors and corrects your sitting position in real time.
              </p>

              {/* Price */}
              <p className="text-2xl font-bold text-green-600 mb-6">$99.99</p>

              {/* Buy Now Button */}
              <a
                href="https://yourshoplink.com" // ✅ replace with your shop link
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300"
              >
                Buy Now
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
      <section
        className="flex items-center justify-center h-screen px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/benifit-image.jpg')" }} // ✅ Replace with your image path
      >
        <div className="max-w-4xl w-full p-10 text-center bg-white/40">
          <h2 className="text-3xl font-bold text-black drop-shadow-lg mb-6">
            Benefits of Good Posture
          </h2>

          <ul className="list-disc list-inside text-lg text-black leading-relaxed text-left mx-auto max-w-xl space-y-2 drop-shadow">
            <li>Reducing strain on muscles and joints</li>
            <li>Improving circulation and respiratory function</li>
            <li>Decreasing the risk of injuries</li>
            <li>Increasing energy and focus</li>
            <li>Improving self-confidence and body image</li>
            <li>Reducing stress and anxiety</li>
            <li>Enhancing appearance (taller, slimmer, more confident)</li>
            <li>Essential for overall health and well-being</li>
          </ul>
        </div>
      </section>





            {/* Blog / Studies Section */}
      <section
        id="blog"
        className="flex items-center justify-center min-h-screen px-6 py-16 bg-gray-50"
      >
        <div className="max-w-6xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Learn More About Posture
          </h2>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Blog Post 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="/blog-1-image.webp" // ✅ replace with your image
                alt="3 Surprising Risks of Poor Posture"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3 Surprising Risks of Poor Posture
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Poor posture doesn’t just affect your back—it can impact your
                  breathing, digestion, and even mental health. Discover the hidden risks.
                </p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>


            {/* Blog Post 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="/blog-2-image.webp" // ✅ replace with your image
                alt="How Posture Affects Productivity"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  How Posture Affects Productivity
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Did you know poor posture can lower energy and focus at work?
                  Learn how posture directly affects productivity and performance.
                </p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img
                src="/blog-3-image.webp" // ✅ replace with your image
                alt="Tips for Better Posture"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Tips for Better Posture
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Small daily habits can make a big difference. Explore simple
                  adjustments to improve posture and overall health.
                </p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read More →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>



       {/* Footer / Contact Us */}
      <footer
        id="contact"
        className="bg-gray-900 text-gray-200 px-6 py-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-gray-400 mb-6">
            Have questions or want to collaborate? Reach out to us!
          </p>

          <div className="space-y-2">
            <p>
              Email:{" "}
              <a
                href="mailto:support@posturesense.com"
                className="text-blue-400 hover:underline"
              >
                support@posturesense.com
              </a>
            </p>
            <p>Location: Manila, Philippines</p>
            <p>Phone: +63 912 345 6789</p>
          </div>

          {/* Divider line */}
          <div className="border-t border-gray-700 mt-8 pt-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PostureSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
