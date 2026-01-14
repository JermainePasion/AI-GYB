import { useState } from "react";
import { motion } from "framer-motion";
import AuthNavbar from "../layouts/AuthNavbar";

 const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function DoctorRegisterScreen() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/users/register-doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error registering doctor");

      // Show popup
      alert(data.message);

      // Redirect to login page after pressing OK
      window.location.href = "/";
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <AuthNavbar />

      <div className="min-h-screen flex items-center justify-center bg-[#8dbcc7] px-4">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Doctor Registration
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Create a doctor account to get started.
          </p>

          {message && <p className="text-center text-sm text-red-600 mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-black" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#A4CCD9] text-white py-2 rounded-lg font-semibold hover:bg-[#7daebd] transition"
            >
              Register
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
