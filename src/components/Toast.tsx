import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Hilang otomatis setelah 3 detik
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: -50, x: '-50%' }} 
          animate={{ opacity: 1, y: 0, x: '-50%' }} 
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-8 left-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl backdrop-blur-md border border-white/10"
          style={{ 
            backgroundColor: type === 'success' ? 'rgba(20, 83, 45, 0.9)' : 'rgba(127, 29, 29, 0.9)',
          }}
        >
          {type === 'success' ? <CheckCircle2 className="text-green-400" /> : <AlertCircle className="text-red-400" />}
          <span className="text-white font-bold text-sm">{message}</span>
          <button onClick={onClose} className="ml-2 hover:bg-white/10 rounded-full p-1"><X size={14} className="text-white/50" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}