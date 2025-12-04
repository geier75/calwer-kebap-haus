import { Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function OpeningHoursWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [closingTime, setClosingTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkOpeningHours = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Opening hours: 10:00 - 22:00 daily
      const openHour = 10;
      const closeHour = 22;
      
      const currentOpen = hours >= openHour && hours < closeHour;
      setIsOpen(currentOpen);
      setClosingTime(`${closeHour}:00`);
    };

    checkOpeningHours();
    const interval = setInterval(checkOpeningHours, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const openingHours = [
    { day: "Montag", hours: "10:00 - 22:00" },
    { day: "Dienstag", hours: "10:00 - 22:00" },
    { day: "Mittwoch", hours: "10:00 - 22:00" },
    { day: "Donnerstag", hours: "10:00 - 22:00" },
    { day: "Freitag", hours: "10:00 - 22:00" },
    { day: "Samstag", hours: "10:00 - 22:00" },
    { day: "Sonntag", hours: "10:00 - 22:00" },
  ];

  return (
    <>
      <motion.button
        onClick={() => setShowModal(true)}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg cursor-pointer hover-lift"
        style={{
          background: isOpen 
            ? 'rgba(34, 197, 94, 0.25)' 
            : 'rgba(239, 68, 68, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: isOpen
            ? '2px solid rgba(34, 197, 94, 0.4)'
            : '2px solid rgba(239, 68, 68, 0.4)',
          boxShadow: isOpen
            ? `0 0 15px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
            : `0 0 15px rgba(239, 68, 68, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
        }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <Clock className={`h-4 w-4 ${isOpen ? 'text-green-400' : 'text-red-400'}`} />
        <span className="text-sm font-semibold text-white">
          {isOpen ? `GEÖFFNET bis ${closingTime}` : 'GESCHLOSSEN'}
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-md"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '24px',
                boxShadow: `
                  0 0 40px rgba(34, 197, 94, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">Öffnungszeiten</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Opening Hours List */}
              <div className="p-6 space-y-3">
                {openingHours.map((item, idx) => (
                  <motion.div
                    key={item.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-between items-center p-3 rounded-lg"
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    <span className="font-semibold text-white">{item.day}</span>
                    <span className="text-green-400 font-mono">{item.hours}</span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 pt-0">
                <div 
                  className="p-4 rounded-lg text-center"
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <p className="text-sm text-green-400 font-semibold">
                    📞 Tel: +49 7051 927587
                  </p>
                  <p className="text-xs text-white/70 mt-1">
                    Inselgasse 3, 75365 Calw
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
