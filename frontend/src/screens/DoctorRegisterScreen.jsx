import { useState } from "react";
import AuthNavbar from "../layouts/AuthNavbar";

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
      const res = await fetch("http://localhost:3000/api/users/register-doctor", {
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
        <AuthNavbar/>
        <div className="min-h-screen flex items-center justify-center bg-[#8dbcc7] px-4">
        <div className="max-w-md w-full bg-[#90bcc7] p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Doctor Registration</h2>
            {message && <p className="text-center text-sm text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
            />
            <button
                type="submit"
                className="w-full bg-[#A4CCD9] text-white py-2 rounded-lg font-semibold hover:bg-[#7daebd]"
            >
                Register
            </button>
            </form>
        </div>
        </div>
    </div>
  );
}
