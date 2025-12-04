import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const phoneNumber = "4970519275 87"; // Restaurant phone number
  const message = "Hallo! Ich möchte gerne bestellen.";
  
  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover-lift"
      style={{
        background: 'rgba(34, 197, 94, 0.25)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '2px solid rgba(34, 197, 94, 0.4)',
        boxShadow: `
          0 0 20px rgba(34, 197, 94, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `
          0 0 30px rgba(34, 197, 94, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 -1px 0 rgba(0, 0, 0, 0.1)
        `
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <MessageCircle className="h-6 w-6 text-green-400" />
      <span className="font-semibold text-white hidden sm:inline">
        WhatsApp Bestellung
      </span>
    </motion.button>
  );
}
