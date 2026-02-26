import { useContext } from "react";
import { BluetoothContext } from "../context/BluetoothContext";
import SensorGauge from "./SensorGauge";
import Skeleton3D from "./Skeleton";

export default function LivePosture() {
  const { flexAngle, gyroY, gyroZ } = useContext(BluetoothContext);

  return (
    <div className="min-h-screen bg-background text-gray-800 py-5 w-full px-4 flex flex-col items-center pt-10">

      <div className="
  flex flex-col md:flex-row gap-10 w-full
  max-w-4xl
  md:max-w-5xl
  lg:max-w-6xl
  xl:max-w-6xl
  2xl:max-w-7xl
  mx-auto
">
        {/* Gauges */}
        <div className="flex flex-col gap-6 w-full md:w-5/12 xl:w-4/12">
          <SensorGauge title="Spine" angle={flexAngle} maxAngle={45} sensor="flex" />
          <SensorGauge title="Tilt" angle={gyroY} maxAngle={70} sensor="gyroY" />
          <SensorGauge title="Side (Left/Right)" angle={gyroZ} maxAngle={40} sensor="gyroZ" />
        </div>

        {/* 3D Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full md:w-7/12 xl:w-8/12">

          <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white ">
            <Skeleton3D flexAngle={flexAngle} gyroY={gyroY} gyroZ={gyroZ} cameraPosition={[5, 1.5, 0]} />
          </div>
        </div>
      </div>
    </div>
  );
}
