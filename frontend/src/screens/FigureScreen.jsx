// FigureScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SensorGauge from '../components/SensorGauge';
import "../index.css"
import DashboardLayout from '../layouts/DashboardLayout';

// === NEW Components for Figures ===
const FrontViewHuman = ({ flexAngle, gyroZ }) => (
  <svg width="200" height="400" viewBox="0 0 200 400">
    {/* Spine */}
    <line
      x1="100"
      y1="50"
      x2={100 + gyroZ}
      y2={350 - flexAngle}
      stroke="blue"
      strokeWidth="6"
      strokeLinecap="round"
    />
    {/* Head */}
    <circle cx="100" cy="30" r="20" fill="#e0e0e0" stroke="black" />
    {/* Arms */}
    <line x1="50" y1="120" x2="150" y2="120" stroke="black" strokeWidth="6" />
    {/* Legs */}
    <line x1="100" y1="350" x2="60" y2="400" stroke="black" strokeWidth="6" />
    <line x1="100" y1="350" x2="140" y2="400" stroke="black" strokeWidth="6" />
  </svg>
);

const SideViewHuman = ({ flexAngle, gyroY }) => (
  <svg width="200" height="400" viewBox="0 0 200 400">
    {/* Spine curve */}
    <path
      d={`M100 50 Q${100 + flexAngle} ${200 + gyroY}, 100 350`}
      stroke="blue"
      strokeWidth="6"
      fill="transparent"
    />
    {/* Head */}
    <circle cx="100" cy="30" r="20" fill="#e0e0e0" stroke="black" />
    {/* Arms (side profile → one line forward) */}
    <line x1="100" y1="120" x2={100 + 40} y2={140} stroke="black" strokeWidth="6" />
    {/* Legs */}
    <line x1="100" y1="350" x2="100" y2="400" stroke="black" strokeWidth="6" />
  </svg>
);

const USE_MOCK = true;
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
    <DashboardLayout>
      <div className="min-h-screen bg-background text-gray-800 py-10 px-4 flex flex-col items-center space-y-10">
        
        <h2 className="text-2xl font-bold">Posture Figures (Live)</h2>

        {/* Two Figures in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold">Front View</h3>
            <FrontViewHuman flexAngle={flexAngle} gyroZ={gyroZ} />
          </div>

          <div className="flex flex-col items-center">
            <h3 className="font-semibold">Side View</h3>
            <SideViewHuman flexAngle={flexAngle} gyroY={gyroY} />
          </div>
        </div>

        {/* Gauges below */}
        <SensorGauge title="Flex Sensor" angle={flexAngle} maxAngle={45} sensor="flex" />
        <SensorGauge title="Gyro Y (Front/Back)" angle={gyroY} maxAngle={70} sensor="gyroY" />
        <SensorGauge title="Gyro Z (Side Tilt)" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
      </div>
    </DashboardLayout>
  );
}
