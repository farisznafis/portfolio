"use client";

import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function CoreShape() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.18;
    meshRef.current.rotation.y += delta * 0.28;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.7} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[0.15, -0.1, 0]}>
        <icosahedronGeometry args={[1.25, 4]} />
        <MeshDistortMaterial
          color="#00b5a5"
          distort={0.32}
          emissive="#0b4f49"
          emissiveIntensity={0.45}
          metalness={0.55}
          roughness={0.28}
          speed={1.4}
        />
      </mesh>
    </Float>
  );
}

export function OrbitalScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.2], fov: 44 }} dpr={[1, 1.8]}>
      <ambientLight intensity={1.2} />
      <directionalLight color="#ffffff" intensity={2.2} position={[3, 3, 4]} />
      <pointLight color="#ffc700" intensity={12} position={[-3, -2, 3]} />
      <Stars count={1000} depth={32} factor={3.8} fade speed={0.35} />
      <CoreShape />
    </Canvas>
  );
}
