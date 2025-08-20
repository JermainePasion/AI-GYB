import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthNavbar from "../layouts/AuthNavbar";
import { UserContext } from "../context/UserContext";


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin
      ? "http://localhost:3000/api/users/login"
      : "http://localhost:3000/api/users/register";

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      login(data.token, data);
      alert(`Welcome, ${data.username}!`);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <AuthNavbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A4CCD9] to-[#e7f3e0] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Toggle buttons */}
          <div className="mb-6 flex justify-center space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                isLogin
                  ? "bg-[#A4CCD9] text-white shadow"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                !isLogin
                  ? "bg-[#e7f3e0] text-black shadow"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* AnimatePresence for sliding effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                {isLogin ? "Welcome Back " : "Create Your Account "}
              </h2>
              <p className="text-center text-gray-500 mb-6">
                {isLogin
                  ? "Please login to access your dashboard."
                  : "Sign up to get started with your journey."}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block mb-1 font-medium text-black" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                    />
                  </div>
                )}

                <div>
                  <label className="block mb-1 font-medium text-black" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-black" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-[#A4CCD9] text-white py-2 rounded-lg font-semibold hover:bg-[#7daebd] transition"
                >
                  {isLogin ? "Login" : "Register"}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
