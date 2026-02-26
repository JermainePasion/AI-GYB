import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import { getAllUsers, approveDoctor } from "../api/users";

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, []);

  const pendingDoctors = users.filter(
    (u) => u.role === "doctor" && u.status === "pending"
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async (e, patient) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      patient_name: patient.username,
      patient_email: patient.email,
      doctor_name: user.username,
      doctor_email: user.email,
      message,
    };

    try {
      await emailjs.send(
        "service_jw409du",
        "template_1sx2vu2",
        templateParams,
        "79gkxTXjJMzDAMJLL"
      );
      setSuccess(`Message sent to ${patient.username} successfully!`);
      setMessage("");
    } catch (err) {
      console.error("EmailJS error:", err);
      setSuccess("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatThreshold = (val) =>
    val !== undefined && val !== null && val !== ""
      ? parseFloat(val).toFixed(2)
      : "-";

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= ALL USERS ================= */}
        <div className="flex flex-col lg:col-span-2">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              All Users
            </h1>

            <input
              type="text"
              placeholder="Search username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">

            {filteredUsers.map((patient) => {
              const isExpanded = expanded === patient._id;

              return (
                <div
                  key={patient._id}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-xl border border-gray-200"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-5">
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {patient.username}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {patient.email}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setExpanded(isExpanded ? null : patient._id)
                      }
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      {isExpanded ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {/* Animated Expand Section */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-in-out
                      ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
                    `}
                  >
                    <div className="px-5 pb-5 space-y-5">

                      {/* Thresholds */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Flex Min", patient.posture_thresholds?.flex_min],
                          ["Flex Max", patient.posture_thresholds?.flex_max],
                          ["GyroY Min", patient.posture_thresholds?.gyroY_min],
                          ["GyroY Max", patient.posture_thresholds?.gyroY_max],
                          ["GyroZ Min", patient.posture_thresholds?.gyroZ_min],
                          ["GyroZ Max", patient.posture_thresholds?.gyroZ_max],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-gray-50 p-3 rounded-lg border border-gray-100"
                          >
                            <p className="text-gray-500 text-xs">
                              {label}
                            </p>
                            <p className="font-medium text-gray-800">
                              {formatThreshold(val)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Message Form */}
                      <form
                        onSubmit={(e) => handleSend(e, patient)}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Send a message
                        </label>

                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows="3"
                          required
                        />

                        <button
                          type="submit"
                          disabled={loading}
                          className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition"
                        >
                          {loading ? "Sending..." : "Send"}
                        </button>
                      </form>

                      {/* View Stats */}
                      <button
                        onClick={() =>
                          navigate(`/patients/${patient._id}/graphs`)
                        }
                        className="w-full px-4 py-2 bg-[#C15353] hover:bg-[#a84343] text-white rounded-md transition"
                      >
                        View Statistics
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= PENDING DOCTORS ================= */}
        {user?.role === "admin" && (
          <div className="flex flex-col lg:col-span-1">

            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
              Pending Doctor Approvals
            </h1>

            <div className="space-y-4">
              {pendingDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white shadow-sm hover:shadow-md transition rounded-xl p-5 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {doc.username}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {doc.email}
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        await approveDoctor(doc._id);
                        setUsers((prev) =>
                          prev.map((u) =>
                            u._id === doc._id
                              ? { ...u, status: "active" }
                              : u
                          )
                        );
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}

              {pendingDoctors.length === 0 && (
                <p className="text-sm text-gray-500">
                  No pending approvals
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}