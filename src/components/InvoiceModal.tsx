import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  price: string;
}

export default function InvoiceModal({ isOpen, onClose, onConfirm, productName, price }: InvoiceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-md bg-[#130d21] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-6 border-b border-white/10 text-center">
                <h3 className="text-xl font-black italic text-white tracking-wider">CONFIRM ORDER</h3>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-[#05020a] p-6 rounded-2xl border border-white/5 font-mono text-sm">
                    <div className="flex justify-between text-gray-400 mb-2"><span>Item</span><span>Price</span></div>
                    <div className="flex justify-between text-white font-bold text-lg mb-4 border-b border-dashed border-white/20 pb-4">
                        <span>{productName}</span>
                        <span className="text-cyan-400">{price}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-gray-400">TOTAL PAY</span>
                        <span className="font-black text-2xl text-white">{price}</span>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
                    <div className="mt-0.5 text-yellow-500"><CheckCircle2 size={16} /></div>
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                        Transaction cannot be refunded. Ensure ID is correct.
                    </p>
                </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="flex-[2] bg-white text-black py-3 rounded-xl font-black hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    CONFIRM PAYMENT
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}