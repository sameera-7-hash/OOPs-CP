import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";

// Slowly tumbling, softly distorted blob in the brand palette, sitting
// behind the Home/Login hero copy. Decorative only -- pointer-events are
// disabled on the wrapping <Canvas> so it never intercepts clicks.
function Blob({ position = [0, 0, 0], scale = 1, color = "#2a835f", speed = 1 }) {
  const mesh = useRef(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12 * speed;
    mesh.current.rotation.y += delta * 0.18 * speed;
  });

  return (
    <Float speed={1.4 * speed} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={1.6}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}

function HeroScene({ className }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ pointerEvents: "none" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color="#8bbb92" />
        <pointLight position={[-4, -2, 2]} intensity={0.8} color="#2a835f" />

        <Blob position={[1.4, 0.4, 0]} scale={1.5} color="#2a835f" speed={1} />
        <Blob position={[-1.6, -0.6, -1]} scale={0.85} color="#8bbb92" speed={1.4} />
        <Blob position={[0.4, -1.3, -0.5]} scale={0.55} color="#12544f" speed={0.8} />

        <Sparkles count={40} scale={6} size={2} speed={0.3} color="#8bbb92" opacity={0.5} />
      </Canvas>
    </div>
  );
}

export default HeroScene;
