import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

function SpinningOrb({ color }) {
  const mesh = useRef(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.4;
    mesh.current.rotation.y += delta * 0.6;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1, 3]} />
      <MeshDistortMaterial color={color} distort={0.45} speed={2.2} roughness={0.2} metalness={0.4} />
    </mesh>
  );
}

// A tiny self-contained 3D "icon" -- a soft, ever-turning distorted orb --
// used as a decorative accent next to dashboard page headings instead of a
// flat emoji. Fixed pixel size so it drops into a header without affecting
// layout.
function DashboardOrb({ size = 44, color = "#2a835f", className }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    >
      <Canvas camera={{ position: [0, 0, 2.6], fov: 40 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 2, 2]} intensity={1.2} color="#8bbb92" />
        <SpinningOrb color={color} />
      </Canvas>
    </div>
  );
}

export default DashboardOrb;
