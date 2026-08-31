"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeToggle";

function createBladeGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.1, 0);
  shape.lineTo(0.12, 0);
  shape.lineTo(0.2, 2.42);
  shape.lineTo(0.02, 2.86);
  shape.lineTo(-0.11, 2.4);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.11,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    bevelSegments: 2,
    curveSegments: 3,
  });
  geometry.center();
  geometry.translate(0, 1.42, -0.055);
  return geometry;
}

function ScissorHalf({ side, bladeColor, edgeColor, handleColor }: {
  side: -1 | 1;
  bladeColor: string;
  edgeColor: string;
  handleColor: string;
}) {
  const bladeGeometry = useMemo(() => createBladeGeometry(), []);
  return (
    <group rotation={[0, 0, side * 0.18]}>
      <mesh geometry={bladeGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={bladeColor} metalness={0.94} roughness={0.2} />
        <Edges threshold={18} color={edgeColor} />
      </mesh>
      <mesh position={[side * 0.29, -0.67, 0]} rotation={[0, 0, side * 0.08]} castShadow>
        <boxGeometry args={[0.16, 1.35, 0.16]} />
        <meshStandardMaterial color={handleColor} metalness={0.88} roughness={0.24} />
      </mesh>
      <mesh position={[side * 0.5, -1.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.48, 0.13, 14, 44]} />
        <meshStandardMaterial color={handleColor} metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[side * 0.5, -1.52, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.025, 10, 36]} />
        <meshStandardMaterial color={edgeColor} metalness={0.96} roughness={0.16} />
      </mesh>
    </group>
  );
}

function FloatingScissors() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const theme = useTheme();
  const colors = theme === "dark"
    ? { black: "#080909", graphite: "#202224", gold: "#d4af37", pivot: "#f0ce62" }
    : { black: "#34312d", graphite: "#5a554d", gold: "#b48b25", pivot: "#d8b654" };

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.y * 0.1 - 0.06, 3, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.13 - 0.12, 3, delta);
    group.current.rotation.z = -0.24 + Math.sin(time * 0.38) * 0.045;
    group.current.position.y = Math.sin(time * 0.55) * 0.13;
  });

  return (
    <group ref={group} position={[0, 0.2, 0]} scale={0.86} rotation={[-0.06, -0.12, -0.24]}>
      <ScissorHalf side={-1} bladeColor={colors.black} edgeColor={colors.gold} handleColor={colors.graphite} />
      <ScissorHalf side={1} bladeColor={colors.gold} edgeColor={colors.pivot} handleColor={colors.black} />
      <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.26, 32]} />
        <meshStandardMaterial color={colors.pivot} metalness={1} roughness={0.13} />
      </mesh>
      <mesh position={[0, 0, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.03, 24]} />
        <meshStandardMaterial color={colors.black} metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Scene() {
  const isDark = useTheme() === "dark";
  return (
    <>
      <color attach="background" args={[isDark ? "#0a0a0a" : "#f1eadf"]} />
      <fog attach="fog" args={[isDark ? "#0a0a0a" : "#f1eadf", 7, 12]} />
      <ambientLight intensity={isDark ? 0.65 : 1.15} />
      <hemisphereLight args={[isDark ? "#fff4cf" : "#fffaf0", isDark ? "#080808" : "#c9bda9", 1.6]} />
      <spotLight position={[4.5, 5.5, 6]} color="#ffe7a0" intensity={85} angle={0.34} penumbra={0.8} castShadow shadow-mapSize-width={512} shadow-mapSize-height={512} />
      <pointLight position={[-4, 1, 3]} color={isDark ? "#8ea6c9" : "#ffffff"} intensity={18} />
      <pointLight position={[3, -2, 2]} color="#d4af37" intensity={12} />
      <FloatingScissors />
      <ContactShadows position={[0, -2.35, 0]} opacity={isDark ? 0.55 : 0.28} scale={7} blur={2.8} far={4.5} resolution={256} color={isDark ? "#000000" : "#6f6250"} />
    </>
  );
}

export function BarberToolScene() {
  return (
    <Canvas camera={{ position: [0, 0.15, 7.2], fov: 36 }} dpr={[1, 1.5]} shadows gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} aria-hidden="true">
      <Scene />
    </Canvas>
  );
}
