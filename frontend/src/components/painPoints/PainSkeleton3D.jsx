import { useContext, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import * as THREE from "three";
import { BluetoothContext } from "../../context/BluetoothContext";

function Skeleton() {
  const fbx = useFBX("/models/skeleton.fbx");
  const spineRef = useRef();
  const rootRef = useRef();
  const { addPainPoint, uploadCSVChunk } = useContext(BluetoothContext);

  useEffect(() => {
    if (!fbx) return;

    // scale + position
    fbx.scale.set(0.01, 0.01, 0.01);
    fbx.position.set(0, -1, 0);

    // make meshes clickable
    fbx.traverse((c) => {
      if (c.isMesh) {
        c.material = new THREE.MeshStandardMaterial({ color: "#071382" });
        c.raycast = THREE.Mesh.prototype.raycast; // ensure pointer events work
      }
    });

    // find spine (origin reference)
    spineRef.current = fbx.getObjectByName("mixamorigSpine1");

    if (spineRef.current) {
      const origin = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: "lime" })
      );
      origin.position.set(0, 0, 0);
      spineRef.current.add(origin);
    }
  }, [fbx]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!spineRef.current) return;

    // Convert world coordinates to local relative to spine
    const local = spineRef.current.worldToLocal(e.point.clone());
    const x = local.x;
    const y = local.y;

    // Save pain point with current BLE values
    addPainPoint({ x, y });

    // Optionally upload immediately
    await uploadCSVChunk();

    // Visual marker
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    dot.position.set(local.x, local.y, 0);
    spineRef.current.add(dot);
  };

  return <primitive ref={rootRef} object={fbx} onPointerDown={handleClick} />;
}

export default function PainSkeleton3D() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0.4, -2], fov: 35 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 1, -3]} intensity={1.2} />
        <Skeleton />
        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minAzimuthAngle={Math.PI - 0.25}
          maxAzimuthAngle={Math.PI + 0.25}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.6}
          minDistance={1.8}
          maxDistance={2.5}
        />
      </Canvas>
    </div>
  );
}
