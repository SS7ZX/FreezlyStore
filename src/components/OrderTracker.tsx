import { motion } from 'framer-motion';
import { Check, Loader2, Server, Wifi, Database } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TrackerProps {
  onComplete: () => void;
}

export default function OrderTracker({ onComplete }: TrackerProps) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 2000);
    const timer2 = setTimeout(() => setStep(3), 4500);
    const timer3 = setTimeout(() => onComplete(), 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black italic text-white mb-2"
          >
            MEMPROSES PESANAN
          </motion.h2>
          <p className="text-gray-500">Jangan tutup halaman ini. Menghubungkan ke gateway...</p>
        </div>

        <div className="space-y-6">
          <TrackerStep 
            icon={<Wifi />} 
            title="Koneksi Server" 
            desc="Melakukan handshake dengan server game..." 
            status={step > 1 ? 'completed' : step === 1 ? 'active' : 'pending'} 
          />
          <TrackerStep 
            icon={<Server />} 
            title="Alokasi Aset" 
            desc="Menyiapkan item dari vault penyimpanan..." 
            status={step > 2 ? 'completed' : step === 2 ? 'active' : 'pending'} 
          />
          <TrackerStep 
            icon={<Database />} 
            title="Finalisasi Transaksi" 
            desc="Sinkronisasi data akun ID 994821..." 
            status={step === 3 ? 'active' : 'pending'} 
          />
        </div>

        <div className="mt-12 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

function TrackerStep({ icon, title, desc, status }: { icon: any, title: string, desc: string, status: 'pending' | 'active' | 'completed' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-6 p-4 rounded-xl border transition-all duration-500 ${
        status === 'active' ? 'bg-[#121212] border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.05)]' : 
        status === 'completed' ? 'bg-[#0A0A0A] border-green-500/30' : 'border-transparent opacity-50'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
        status === 'active' ? 'border-yellow-400 text-yellow-400 animate-pulse' :
        status === 'completed' ? 'bg-green-500 border-green-500 text-black' : 'border-gray-700 text-gray-700'
      }`}>
        {status === 'completed' ? <Check size={20} /> : status === 'active' ? <Loader2 className="animate-spin" size={20} /> : icon}
      </div>
      <div>
        <h4 className={`font-bold text-lg ${status === 'active' ? 'text-white' : status === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>
          {title}
        </h4>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}