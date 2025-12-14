import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";

function SkeletonWithMarkers({ onPainPoint }) {
  const fbx = useFBX("/models/skeleton.fbx");
  const markerRef = useRef();
  const originRef = useRef(); // reference for the origin marker

  if (!fbx) return null;

  fbx.scale.set(0.01, 0.01, 0.01);
  fbx.position.set(0, -1, 0);

  const handleClick = (event) => {
  event.stopPropagation();
  const point = event.point.clone();

  const originYOffset = 0.35; // logical origin at green marker
  const localY = point.y - originYOffset;
  const localX = point.x;

  // Ignore clicks below -0.135 or beyond X bounds +/- 0.18
  if (localY < -0.135 || localX < -0.18 || localX > 0.18) return;

  const x = THREE.MathUtils.clamp(localX, -0.18, 0.18);
  const y = THREE.MathUtils.clamp(localY, -0.6, 0.6);

  onPainPoint({ x, y });

  if (!markerRef.current) {
  markerRef.current = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 16),
    new THREE.MeshBasicMaterial({ color: "red" })
  );
}

  // Place the marker visually at the clicked point
  markerRef.current.position.set(x, y + originYOffset, -0.11);
};


  return (
    <>
      <primitive object={fbx} onPointerDown={handleClick} />
      {markerRef.current && <primitive object={markerRef.current} />}
      <mesh position={[0, 0.35, -0.12]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </>
  );
}

export default function PainInputPosture() {
  const [painPoint, setPainPoint] = useState({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-background text-gray-800 py-5 w-full px-4 flex flex-col items-center pt-10">
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-6xl">

        {/* Left panel – instructions / info */}
        <div className="flex flex-col gap-6 w-full md:w-1/3">
          <div className="bg-white p-4 rounded-xl shadow border">
            <h2 className="text-lg font-semibold mb-2">Report Pain Location</h2>
            <p className="text-sm text-gray-600">
              Click on the back of the skeleton where you feel pain while wearing the device.
            </p>
            <div className="mt-4 text-sm">
              <div><strong>X:</strong> {painPoint.x.toFixed(3)}</div>
              <div><strong>Y:</strong> {painPoint.y.toFixed(3)}</div>
            </div>
          </div>
        </div>

        {/* Right panel – 3D skeleton */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-xl p-6 shadow-md bg-white w-full md:w-2/3">
          <div className="w-full h-[700px]"> {/* taller container for portrait */}
            <Canvas camera={{ position: [0, 1.5, -2.5], fov: 35 }}>
  <ambientLight intensity={0.3} />
  <directionalLight position={[0, 3, -3]} intensity={1.5} />

  <SkeletonWithMarkers onPainPoint={setPainPoint} />

  <OrbitControls
    enablePan={false}
    enableZoom={true}  
    enableRotate={true}
    minAzimuthAngle={Math.PI - 0.3}
    maxAzimuthAngle={Math.PI + 0.3}
    minPolarAngle={Math.PI / 4}  
    maxPolarAngle={Math.PI / 1.6}
    minDistance={2}  
    maxDistance={1}    
    zoomSpeed={0.6}    
    rotateSpeed={0.4}
  />
</Canvas>
          </div>
        </div>

      </div>
    </div>
  );
}
