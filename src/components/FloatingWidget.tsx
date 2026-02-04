import { MessageCircle, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingWidget() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      
      {/* Scroll To Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            onClick={scrollToTop}
            className="bg-[#1A1A20] border border-white/10 hover:border-yellow-400 text-white p-3 rounded-full shadow-lg transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp / Live Chat Button */}
      <a 
        href="https://wa.me/" // Ganti dengan nomor WA asli nanti
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white pl-4 pr-3 py-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:scale-105"
      >
        <span className="font-bold text-sm hidden group-hover:block">Butuh Bantuan?</span>
        <div className="bg-white/20 p-1 rounded-full">
            <MessageCircle size={24} fill="white" className="text-transparent" />
        </div>
        {/* Indikator Online */}
        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-[#121212] rounded-full animate-ping"></span>
        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-[#121212] rounded-full"></span>
      </a>
    </div>
  );
}