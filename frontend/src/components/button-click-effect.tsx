"use client";

import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particle({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const velocity = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.15
  ), []);
  const [opacity, setOpacity] = useState(1);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.add(velocity);
      setOpacity((prev) => Math.max(0, prev - 0.025));
    }
  });

  if (opacity <= 0) return null;

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function Burst({ x, y, color }: { x: number, y: number, color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => (
      <Particle key={i} position={[x, y, 0]} color={color} />
    ));
  }, [x, y, color]);

  return <>{particles}</>;
}

export function ButtonClickEffect() {
  const [bursts, setBursts] = useState<{ id: number, x: number, y: number, color: string }[]>([]);

  React.useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement;
      let foundButton = false;
      
      while (target && target !== document.body) {
        if (target.tagName === "BUTTON" || target.getAttribute("data-slot") === "button" || target.tagName === "A") {
          foundButton = true;
          break;
        }
        target = target.parentElement as HTMLElement;
      }

      if (foundButton) {
        const x = ((e.clientX / window.innerWidth) * 2 - 1) * (window.innerWidth / window.innerHeight) * 2.5;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Use brand colors
        const color = Math.random() > 0.5 ? "#EA5D1A" : "#014D9F";
        
        const id = Date.now() + Math.random();
        setBursts((prev) => [...prev, { id, x, y, color }]);
        setTimeout(() => {
          setBursts((prev) => prev.filter(b => b.id !== id));
        }, 800);
      }
    };

    window.addEventListener("mousedown", handleGlobalClick, { passive: true });
    return () => window.removeEventListener("mousedown", handleGlobalClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }} 
        style={{ pointerEvents: 'none' }}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={1} />
        {bursts.map(burst => (
          <Burst key={burst.id} x={burst.x} y={burst.y} color={burst.color} />
        ))}
      </Canvas>
    </div>
  );
}
