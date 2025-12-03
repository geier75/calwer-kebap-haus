import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Center, useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

/**
 * Rotating 3D Kebab/Döner visualization
 */
function RotatingKebab() {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        {/* Kebab cylinder */}
        <cylinderGeometry args={[0.8, 0.6, 3, 32]} />
        <meshStandardMaterial
          color="#ff6600"
          metalness={0.3}
          roughness={0.4}
          emissive="#ff3300"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Meat layers */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, -1.4 + i * 0.25, 0]}>
          <cylinderGeometry args={[0.82, 0.62, 0.08, 32]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#d45500" : "#ff7700"}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      ))}
    </Float>
  );
}

/**
 * Particle system for ambient effects
 */
function Particles() {
  const count = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef<any>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
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
        color="#10b981"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * 3D Text Logo
 */
function Logo3D() {
  return (
    <Center position={[0, 3, 0]}>
      <Text3D
        font="/fonts/orbitron.json"
        size={0.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        CALWER
        <meshStandardMaterial
          color="#10b981"
          metalness={0.8}
          roughness={0.2}
          emissive="#10b981"
          emissiveIntensity={0.3}
        />
      </Text3D>
    </Center>
  );
}

/**
 * WebGL Hero Section Component
 */
export default function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden cyber-grid">
      {/* WebGL Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6600" />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#10b981"
          />
          
          <RotatingKebab />
          <Particles />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <div className="glass-glow rounded-2xl p-8 md:p-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-metallic">
            CALWER KEBAP
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 neon-orange">
            DELUXE
          </h2>
          <p className="text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl mx-auto font-light">
            Erlebe die Zukunft des Genusses. Premium Döner, Pizza & Kebap mit revolutionärem Lieferservice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="btn-cyber bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
              onClick={scrollToMenu}
            >
              Jetzt bestellen
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-cyber border-2 border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg"
              onClick={scrollToMenu}
            >
              Speisekarte ansehen
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-2xl mx-auto">
            <div className="glass-glow-orange rounded-lg p-4">
              <div className="text-3xl md:text-4xl font-bold neon-orange">50+</div>
              <div className="text-sm md:text-base text-foreground/70">Gerichte</div>
            </div>
            <div className="glass-glow rounded-lg p-4">
              <div className="text-3xl md:text-4xl font-bold neon-green">30min</div>
              <div className="text-sm md:text-base text-foreground/70">Lieferzeit</div>
            </div>
            <div className="glass-glow-orange rounded-lg p-4">
              <div className="text-3xl md:text-4xl font-bold neon-orange">★ 4.9</div>
              <div className="text-sm md:text-base text-foreground/70">Bewertung</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToMenu}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          aria-label="Scroll to menu"
        >
          <ChevronDown className="w-12 h-12 neon-green" />
        </button>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
    </section>
  );
}
