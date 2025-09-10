// FigureScreen.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SensorGauge from "../components/SensorGauge";
import Skeleton3D from "../components/skeleton";

const USE_MOCK = true;
let mockTime = 0;

function FrontViewHuman({ flexAngle, gyroY, gyroZ }) {
  return (
    <div className="w-full h-[400px]">
      <Skeleton3D
        flexAngle={flexAngle}
        gyroY={gyroY}
        gyroZ={gyroZ}
        cameraPosition={[5, 1.5, 0]} // side-facing
      />
    </div>
  );
}

function SideViewHuman({ flexAngle, gyroY, gyroZ }) {
  return (
    <div className="w-full h-[400px]">
      
    </div>
  );
}

export default function FigureScreen() {
  const [flexAngle, setFlexAngle] = useState(0);
  const [gyroY, setGyroY] = useState(0);
  const [gyroZ, setGyroZ] = useState(0);

  const fetchData = () => {
    let data;
    if (USE_MOCK) {
      mockTime += 0.05;
      const flex = 20 + 10 * Math.sin(mockTime);
      const angleY = 5 * Math.sin(mockTime * 0.5);
      const angleZ = 5 * Math.sin(mockTime * 0.3);
      data = { flexAngle: flex, angleY, angleZ };
    } else {
      // replace with ESP fetch later
      data = { flexAngle: 0, angleY: 0, angleZ: 0 };
    }

    setFlexAngle(data.flexAngle);
    setGyroY(data.angleY);
    setGyroZ(data.angleZ);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background text-gray-800 py-10 px-4 flex flex-col items-center space-y-10">
        <h1 className="text-2xl font-bold mb-6">Live Posture</h1>

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
              <FrontViewHuman flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} />
            </div>
            <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white">
              <h2 className="text-lg font-semibold mb-2">Side View</h2>
              <SideViewHuman flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
