import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function OpeningHoursWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [closingTime, setClosingTime] = useState("");

  useEffect(() => {
    const checkOpeningHours = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
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

  return (
    <motion.div
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
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
    >
      <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
      <Clock className={`h-4 w-4 ${isOpen ? 'text-green-400' : 'text-red-400'}`} />
      <span className="text-sm font-semibold text-white">
        {isOpen ? `GEÖFFNET bis ${closingTime}` : 'GESCHLOSSEN'}
      </span>
    </motion.div>
  );
}
