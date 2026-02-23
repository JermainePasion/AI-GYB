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
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All Users */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                Search
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4">
            {filteredUsers.map((patient) => (
              <div
                key={patient._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      {patient.username}
                    </h2>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      setExpanded(expanded === patient._id ? null : patient._id)
                    }
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === patient._id
                      ? "Hide thresholds"
                      : "Show thresholds"}
                  </button>
                </div>

                {expanded === patient._id && (
                  <div className="mt-4 space-y-4">
                    {/* Thresholds */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        ["Flex Min", patient.posture_thresholds?.flex_min, "text-blue-600"],
                        ["Flex Max", patient.posture_thresholds?.flex_max, "text-blue-600"],
                        ["GyroY Min", patient.posture_thresholds?.gyroY_min, "text-green-600"],
                        ["GyroY Max", patient.posture_thresholds?.gyroY_max, "text-green-600"],
                        ["GyroZ Min", patient.posture_thresholds?.gyroZ_min, "text-purple-600"],
                        ["GyroZ Max", patient.posture_thresholds?.gyroZ_max, "text-purple-600"],
                      ].map(([label, val, color]) => (
                        <div key={label} className="bg-gray-50 p-2 rounded">
                          <p className="text-gray-500">{label}</p>
                          <p className={`font-medium ${color}`}>
                            {formatThreshold(val)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Message */}
                    <form
                      onSubmit={(e) => handleSend(e, patient)}
                      className="bg-gray-100 p-3 rounded-lg border border-gray-300"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Send a message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border rounded-md p-2 text-sm text-black"
                        rows="3"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        {loading ? "Sending..." : "Send"}
                      </button>
                    </form>

                    <button
                      onClick={() =>
                        navigate(`/patients/${patient._id}/graphs`)
                      }
                      className="w-full px-4 py-2 bg-[#C15353] text-white rounded-lg"
                    >
                      View Statistics
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Doctors */}
        {user?.role === "admin" && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Pending Doctor Approvals
            </h1>

            <div className="space-y-4">
              {pendingDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white shadow-md rounded-lg p-4 border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold text-gray-700">
                        {doc.username}
                      </h2>
                      <p className="text-sm text-gray-500">{doc.email}</p>
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
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {pendingDoctors.length === 0 && (
                <p className="text-sm text-gray-500">No pending approvals</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
