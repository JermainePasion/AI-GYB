import { Canvas } from "@react-three/fiber";
import { OrbitControls, useFBX } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Skeleton({ onChange }) {
  const fbx = useFBX("/models/skeleton.fbx");
  const spineRef = useRef();
  const rootRef = useRef();

  useEffect(() => {
    if (!fbx) return;

    // scale + position
    fbx.scale.set(0.01, 0.01, 0.01);
    fbx.position.set(0, -1, 0);

    // material
    fbx.traverse((c) => {
      if (c.isMesh) {
        c.material = new THREE.MeshStandardMaterial({ color: "#071382" });
      }
    });

    // find spine (origin reference)
    spineRef.current = fbx.getObjectByName("mixamorigSpine1");

    if (spineRef.current) {
      // 🟢 ORIGIN MARKER (0,0)
      const origin = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: "lime" })
      );
      origin.position.set(0, 0, 0);
      spineRef.current.add(origin);
    }
  }, [fbx]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!spineRef.current || !rootRef.current) return;

    // world → local
    const worldPoint = e.point.clone();
    const local = rootRef.current.worldToLocal(worldPoint);

    const x = THREE.MathUtils.clamp(local.x, -0.4, 0.4);
    const y = THREE.MathUtils.clamp(local.y, -0.6, 0.6);

    onChange({ x, y });

    // 🔴 pain marker
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    dot.position.set(x, y, 0);
    spineRef.current.add(dot);
  };

  return (
    <primitive
      ref={rootRef}
      object={fbx}
      onPointerDown={handleClick}
    />
  );
}

export default function PainSkeleton3D({ onChange }) {
  return (
    <div className="w-full h-[400px]">
      <Canvas
        camera={{
          position: [0, 0.4, -2], // behind
          fov: 35,
        }}
      >
        {/* Lights from BACK */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, 1, -3]} intensity={1.2} />

        <Skeleton onChange={onChange} />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}

          // 🔒 back only
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
