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
      {/* Subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      
      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        {/* Restaurant Name - Clean Typography */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{
            fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
            color: '#22c55e',
            textShadow: `
              3px 3px 0px #000,
              -1px -1px 0px #000,
              1px -1px 0px #000,
              -1px 1px 0px #000,
              1px 1px 0px #000,
              0 0 20px rgba(34, 197, 94, 0.5)
            `,
            letterSpacing: '0.05em'
          }}>
            CALWER
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold" style={{
            fontFamily: '"Bebas Neue", "Arial Black", sans-serif',
            color: '#78350f',
            textShadow: `
              3px 3px 0px #000,
              -1px -1px 0px #000,
              1px -1px 0px #000,
              -1px 1px 0px #000,
              1px 1px 0px #000,
              0 0 20px rgba(120, 53, 15, 0.5)
            `,
            letterSpacing: '0.05em'
          }}>
            KEBAPHAUS
          </h2>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-white/90 text-xl md:text-2xl mb-4 drop-shadow-md">
            Inselgasse 3, 75365 Calw
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-green-400 text-sm md:text-base font-medium">
            <span className="drop-shadow-md">Frisch zubereitet</span>
            <span>•</span>
            <span className="drop-shadow-md">Schnelle Lieferung</span>
            <span>•</span>
            <span className="drop-shadow-md">Beste Qualität</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <a 
            href="#menu" 
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg 
                     hover:from-green-500 hover:to-green-600 transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl"
          >
            🍕 Jetzt bestellen
          </a>
          <a 
            href="tel:07051927587" 
            className="px-8 py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-bold rounded-lg 
                     hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-xl"
          >
            📞 Anrufen
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-green-500 rounded-full flex justify-center pt-2 bg-black/30 backdrop-blur-sm">
          <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
