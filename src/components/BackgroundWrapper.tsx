import { motion } from 'framer-motion';

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#030014] overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* --- ANIMATED BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Blob Ungu Kiri Atas */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
        />
        
        {/* Blob Cyan Kanan Bawah */}
        <motion.div 
          animate={{ scale: [1, 1.3, 1], x: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
        />

        {/* Blob Pink Bawah Kiri */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-40 -left-20 w-[700px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]"
        />

        {/* Grid Overlay untuk kesan Cyber */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      </div>

      {/* Content di atas background */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}