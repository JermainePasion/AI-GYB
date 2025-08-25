import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null); // which user is expanded
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>
        <div className="grid gap-4">
          {users.map((user) => (
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
                  className="text-blue-600 hover:underline"
                >
                  {expanded === user._id ? "Hide thresholds" : "Show thresholds"}
                </button>
              </div>

              {/* Threshold dropdown */}
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
    </DashboardLayout>
  );
}
