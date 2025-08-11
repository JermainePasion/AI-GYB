import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ESP_IP = '192.168.100.66';
const BACKEND_IP = '192.168.100.8';
const USE_MOCK = true; //CHANGE TO TRUE IF U ARE JERROLD

function HomeScreen() {
  const [data, setData] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const navigate = useNavigate();

  const fetchSensorData = async () => {
    if (USE_MOCK) {
      const mockData = {
        angleY: Math.random() * 60 - 30,
        angleZ: Math.random() * 40 - 20,
        flexAngle: Math.random() * 40,
      };
      setData(mockData);
      return;
    }

    try {
      const response = await axios.get(`http://${ESP_IP}/read`);
      const json = response.data;
      setData(json);

      await axios.post(`http://${BACKEND_IP}:3000/log`, {
        angleY: json.angleY,
        angleZ: json.angleZ,
        flexAngle: json.flexAngle,
      });
    } catch (err) {
      console.error("Error fetching sensor data", err);
    }
  };

  const handleSetBaseline = () => {
    if (!data) {
      alert("No data yet.");
      return;
    }

    const newBaseline = {
      angleY: data.angleY,
      angleZ: data.angleZ,
      flexAngle: data.flexAngle,
    };

    setBaseline(newBaseline);
    alert("✅ Baseline set:\n" + JSON.stringify(newBaseline, null, 2));
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    
    navigate('/figures'); 
  };
 const DataCard = ({ label, value }) => (
  <div className="flex justify-between items-center bg-background px-4 py-3 rounded-lg shadow-sm text-sm">
    <span className="text-gray-300">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);


  return (
    
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-2">
  <div className=" max-w-md bg-secondary rounded-2xl p-6 shadow-xl bg-blue-900">
    <h1 className="text-2xl font-bold text-center text-primary mb-6">
      PostureSense Web App
    </h1>

    {data ? (
      <>
        <div className="space-y-4">
          <DataCard label="Angle Y" value={`${data.angleY.toFixed(2)}°`} />
          <DataCard label="Angle Z" value={`${data.angleZ.toFixed(2)}°`} />
          <DataCard label="Flex Angle" value={`${data.flexAngle.toFixed(1)}°`} />
        </div>

        <button
          onClick={handleSetBaseline}
          className="mt-6 w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold shadow hover:bg-red-600 transition duration-200"
        >
          Set Baseline
        </button>
      </>
    ) : (
      <p className="text-center text-gray-400 text-sm">Loading sensor data...</p>
    )}

    <div className="p-6">
  <button
      onClick={handleClick}
      className=" w-full py-2 rounded-lg bg-primary text-white text-sm font-semibold shadow hover:bg-green-600 transition duration-200"
    >
      Go to Figures Page
    </button>
</div>
  </div>
</div>


  );
}

export default HomeScreen;
