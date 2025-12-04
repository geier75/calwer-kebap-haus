import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, useTexture } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null);
  
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
  
  // Load high-resolution Calw satellite texture with optimization
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      '/images/calw-hd-satellite.jpg',
      (texture) => {
        // WebGL 2.0 optimizations
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16; // Maximum anisotropic filtering
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        
        // Center Calw on the globe - adjust UV mapping
        texture.offset.set(0.45, 0.48); // Fine-tuned for Calw center
        texture.repeat.set(0.15, 0.15); // Zoom in on Calw region
        
        setMapTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Texture loading error:', error);
        // Fallback to programmatic texture
        const fallbackTexture = new THREE.CanvasTexture(createEarthTexture());
        setMapTexture(fallbackTexture);
      }
    );
  }, []);
  
  const earthTexture = mapTexture || new THREE.CanvasTexture(createEarthTexture());
  
  // Smooth rotation with performance optimization
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate to show Calw prominently
      meshRef.current.rotation.y += delta * 0.08; // Slower, smoother rotation
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05; // Subtle wobble
    }
  });

  // Memoize geometry for performance
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(2, 128, 128), []);

  return (
    <group>
      {/* Main Earth Sphere with HD texture */}
      <mesh ref={meshRef} geometry={sphereGeometry}>
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.6}
          metalness={0.3}
          envMapIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      
      {/* Inner Atmosphere Glow - Emerald */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer Atmosphere Glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#34d399"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Calw Location Marker - Pulsing */}
      <mesh position={[markerX, markerY, markerZ]}>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
      
      {/* Animated Marker Ring */}
      <mesh position={[markerX, markerY, markerZ]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.09, 64]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Outer Marker Pulse */}
      <mesh position={[markerX, markerY, markerZ]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.14, 64]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function createEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 4096; // 4K resolution
  canvas.height = 2048;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  
  // High-quality gradient for ocean
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#0a4a3a');
  gradient.addColorStop(0.3, '#0d6855');
  gradient.addColorStop(0.5, '#10b981');
  gradient.addColorStop(0.7, '#0d6855');
  gradient.addColorStop(1, '#0a4a3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add detailed continents
  ctx.fillStyle = '#34d399';
  ctx.globalAlpha = 0.9;
  
  // Europe (centered for Calw)
  ctx.beginPath();
  ctx.ellipse(2000, 800, 400, 300, 0.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Add texture detail
  ctx.globalAlpha = 1;
  for (let i = 0; i < 15000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 1;
    const alpha = Math.random() * 0.4;
    ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
    ctx.fillRect(x, y, size, size);
  }
  
  return canvas;
}

// High-performance particle field
function ParticleField() {
  const count = 12000; // Increased particle count
  const particlesRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 70;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
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
        size={0.05}
        color="#34d399"
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      <Canvas 
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
          precision: 'highp'
        }}
        dpr={[1, 2]} // Adaptive pixel ratio
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" castShadow />
        <pointLight position={[-5, -3, -5]} intensity={1.2} color="#f97316" />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#10b981" />
        <spotLight position={[0, 5, 0]} intensity={0.6} angle={0.6} penumbra={1} color="#34d399" />
        
        <Stars 
          radius={180} 
          depth={80} 
          count={9000} 
          factor={6} 
          saturation={0} 
          fade 
          speed={0.6} 
        />
        <ParticleField />
        
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center z-10 px-4 backdrop-blur-sm bg-black/10 rounded-3xl p-12 border border-primary/20">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-gradient-green animate-fade-in drop-shadow-2xl">
            Calwer Kebap
          </h1>
          <p className="text-3xl md:text-5xl text-accent font-bold mb-4 animate-fade-in-delay-1 drop-shadow-lg">
            Ultra Premium Lieferservice
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-delay-2 drop-shadow-md">
            Inselgasse 3, 75365 Calw
          </p>
          <p className="text-lg md:text-xl text-primary mt-4 animate-fade-in-delay-3 glow-green font-semibold">
            Weltklasse-Qualität • Schnelle Lieferung • 24/7 Service
          </p>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2 glow-green backdrop-blur-sm bg-black/20">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
        </div>
      </div>
      
      {/* Ambient gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </div>
  );
}
