import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden py-20">
      
      {/* Background Elements (Specific to Hero) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-purple-300 text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} /> #1 Trusted Gaming Marketplace
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 text-white leading-tight"
        >
          LEVEL UP YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
            GAME EXPERIENCE
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Instant Top Up for Mobile Legends, PUBG, Valorant, and 100+ other games. 
          Secure payments, 24/7 support, and <span className="text-white font-bold">100% legal currency</span>.
        </motion.p>

        {/* Stats / Trust Signals */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <StatBox icon={<Zap size={20} className="text-yellow-400" />} label="Instant Delivery" value="0.5s" />
          <StatBox icon={<Gamepad2 size={20} className="text-purple-400" />} label="Active Gamers" value="50K+" />
          <StatBox icon={<Sparkles size={20} className="text-cyan-400" />} label="Transactions" value="1M+" />
          <StatBox icon={<div className="w-5 h-5 rounded-full bg-green-500" />} label="Server Status" value="Online" />
        </motion.div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-[#130d21]/50 border border-white/5 backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center hover:border-purple-500/30 transition-colors group">
      <div className="mb-2 p-2 bg-white/5 rounded-full group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-2xl font-black italic text-white">{value}</div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</div>
    </div>
  );
}