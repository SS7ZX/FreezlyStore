import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Clock } from 'lucide-react';
import { EVENTS } from '../data/events'; // Import the data we just created

export default function EventCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % EVENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % EVENTS.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? EVENTS.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-white/10 group">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{ backgroundImage: `url(${EVENTS[current].image})` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0514] via-[#0a0514]/80 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-4"
            >
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${EVENTS[current].color} text-white shadow-lg`}>
                {EVENTS[current].game}
              </span>
              <span className="flex items-center gap-1 text-xs text-yellow-400 font-bold bg-black/50 px-2 py-1 rounded-full border border-white/10">
                <Clock size={12} /> ENDS IN 2 DAYS
              </span>
            </motion.div>

            <motion.h2 
              initial={{ x: -50, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-black italic text-white leading-none mb-2 uppercase tracking-tighter"
            >
              {EVENTS[current].title}
            </motion.h2>

            <motion.p 
              initial={{ x: -50, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className={`text-xl md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r ${EVENTS[current].color} mb-4`}
            >
              {EVENTS[current].subtitle}
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.6 }}
              className="text-gray-300 text-sm md:text-base max-w-md mb-8 leading-relaxed"
            >
              {EVENTS[current].desc}
            </motion.p>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${EVENTS[current].btnColor} text-black font-black px-8 py-3 rounded-full flex items-center gap-2 w-fit shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-shadow`}
            >
              <Sparkles size={18} fill="black" /> CHECK EVENT
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons (Visible on Hover) */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
        <ChevronRight size={24} />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-8 md:left-16 flex gap-2">
        {EVENTS.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${current === idx ? 'w-8 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/20'}`} 
          />
        ))}
      </div>
    </div>
  );
}