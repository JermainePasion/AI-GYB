import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ username: "", email: "", password: ""});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const endpoint = isLogin ? "http://localhost:3000/api/users/login" : "http://localhost:3000/api/users/register";

    // Prepare payload (for register, username and role needed)
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

      // On success, save token & redirect or do something
      localStorage.setItem("token", data.token);
      alert(`Welcome, ${data.username}!`);
      navigate("/home");
      // For example, redirect to dashboard:
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-semibold rounded ${
              isLogin ? "bg-[#e7f3e0] text-black" : "bg-gray-200 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-semibold rounded ${
              !isLogin ? "bg-[#e7f3e0] text-black" : "bg-gray-200 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
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
                  className="w-full border border-gray-300 rounded text-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A4CCD9]"
                />
              </div>
              
            </>
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
              className="w-full border border-gray-300  rounded px-3 py-2 focus:outline-none text-black focus:ring-2 focus:ring-[#A4CCD9]"
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
            className="w-full bg-[#A4CCD9] text-white py-2 rounded font-semibold hover:bg-red-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
