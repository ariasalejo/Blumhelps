import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

function Seed3D({ progress }: { progress: number }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1, 32, 32]} scale={1 + progress * 0.5}>
        <MeshDistortMaterial
          color={progress > 0.7 ? '#d4f15c' : progress > 0.3 ? '#d4b896' : '#3d5a3a'}
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.1}
        />
      </Sphere>
    </Float>
  );
}

function Seed2D({ progress }: { progress: number }) {
  const color = progress > 0.7 ? 'bg-[var(--lime)]' : progress > 0.3 ? 'bg-[var(--gold)]' : 'bg-[var(--moss)]';
  return (
    <div className={`w-32 h-32 rounded-full ${color} opacity-80 flex items-center justify-center shadow-2xl`}>
      <span className="text-4xl">🌱</span>
    </div>
  );
}

export function RecoveryGarden3D({ progress = 0.5 }: { progress?: number }) {
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 2 : false;
    
    // Solo activar 3D si hay potencia y no hay restricción de movimiento
    if (!mediaQuery.matches && !isLowEnd) {
      setUse3D(true);
    }
  }, []);

  return (
    <div className="w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden flex items-center justify-center border border-white/10">
      {use3D ? (
        <Canvas camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Seed3D progress={progress} />
          </Suspense>
        </Canvas>
      ) : (
        <Seed2D progress={progress} />
      )}
      
      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
        <p className="text-white/80 text-sm font-medium">Tu progreso de recuperación</p>
        <p className="text-white text-3xl font-bold serif">{Math.round(progress * 100)}%</p>
      </div>
    </div>
  );
}
