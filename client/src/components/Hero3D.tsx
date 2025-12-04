import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';

function DonerKebab() {
  const groupRef = useRef<THREE.Group>(null);
  const [mapTexture, setMapTexture] = useState<THREE.Texture | null>(null);
  
  // Load high-resolution Calw satellite texture
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(
      '/images/calw-satellite-hd.png',
      (texture) => {
        // WebGL 2.0 optimizations
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = 16;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        setMapTexture(texture);
      },
      undefined,
      (error) => {
        console.error('Texture loading error:', error);
      }
    );
  }, []);
  
  // Smooth rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15; // Slow rotation like a real döner
    }
  });

  // Memoize geometries
  const cylinderGeometry = useMemo(() => new THREE.CylinderGeometry(0.8, 0.7, 4, 64, 32), []);
  const rodGeometry = useMemo(() => new THREE.CylinderGeometry(0.05, 0.05, 5.5, 16), []);

  return (
    <group ref={groupRef}>
      {/* Metal Rod (Spieß) */}
      <mesh geometry={rodGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#8B8B8B"
          metalness={0.9}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Döner Meat with Calw Map Texture */}
      <mesh geometry={cylinderGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          map={mapTexture}
          roughness={0.7}
          metalness={0.1}
          envMapIntensity={1.0}
          toneMapped={false}
        />
      </mesh>

      {/* Inner Glow - Warm Orange (Grill Effect) */}
      <mesh geometry={cylinderGeometry} position={[0, 0, 0]} scale={[1.05, 1.02, 1.05]}>
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Glow - Warm Red */}
      <mesh geometry={cylinderGeometry} position={[0, 0, 0]} scale={[1.12, 1.05, 1.12]}>
        <meshBasicMaterial
          color="#ff4500"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Point lights for grill effect */}
      <pointLight position={[2, 0, 0]} intensity={0.8} color="#ff6b35" distance={5} />
      <pointLight position={[-2, 0, 0]} intensity={0.8} color="#ff6b35" distance={5} />
      <pointLight position={[0, 2, 2]} intensity={0.6} color="#ffa500" distance={4} />
    </group>
  );
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#1a4d2e');
  gradient.addColorStop(0.5, '#2d5f3f');
  gradient.addColorStop(1, '#1a4d2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  return canvas;
}

export default function Hero3D() {
  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/images/store-interior.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 backdrop-blur-sm" />
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Ambient Light */}
          <ambientLight intensity={0.4} />
          
          {/* Main Directional Light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
          />
          
          {/* Fill Light */}
          <directionalLight
            position={[-5, -3, -5]}
            intensity={0.5}
          />

          {/* Rim Light for dramatic effect */}
          <pointLight position={[0, 5, -5]} intensity={0.8} color="#10b981" />

          {/* Döner Kebab */}
          <DonerKebab />

          {/* No stars - store background instead */}

          {/* Camera Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4 px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-emerald-400 drop-shadow-2xl animate-fade-in">
            CALWER KEBAPHAUS
          </h1>
          <p className="text-3xl md:text-4xl font-semibold text-orange-500 drop-shadow-lg">
            Ultra Premium Lieferservice
          </p>
          <p className="text-xl md:text-2xl text-gray-300 font-medium">
            Inselgasse 3, 75365 Calw
          </p>
          <div className="flex items-center justify-center gap-4 text-emerald-400 text-lg md:text-xl font-medium">
            <span>Weltklasse-Qualität</span>
            <span>•</span>
            <span>Schnelle Lieferung</span>
            <span>•</span>
            <span>24/7 Service</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-emerald-400 rounded-full animate-scroll"></div>
        </div>
      </div>
    </div>
  );
}
