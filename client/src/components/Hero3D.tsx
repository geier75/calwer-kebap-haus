import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Calw coordinates: 48.7147° N, 8.7397° E
  const calwLat = 48.7147;
  const calwLon = 8.7397;

  // Convert lat/lon to 3D coordinates on sphere
  const latRad = (calwLat * Math.PI) / 180;
  const lonRad = (calwLon * Math.PI) / 180;
  const radius = 2.05; // Slightly above Earth surface

  const markerX = radius * Math.cos(latRad) * Math.cos(lonRad);
  const markerY = radius * Math.sin(latRad);
  const markerZ = radius * Math.cos(latRad) * Math.sin(lonRad);
  
  // Create earth-like texture programmatically
  const earthTexture = new THREE.CanvasTexture(createEarthTexture());
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.7}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Atmosphere Glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer Atmosphere */}
      <Sphere args={[2.2, 64, 64]}>
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Calw Location Marker */}
      <mesh position={[markerX, markerY, markerZ]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={3}
        />
      </mesh>
      
      {/* Marker Glow Ring */}
      <mesh position={[markerX, markerY, markerZ]}>
        <ringGeometry args={[0.04, 0.07, 32]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.8}
          side={2}
        />
      </mesh>
    </group>
  );
}

function createEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  // Base ocean color
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a4a3a');
  gradient.addColorStop(0.5, '#0d5c4a');
  gradient.addColorStop(1, '#0a4a3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add continents (simplified)
  ctx.fillStyle = '#10b981';
  
  // Africa-like shape
  ctx.beginPath();
  ctx.ellipse(1200, 500, 200, 300, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Europe-like shape
  ctx.beginPath();
  ctx.ellipse(1100, 300, 150, 100, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Asia-like shape
  ctx.beginPath();
  ctx.ellipse(1500, 400, 350, 250, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Americas-like shape
  ctx.beginPath();
  ctx.ellipse(400, 400, 180, 400, 0.1, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(300, 700, 150, 200, -0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add some texture/noise
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 3;
    ctx.fillStyle = `rgba(16, 185, 129, ${Math.random() * 0.3})`;
    ctx.fillRect(x, y, size, size);
  }
  
  return canvas;
}

function ParticleField() {
  const count = 8000;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 60;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#34d399"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#f97316" />
        <pointLight position={[3, 3, 3]} intensity={0.6} color="#10b981" />
        
        <Stars radius={150} depth={60} count={7000} factor={5} saturation={0} fade speed={0.5} />
        <ParticleField />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center z-10 px-4">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-gradient-green animate-fade-in">
            Calwer Kebap
          </h1>
          <p className="text-3xl md:text-5xl text-accent font-bold mb-4 animate-fade-in-delay-1">
            Ultra Premium Lieferservice
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-delay-2">
            Inselgasse 3, 75365 Calw
          </p>
          <p className="text-lg md:text-xl text-primary mt-4 animate-fade-in-delay-3 glow-green">
            Weltklasse-Qualität • Schnelle Lieferung • 24/7 Service
          </p>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2 glow-green">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
