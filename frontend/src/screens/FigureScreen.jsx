// FigureScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SensorGauge from '../components/SensorGauge';
import "../index.css"

const USE_MOCK = true; //CHANGE TO TRUE IF U ARE JERROLD
const ESP_IP = '192.168.100.66';

export default function FigureScreen() {
  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      let data;
      if (USE_MOCK) {
        data = {
          flexAngle: Math.random() * 45,
          angleY: (Math.random() - 0.5) * 70,
          angleZ: (Math.random() - 0.5) * 40,
        };
      } else {
        const res = await axios.get(`http://${ESP_IP}/read`);
        data = res.data;
      }

      setFlexAngle(data.flexAngle || 0);
      setGyroY(data.angleY || 0);
      setGyroZ(data.angleZ || 0);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-gray-800 py-10 px-4 flex flex-col items-center space-y-10">

         <button
        onClick={() => navigate('/')}
        className="self-start mb-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        <h3>Back</h3>
      </button>

      <SensorGauge title="Flex Sensor" angle={flexAngle} maxAngle={45} sensor="flex" />
      <SensorGauge title="Gyro Y (Front/Back)" angle={gyroY} maxAngle={70} sensor="gyroY" />
      <SensorGauge title="Gyro Z (Side Tilt)" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
    </div>
  );
}
