import LandingNavbar from "../layouts/LandingNavbar";

export default function LandingScreen() {
  return (
    <div className="bg-[#8dbcc7] min-h-screen scroll-smooth">
      <LandingNavbar />

      {/* Hero / Brief Intro */}
      <section
        id="home"
        className="flex items-center justify-center min-h-[70vh] px-6 pt-20"
      >
        <div className="max-w-3xl text-center bg-white/90 p-10 rounded-2xl shadow-lg">
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


      {/* About Us */}
      <section id="about" className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We are a passionate team of engineers and innovators dedicated to
            creating smart solutions for everyday health problems. With
            expertise in AI, IoT, and wearable technology, we built PostureSense
            to empower people with better posture and healthier lives.
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact" className="bg-gray-100 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-4">
            Have questions or want to collaborate? Reach out to us!
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              📧 Email:{" "}
              <a
                href="mailto:support@posturesense.com"
                className="text-blue-600 hover:underline"
              >
                support@posturesense.com
              </a>
            </p>
            <p className="text-gray-700">📍 Location: Manila, Philippines</p>
            <p className="text-gray-700">📞 Phone: +63 912 345 6789</p>
          </div>
        </div>
      </section>
    </div>
  );
}
