import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthNavbar from "../layouts/AuthNavbar";
import { UserContext } from "../context/UserContext";
import { loginUser, registerUser } from "../api/auth";

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

    try {
      const res = isLogin
        ? await loginUser(formData.email, formData.password)
        : await registerUser(
            formData.username,
            formData.email,
            formData.password
          );

      const data = res.data;
      login(data.token, data);
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Something went wrong"
      );
    }
  };

  return (
    <div>
      <AuthNavbar />

      <div className="min-h-screen flex items-center justify-center bg-[#8dbcc7] px-4">
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
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                !isLogin
                  ? "bg-[#e7f3e0] text-black shadow"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
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
                      className="w-full border rounded px-3 py-2 text-black"
                    />
                  </div>
                )}

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
                    className="w-full border rounded px-3 py-2 text-black"
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
                    className="w-full border rounded px-3 py-2 text-black"
                  />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-[#A4CCD9] text-white py-2 rounded-lg font-semibold"
                >
                  {isLogin ? "Sign in" : "Sign up"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/doctorsignup")}
                  className="text-blue-600 hover:underline"
                >
                  Register as Doctor
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
