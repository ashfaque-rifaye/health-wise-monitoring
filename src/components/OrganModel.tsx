import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type OrganStatus = 'normal' | 'warning' | 'critical';

interface OrganStatusMap {
  heart?: OrganStatus;
  liver?: OrganStatus;
  kidneys?: OrganStatus;
  lungs?: OrganStatus;
  brain?: OrganStatus;
}

function statusColor(s: OrganStatus = 'normal'): string {
  return s === 'critical' ? '#ef4444' : s === 'warning' ? '#f59e0b' : '#10b981';
}

function statusEmissive(s: OrganStatus = 'normal'): string {
  return s === 'critical' ? '#7f1d1d' : s === 'warning' ? '#78350f' : '#052e16';
}

function PulsingOrgan({ position, scale, color, emissive, speed = 1 }: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * speed * 2) * 0.04;
      meshRef.current.scale.set(scale[0] * pulse, scale[1] * pulse, scale[2] * pulse);
    }
  });
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.5} transparent opacity={0.9} />
    </mesh>
  );
}

function BodyModel({ statuses }: { statuses: OrganStatusMap }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 2.8, 0.6]} />
        <meshStandardMaterial color="#334155" transparent opacity={0.3} wireframe />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.35} wireframe />
      </mesh>
      {/* Brain */}
      <PulsingOrgan
        position={[0, 2.05, 0]}
        scale={[0.38, 0.32, 0.38]}
        color={statusColor(statuses.brain)}
        emissive={statusEmissive(statuses.brain)}
        speed={0.7}
      />
      {/* Heart */}
      <PulsingOrgan
        position={[-0.2, 0.5, 0.1]}
        scale={[0.25, 0.25, 0.22]}
        color={statusColor(statuses.heart)}
        emissive={statusEmissive(statuses.heart)}
        speed={1.2}
      />
      {/* Lungs */}
      <PulsingOrgan
        position={[-0.45, 0.4, 0]}
        scale={[0.22, 0.32, 0.18]}
        color={statusColor(statuses.lungs)}
        emissive={statusEmissive(statuses.lungs)}
        speed={0.4}
      />
      <PulsingOrgan
        position={[0.45, 0.4, 0]}
        scale={[0.22, 0.32, 0.18]}
        color={statusColor(statuses.lungs)}
        emissive={statusEmissive(statuses.lungs)}
        speed={0.4}
      />
      {/* Liver */}
      <PulsingOrgan
        position={[0.3, -0.1, 0.05]}
        scale={[0.32, 0.22, 0.18]}
        color={statusColor(statuses.liver)}
        emissive={statusEmissive(statuses.liver)}
        speed={0.3}
      />
      {/* Kidneys */}
      <PulsingOrgan
        position={[-0.38, -0.6, -0.1]}
        scale={[0.14, 0.2, 0.12]}
        color={statusColor(statuses.kidneys)}
        emissive={statusEmissive(statuses.kidneys)}
        speed={0.5}
      />
      <PulsingOrgan
        position={[0.38, -0.6, -0.1]}
        scale={[0.14, 0.2, 0.12]}
        color={statusColor(statuses.kidneys)}
        emissive={statusEmissive(statuses.kidneys)}
        speed={0.5}
      />
      {/* Spine */}
      {[-0.8, -0.3, 0.2, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, -0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
          <meshStandardMaterial color="#64748b" emissive="#1e293b" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  );
}

interface OrganModelProps {
  statuses?: OrganStatusMap;
  height?: string;
}

export default function OrganModel({ statuses = {}, height = '480px' }: OrganModelProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={2} color="#06b6d4" />
        <pointLight position={[-4, -4, 4]} intensity={1.5} color="#8b5cf6" />
        <pointLight position={[0, 6, 0]} intensity={1} color="#ffffff" />
        <BodyModel statuses={statuses} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
