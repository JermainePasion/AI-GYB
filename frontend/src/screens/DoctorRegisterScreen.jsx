import { useState } from "react";
import { motion } from "framer-motion";
import AuthNavbar from "../layouts/AuthNavbar";
import { registerDoctor } from "../api/users";

export default function DoctorRegisterScreen() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await registerDoctor(formData);

      // Show popup
      alert(res.data.message);

      // Redirect after OK
      window.location.href = "/";
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error registering doctor"
      );
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

          {message && (
            <p className="text-center text-sm text-red-600 mb-4">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-black">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-[#A4CCD9]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-[#A4CCD9]"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-2 focus:ring-[#A4CCD9]"
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
