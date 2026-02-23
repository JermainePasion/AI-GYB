import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import ThresholdSlider from "../components/ThresholdSlider";
import DashboardLayout from "../layouts/DashboardLayout";
import { getThresholds, updateThresholds } from "../api/users";
import Spinner from "../components/Spinner/Spinner";

const ControlPage = () => {
  const { token, user } = useContext(UserContext);
  const [thresholds, setThresholds] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const fetchThresholds = async () => {
      try {
        const res = await getThresholds();
        if (isMounted) {
          setThresholds(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch thresholds:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchThresholds();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleChange = (e) => {
    setThresholds({
      ...thresholds,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const handleSave = async () => {
    try {
      const res = await updateThresholds(thresholds);
      setThresholds(res.data);
      alert("Thresholds updated successfully!");
    } catch (err) {
      console.error("Error updating thresholds:", err);
      alert("Failed to update thresholds");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-white flex flex-col items-center p-6">
        <h1 className="text-4xl font-bold mb-6">Control Panel</h1>

        {loading && (
          <Spinner/>
        )}

        {!loading && !thresholds && (
          <p className="text-center text-red-400">No thresholds found.</p>
        )}

        {!loading && thresholds && (
          <>
            {user?.last_threshold_adjustment?.updatedAt && (
              <div className="w-full max-w-3xl bg-secondary/70 backdrop-blur rounded-2xl p-5 mb-8 border border-white/10 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">
                    Latest Automatic Adjustment
                  </h2>
                  <span className="text-xs text-white">
                    {new Date(
                      user.last_threshold_adjustment.updatedAt
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  {["flex", "gyroY", "gyroZ"].map((key) => {
                    const value = user.last_threshold_adjustment[key];
                    if (!value || value === 0) return null;

                    const label =
                      key === "flex"
                        ? "Flex"
                        : key === "gyroY"
                        ? "Upper Back"
                        : "Side Tilt";

                    const isPositive = value > 0;

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between bg-black/20 rounded-lg px-4 py-2"
                      >
                        <span className="text-white">{label}</span>
                        <span
                          className={`font-medium ${
                            isPositive ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {isPositive ? "↑ +" : "↓ "}
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ControlPage;