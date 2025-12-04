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
      {/* Lighter overlay for better store visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
      
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Restaurant Name - Professional & Visual */}
        <div className="text-center mb-8">
          <h1 className="text-7xl md:text-9xl font-black mb-2" style={{
            fontFamily: '"Montserrat", "Arial Black", sans-serif',
            color: 'transparent',
            WebkitTextStroke: '6px #c0c0c0',
            textShadow: `
              0 0 30px rgba(192, 192, 192, 1),
              0 0 60px rgba(255, 255, 255, 0.8),
              0 0 90px rgba(192, 192, 192, 0.6),
              0 6px 12px rgba(0, 0, 0, 0.9)
            `,
            filter: 'drop-shadow(0 0 25px rgba(192, 192, 192, 0.9)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.5))',
            letterSpacing: '0.02em',
            fontWeight: 900
          }}>
            CALWER
          </h1>
          <h2 className="text-6xl md:text-8xl font-black" style={{
            fontFamily: '"Montserrat", "Arial Black", sans-serif',
            color: 'transparent',
            WebkitTextStroke: '6px #c0c0c0',
            textShadow: `
              0 0 30px rgba(192, 192, 192, 1),
              0 0 60px rgba(255, 255, 255, 0.8),
              0 0 90px rgba(192, 192, 192, 0.6),
              0 6px 12px rgba(0, 0, 0, 0.9)
            `,
            filter: 'drop-shadow(0 0 25px rgba(192, 192, 192, 0.9)) drop-shadow(0 0 50px rgba(255, 255, 255, 0.5))',
            letterSpacing: '0.02em',
            fontWeight: 900
          }}>
            KEBAPHAUS
          </h2>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-white text-xl md:text-2xl mb-4 font-semibold drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            Inselgasse 3, 75365 Calw
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-green-300 text-sm md:text-base font-semibold">
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Frisch zubereitet</span>
            <span>•</span>
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Schnelle Lieferung</span>
            <span>•</span>
            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Beste Qualität</span>
          </div>
        </div>
        
        {/* CTA Buttons with Glassmorphism */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a 
            href="#menu" 
            className="group relative px-10 py-5 font-bold rounded-2xl overflow-hidden
                     transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'rgba(34, 197, 94, 0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2px solid rgba(34, 197, 94, 0.4)',
              boxShadow: `
                0 8px 32px rgba(34, 197, 94, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            <span className="relative text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              🍕 Jetzt bestellen
            </span>
          </a>
          <a 
            href="tel:07051927587" 
            className="group relative px-10 py-5 font-bold rounded-2xl overflow-hidden
                     transform hover:scale-105 transition-all duration-300"
            style={{
              background: 'rgba(217, 119, 6, 0.25)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2px solid rgba(217, 119, 6, 0.4)',
              boxShadow: `
                0 8px 32px rgba(217, 119, 6, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
            <span className="relative text-white text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              📞 Anrufen
            </span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator with Glassmorphism */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div 
          className="w-6 h-10 border-2 border-green-400/60 rounded-full flex justify-center pt-2"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
        </div>
      </div>
    </div>
  );
}
