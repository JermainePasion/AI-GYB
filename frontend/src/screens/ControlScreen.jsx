import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ThresholdSlider from "../components/ThresholdSlider";
import DashboardLayout from '../layouts/DashboardLayout';

const ControlPage = () => {
  const { token, user } = useContext(UserContext);
  const [thresholds, setThresholds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchThresholds = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users/thresholds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThresholds(res.data);
      } catch (err) {
        console.error("Failed to fetch thresholds:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThresholds();
  }, [token]);

  const handleChange = (e) => {
    setThresholds({ ...thresholds, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:3000/api/users/thresholds", thresholds, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setThresholds(res.data);
      alert("✅ Thresholds updated successfully!");
    } catch (err) {
      console.error("Error updating thresholds:", err);
      alert("❌ Failed to update thresholds");
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  if (!thresholds) return <p className="text-center text-red-400">No thresholds found.</p>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-6">Control Panel</h1>

        <div className="w-full max-w-3xl bg-secondary rounded-2xl p-6 shadow-xl">
          <ThresholdSlider
            label="Flex Min"
            name="flex_min"
            value={thresholds.flex_min}
            onChange={handleChange}
          />
          <ThresholdSlider
            label="Flex Max"
            name="flex_max"
            value={thresholds.flex_max}
            onChange={handleChange}
          />
          <ThresholdSlider
            label="Gyro Y Min"
            name="gyroY_min"
            value={thresholds.gyroY_min}
            onChange={handleChange}
          />
          <ThresholdSlider
            label="Gyro Y Max"
            name="gyroY_max"
            value={thresholds.gyroY_max}
            onChange={handleChange}
          />
          <ThresholdSlider
            label="Gyro Z Min"
            name="gyroZ_min"
            value={thresholds.gyroZ_min}
            onChange={handleChange}
          />
          <ThresholdSlider
            label="Gyro Z Max"
            name="gyroZ_max"
            value={thresholds.gyroZ_max}
            onChange={handleChange}
          />

          <button
            onClick={handleSave}
            className="mt-6 px-6 py-2 bg-[#EBFFD8] rounded-lg hover:bg-[#C4E1E6] transition text-black"
          >
            Save Thresholds
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ControlPage;
