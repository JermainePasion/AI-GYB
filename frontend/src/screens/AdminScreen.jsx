import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const pendingDoctors = users.filter(
    (u) => u.role === "doctor" && u.status === "pending"
  );

  const filteredUsers = users.filter((u) =>
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())|| u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <button
                onClick={() => {}}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                Search
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      {user.username}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() =>
                      setExpanded(expanded === user._id ? null : user._id)
                    }
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {expanded === user._id
                      ? "Hide thresholds"
                      : "Show thresholds"}
                  </button>
                </div>

                {expanded === user._id && (
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Flex Min</p>
                      <p className="font-medium text-blue-600">
                        {user.posture_thresholds?.flex_min ?? "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">Flex Max</p>
                      <p className="font-medium text-blue-600">
                        {user.posture_thresholds?.flex_max ?? "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">GyroY Min</p>
                      <p className="font-medium text-green-600">
                        {user.posture_thresholds?.gyroY_min ?? "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">GyroY Max</p>
                      <p className="font-medium text-green-600">
                        {user.posture_thresholds?.gyroY_max ?? "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">GyroZ Min</p>
                      <p className="font-medium text-purple-600">
                        {user.posture_thresholds?.gyroZ_min ?? "-"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-500">GyroZ Max</p>
                      <p className="font-medium text-purple-600">
                        {user.posture_thresholds?.gyroZ_max ?? "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Doctors */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Pending Doctor Approvals
          </h1>
          <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4">
            {pendingDoctors.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-gray-700">
                      {user.username}
                    </h2>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Role: {user.role} | Status: {user.status}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await axios.put(
                        `http://localhost:3000/api/users/approve/${user._id}`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                      );
                      window.location.reload();
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
            {pendingDoctors.length === 0 && (
              <p className="text-sm text-gray-500">No pending approvals 🎉</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
