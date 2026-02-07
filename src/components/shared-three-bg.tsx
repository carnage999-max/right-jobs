"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function AnimatedBackground({ variant = "primary" }: { variant?: "primary" | "subtle" }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  // Branding Colors from Logo
  const LOGO_BLUE = "#014D9F";
  const LOGO_ORANGE = "#EA5D1A"; 

  const config = useMemo(() => {
    return {
      primary: {
        color: LOGO_ORANGE,
        opacity: 0.95,
        distort: 0.45,
        emissive: "#a03a00", 
        metalness: 0.8,
        roughness: 0.2
      },
      subtle: {
        color: LOGO_ORANGE,
        opacity: 0.85,
        distort: 0.4,
        emissive: LOGO_ORANGE,
        metalness: 0.6,
        roughness: 0.3
      }
    }[variant];
  }, [variant, LOGO_ORANGE]);

  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      
      <ambientLight intensity={variant === "subtle" ? 3.5 : 2} color="#fff1e6" /> 
      
      <pointLight position={[10, 10, 10]} intensity={5} color={LOGO_ORANGE} />
      <pointLight position={[-10, 5, 10]} intensity={4} color={LOGO_ORANGE} />
      
      <pointLight position={[0, -5, -10]} intensity={6} color={LOGO_BLUE} />
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[1.4, 128, 128]}>
          <MeshDistortMaterial
            color={config.color}
            speed={2}
            distort={config.distort}
            radius={1}
            roughness={config.roughness}
            metalness={config.metalness}
            emissive={config.emissive}
            transparent
            opacity={config.opacity}
          />
        </Sphere>
      </Float>

      <mesh scale={15}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={LOGO_ORANGE} side={THREE.BackSide} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export function SharedThreeBg({ variant = "primary", className }: { variant?: "primary" | "subtle", className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}>
      <Canvas dpr={[1, 2]}>
        <AnimatedBackground variant={variant} />
      </Canvas>
    </div>
  );
}
