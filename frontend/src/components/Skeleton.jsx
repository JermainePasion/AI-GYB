// Skeleton.jsx
import { useFBX, OrbitControls } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { SkeletonHelper } from "three"

function SkeletonModel({ flexAngle = 0, gyroY = 0, gyroZ = 0 }) {
  const fbx = useFBX("/models/skeleton.fbx")
  const spineRef = useRef(null)
  const debugSphereRef = useRef(null)

  useEffect(() => {
    if (!fbx) return

    fbx.scale.set(0.01, 0.01, 0.01)
    fbx.position.set(0, -1, 0)

    fbx.traverse((c) => {
      if (c.isMesh) {
        c.material = new THREE.MeshStandardMaterial({
          color: "#071382",
          skinning: true,
          metalness: 0,
          roughness: 0.8,
        });
      }
    });

    const helper = new SkeletonHelper(fbx)
    fbx.remove(helper)



    spineRef.current = fbx.getObjectByName("mixamorigSpine1")
    if (spineRef.current) {

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: "red" })
      )
      spineRef.current.add(sphere)
      debugSphereRef.current = sphere
    } else {
      console.warn("⚠️ Spine1 not found")
    }
  }, [fbx])

  useFrame(() => {
    if (spineRef.current) {
      const flexRad = THREE.MathUtils.degToRad(flexAngle)
      const gyroYRad = THREE.MathUtils.degToRad(gyroY)
      const gyroZRad = THREE.MathUtils.degToRad(gyroZ)

      // Smooth transition
      spineRef.current.rotation.x = THREE.MathUtils.lerp(
        spineRef.current.rotation.x,
        flexRad + gyroYRad,
        0.1
      )
      spineRef.current.rotation.z = THREE.MathUtils.lerp(
        spineRef.current.rotation.z,
        gyroZRad,
        0.1
      )

      if (debugSphereRef.current) {
        debugSphereRef.current.scale.setScalar(
          1 + 0.3 * Math.sin(Date.now() * 0.005)
        )
      }
    }
  })

      if (!fbx) return;

  const leftArm = fbx.getObjectByName("mixamorigLeftArm");
  const rightArm = fbx.getObjectByName("mixamorigRightArm");
  if (leftArm) leftArm.rotation.x = -Math.PI / -2.5; // down along body
  if (rightArm) rightArm.rotation.x = -Math.PI / -2.5; // down along body

  return <primitive object={fbx} />
}


export default function Skeleton3D({ flexAngle, gyroY, gyroZ }) {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0.5, 2], fov: 50 }}>
        <ambientLight intensity={0.2} />

        <directionalLight
          intensity={0.8}
          position={[0, 1.5, 3]} 
        >

          <primitive object={new THREE.Object3D()} position={[0, 1, 0]} />
        </directionalLight>

        <SkeletonModel
          flexAngle={flexAngle}
          gyroY={gyroY}
          gyroZ={gyroZ}
        />
        <directionalLight intensity={4.5} position={[2, 1.5, 3]} />
        <directionalLight intensity={4.5} position={[-2, 1.5, 3]} />
          
        <OrbitControls
          enablePan={false}       
          enableZoom={false}      
          enableRotate={true}     
          rotateSpeed={0.5}      
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={0}         
        />
      </Canvas>
    </div>
  )
}
