import LandingNavbar from "../layouts/LandingNavbar";

export default function LandingScreen() {
  return (
    <div className="bg-white min-h-screen scroll-smooth font-sans">
      <LandingNavbar />

      {/* Hero / Brief Intro */}
      <section
        id="home"
        style={{
          backgroundImage: "url('/posture-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex items-center justify-center h-screen px-6 pt-20"
      >
        <div className="absolute inset-0 bg-black/30" /> {/* overlay for readability */}

        <div className="relative max-w-3xl text-center p-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Welcome to AI-GYB
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed">
            PostureSense is an AI-powered wearable device designed to help you
            maintain good posture, reduce back pain, and improve overall wellness.
          </p>

          {/* CTA */}
          <a
            href="/signup"
            className="inline-block px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-green-500 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* Product Section */}
      <section
        id="product"
        className="flex items-center justify-center h-screen px-6 bg-white"
      >
        <div className="max-w-6xl w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-12 grid md:grid-cols-2 gap-12 items-center">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src="/posture-vest.jpg"
              alt="PostureSense Wearable"
              className="w-80 h-auto rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">PostureSense</h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Improve your posture, reduce back pain, and stay confident with
              <span className="font-semibold text-blue-600"> PostureSense</span>, 
              an AI-powered wearable that monitors and corrects your sitting position in real time.
            </p>

            {/* Price */}
            <p className="text-3xl font-bold text-green-600 mb-8">$99.99</p>

            {/* Buy Now Button */}
            <a
              href="https://yourshoplink.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 text-white text-lg font-medium bg-gradient-to-r from-blue-600 to-green-500 rounded-xl shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Buy Now
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className="flex items-center justify-center h-screen px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/benifit-image.jpg')" }}
      >
        <div className="max-w-4xl w-full p-12 text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-lg">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Benefits of Good Posture
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed text-left mx-auto max-w-xl space-y-3">
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

      {/* Blog Section */}
      <section
        id="blog"
        className="flex items-center justify-center min-h-screen px-6 py-20 bg-gray-50"
      >
        <div className="max-w-6xl w-full">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-14">
            Learn More About Posture
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Blog Posts */}
            {[
              {
                img: "/blog-1-image.webp",
                title: "3 Surprising Risks of Poor Posture",
                desc: "Poor posture doesn’t just affect your back—it can impact your breathing, digestion, and even mental health.",
              },
              {
                img: "/blog-2-image.webp",
                title: "How Posture Affects Productivity",
                desc: "Did you know poor posture can lower energy and focus at work? Learn how posture directly affects productivity and performance.",
              },
              {
                img: "/blog-3-image.webp",
                title: "Tips for Better Posture",
                desc: "Small daily habits can make a big difference. Explore simple adjustments to improve posture and overall health.",
              },
            ].map((post, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-52 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
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
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-200 px-6 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Contact Us</h2>
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
          <p>Location: Manila, Philippines | Phone: +63 912 345 6789</p>
          <div className="border-t border-gray-700 pt-4 mt-6">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} PostureSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
