import { useContext } from "react";
import { BluetoothContext } from "../context/BluetoothContext";
import SensorGauge from "./SensorGauge";
import Skeleton3D from "./skeleton";

export default function LivePosture() {
  const { flexAngle, gyroY, gyroZ } = useContext(BluetoothContext);

  return (
    <div className="min-h-screen bg-background text-gray-800 py-5 w-full px-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Live Posture</h1>

      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">
        {/* Gauges */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <SensorGauge title="Flex Sensor" angle={flexAngle} maxAngle={45} sensor="flex" />
          <SensorGauge title="Gyro Y" angle={gyroY} maxAngle={70} sensor="gyroY" />
          <SensorGauge title="Gyro Z" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
        </div>

        {/* 3D Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:w-2/3">

          <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white ">
            <Skeleton3D flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} cameraPosition={[5, 1.5, 0]} />
          </div>
        </div>
      </div>
    </div>
  );
}
