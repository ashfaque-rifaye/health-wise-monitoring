import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function HelixStrand() {
  const groupRef = useRef<THREE.Group>(null);
  const TURNS = 3;
  const POINTS_PER_TURN = 20;
  const TOTAL = TURNS * POINTS_PER_TURN;
  const RADIUS = 1.2;
  const HEIGHT = 6;

  const { strand1Positions, strand2Positions, rungs } = useMemo(() => {
    const s1: [number, number, number][] = [];
    const s2: [number, number, number][] = [];
    const r: { p1: [number, number, number]; p2: [number, number, number] }[] = [];

    for (let i = 0; i <= TOTAL; i++) {
      const t = (i / TOTAL) * Math.PI * 2 * TURNS;
      const y = (i / TOTAL) * HEIGHT - HEIGHT / 2;
      s1.push([Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS]);
      s2.push([Math.cos(t + Math.PI) * RADIUS, y, Math.sin(t + Math.PI) * RADIUS]);
      if (i % 4 === 0) {
        r.push({
          p1: [Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS],
          p2: [Math.cos(t + Math.PI) * RADIUS, y, Math.sin(t + Math.PI) * RADIUS],
        });
      }
    }
    return { strand1Positions: s1, strand2Positions: s2, rungs: r };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {strand1Positions.map((pos, i) => (
        <mesh key={`s1-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {strand2Positions.map((pos, i) => (
        <mesh key={`s2-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {rungs.map((rung, i) => {
        const dx = rung.p2[0] - rung.p1[0];
        const dy = rung.p2[1] - rung.p1[1];
        const dz = rung.p2[2] - rung.p1[2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const mid: [number, number, number] = [(rung.p1[0] + rung.p2[0]) / 2, (rung.p1[1] + rung.p2[1]) / 2, (rung.p1[2] + rung.p2[2]) / 2];
        const color = i % 4 === 0 ? '#10b981' : i % 4 === 1 ? '#f59e0b' : i % 4 === 2 ? '#ef4444' : '#a78bfa';
        return (
          <mesh key={`rung-${i}`} position={mid}>
            <cylinderGeometry args={[0.03, 0.03, len, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#06b6d4" size={0.04} transparent opacity={0.5} />
    </points>
  );
}

interface ThreeSceneProps {
  height?: string;
  interactive?: boolean;
}

export default function ThreeScene({ height = '400px', interactive = false }: ThreeSceneProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-5, -5, -5]} intensity={1.0} color="#8b5cf6" />
        <FloatingParticles />
        <HelixStrand />
        {interactive && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />}
      </Canvas>
    </div>
  );
}
