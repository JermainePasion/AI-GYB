// FigureScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SensorGauge from '../components/SensorGauge';
import "../index.css"
import DashboardLayout from '../layouts/DashboardLayout';

const USE_MOCK = true; // change to false for live ESP data
const ESP_IP = '192.168.100.66';

// ===== FRONT VIEW HUMAN =====
function FrontViewHuman({ flexAngle, gyroZ }) {
  const spineBend = flexAngle * 0.4;
  const tilt = gyroZ * 0.5;

  return (
    <svg viewBox="0 0 200 400" className="w-60 h-96">
      {/* Head */}
      <circle cx="100" cy="50" r="25" fill="#fbbf24" stroke="black" />
      {/* Body */}
      <rect x="75" y="80" width="50" height="120" rx="25" fill="#60a5fa" stroke="black" />
      {/* Arms */}
      <line x1="75" y1="100" x2="40" y2="170" stroke="black" strokeWidth="6" />
      <line x1="125" y1="100" x2="160" y2="170" stroke="black" strokeWidth="6" />
      {/* Legs */}
      <line x1="85" y1="200" x2="70" y2="300" stroke="black" strokeWidth="6" />
      <line x1="115" y1="200" x2="130" y2="300" stroke="black" strokeWidth="6" />
      {/* Spine */}
      <path
        d={`M100,80 Q${100 + tilt},${150 + spineBend} 100,200`}
        stroke="red"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}

// ===== SIDE VIEW HUMAN =====
function SideViewHuman({ flexAngle, gyroY }) {
  const forwardBend = gyroY * 0.5;
  const spineCurve = flexAngle * 0.8;

  return (
    <svg viewBox="0 0 200 400" className="w-60 h-96">
      {/* Head */}
      <circle cx="100" cy="50" r="25" fill="#fbbf24" stroke="black" />
      {/* Torso */}
      <rect x="90" y="80" width="20" height="120" rx="10" fill="#60a5fa" stroke="black" />
      {/* Arm */}
      <line x1="100" y1="100" x2="150" y2="170" stroke="black" strokeWidth="6" />
      {/* Leg */}
      <line x1="100" y1="200" x2="110" y2="300" stroke="black" strokeWidth="6" />
      {/* Spine */}
      <path
        d={`M100,80 Q${100 + forwardBend},${150 + spineCurve} 100,200`}
        stroke="red"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
}

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
      console.error("Error fetching data:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-gray-800 py-10 px-4 flex flex-col items-center space-y-10">
        <h1 className="text-2xl font-bold mb-6">Live Posture Tracking</h1>

        <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
          {/* Left: Gauges */}
          <div className="flex flex-col gap-6 w-full md:w-1/3">
            <SensorGauge title="Flex Sensor" angle={flexAngle} maxAngle={45} sensor="flex" />
            <SensorGauge title="Gyro Y (Front/Back)" angle={gyroY} maxAngle={70} sensor="gyroY" />
            <SensorGauge title="Gyro Z (Side Tilt)" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
          </div>

          {/* Right: Two Human Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:w-2/3">
            <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-2">Front View</h2>
              <FrontViewHuman flexAngle={flexAngle} gyroZ={gyroZ} />
            </div>
            <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-2">Side View</h2>
              <SideViewHuman flexAngle={flexAngle} gyroY={gyroY} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );


}
