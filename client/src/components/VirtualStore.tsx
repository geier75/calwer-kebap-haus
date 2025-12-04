import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { X, Maximize2, RotateCcw, Info } from 'lucide-react';

interface VirtualStoreProps {
  onClose: () => void;
}

function StoreEnvironment() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load('/images/store-interior.jpg', (loadedTexture) => {
      // HD texture optimizations
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
      loadedTexture.repeat.x = -1; // Mirror horizontally for correct orientation
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.anisotropy = 16; // Maximum quality
      loadedTexture.generateMipmaps = true;
      loadedTexture.colorSpace = THREE.SRGBColorSpace; // Better color reproduction
      setTexture(loadedTexture);
    });

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene]);

  return (
    <>
      {/* Panoramic sphere with store interior - HD optimized */}
      <mesh ref={meshRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 128, 128]} />
        <meshBasicMaterial 
          map={texture} 
          side={THREE.BackSide}
          toneMapped={false}
          transparent={false}
          fog={false}
        />
      </mesh>

      {/* Floor plane for better depth perception */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color="#8B7355" 
          transparent 
          opacity={0.3}
          roughness={0.8}
        />
      </mesh>
    </>
  );
}

export default function VirtualStore({ onClose }: VirtualStoreProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    // This will be handled by OrbitControls reset
    window.location.reload();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Hide info after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Canvas with 3D scene */}
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={-0.5}
          minDistance={0.1}
          maxDistance={10}
          target={[0, 0, 0]}
        />
        <StoreEnvironment />
      </Canvas>

      {/* UI Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <h2 className="text-2xl font-bold text-white mb-1">
            Virtueller Ladenrundgang
          </h2>
          <p className="text-sm text-white/80">
            Calwer Pizza & Kebaphaus - Inselgasse 3, Calw
          </p>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={resetView}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
            title="Ansicht zurücksetzen"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
            title="Vollbild"
          >
            <Maximize2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
            title="Schließen"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Info overlay */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20 pointer-events-none"
        >
          <div className="flex items-start gap-3 text-white">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
            <div>
              <p className="font-semibold mb-1">Steuerung</p>
              <ul className="text-sm text-white/80 space-y-1">
                <li>🖱️ Ziehen: Umsehen</li>
                <li>🔍 Mausrad: Zoomen</li>
                <li>📱 Touch: Wischen & Pinch</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </motion.div>
  );
}
