import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense } from 'react';

function ParticleField() {
  return (
    <>
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0.8} 
        fade 
        speed={0.5}
      />
    </>
  );
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      
      {/* Cyberpunk Logo */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-5xl px-8">
          <img 
            src="/images/cyberpunk-logo.png" 
            alt="CALWER KEBAPHAUS" 
            className="w-full h-auto animate-pulse-slow drop-shadow-[0_0_50px_rgba(0,255,200,0.8)]"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0, 255, 200, 0.6)) drop-shadow(0 0 60px rgba(138, 43, 226, 0.4))',
              animation: 'glow 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Subtitle and CTA */}
      <div className="absolute bottom-32 left-0 right-0 z-20 text-center px-4">
        <p className="text-orange-500 text-2xl md:text-3xl font-bold mb-2 tracking-wide drop-shadow-lg">
          Ultra-Premium Lieferservice
        </p>
        <p className="text-white/90 text-lg md:text-xl mb-4">
          Inselgasse 3, 75365 Calw
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-cyan-400 text-sm md:text-base font-medium">
          <span>Weltklasse-Qualität</span>
          <span>•</span>
          <span>Schnelle Lieferung</span>
          <span>•</span>
          <span>24/7 Service</span>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a 
            href="#menu" 
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg 
                     hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105 transition-all duration-300
                     shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]"
          >
            🍕 Jetzt bestellen
          </a>
          <a 
            href="tel:07051927587" 
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg 
                     hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300
                     shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_30px_rgba(138,43,226,0.8)]"
          >
            📞 Anrufen
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 3D Background Particles */}
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
          <ParticleField />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* Cyberpunk Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.2) 25%, rgba(0, 255, 255, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.2) 75%, rgba(0, 255, 255, 0.2) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.2) 25%, rgba(0, 255, 255, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.2) 75%, rgba(0, 255, 255, 0.2) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <style>{`
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 30px rgba(0, 255, 200, 0.6)) drop-shadow(0 0 60px rgba(138, 43, 226, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 50px rgba(0, 255, 200, 0.9)) drop-shadow(0 0 100px rgba(138, 43, 226, 0.7));
          }
        }
      `}</style>
    </div>
  );
}
