import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo, Variants, } from 'framer-motion';
import { ChevronRight, ChevronLeft, Clock, ArrowRight, Zap, Target, Star } from 'lucide-react';
import { EVENTS } from '../data/events';

const AUTOPLAY_DELAY = 6000;

// --- SUB-COMPONENT: METEOR SHOWER ---
// Creates the "Meteor Garden" / Shooting Star effect
const MeteorShower = () => {
  // Generate static meteors to avoid re-renders causing jitter
  const meteors = useMemo(() => {
    const randomValues = Array.from({ length: 12 * 5 }, () => Math.random());
    return Array.from({ length: 12 }).map((_, i) => ({
      left: Math.floor(randomValues[i * 5] * 100) + "%",
      leftEnd: `${Math.floor(randomValues[i * 5 + 1] * -20)}%`,
      delay: randomValues[i * 5 + 2] * 10,
      duration: randomValues[i * 5 + 3] * 5 + 3,
      repeatDelay: randomValues[i * 5 + 4] * 5
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {meteors.map((meteor, i) => (
        <Meteor key={i} delay={meteor.delay} duration={meteor.duration} left={meteor.left} leftEnd={meteor.leftEnd} repeatDelay={meteor.repeatDelay} />
      ))}
    </div>
  );
};

const Meteor = ({ delay, duration, left, leftEnd, repeatDelay }: { delay: number; duration: number; left: string; leftEnd: string; repeatDelay: number }) => {
  return (
    <motion.div
      initial={{ top: -100, left, opacity: 0 }}
      animate={{
        top: "120%",
        left: [null, leftEnd], // Move slightly left as they fall
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
        repeatDelay
      }}
      className="absolute flex items-center transform rotate-[215deg]"
    >
      {/* Meteor Head */}
      <span className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]" />
      {/* Meteor Tail */}
      <span className="w-[120px] h-[1px] bg-gradient-to-r from-white to-transparent" />
    </motion.div>
  );
};

// --- SUB-COMPONENT: Floating Space Particles ---
const FloatingParticles = ({ color }: { color: string }) => {
  const particles = useMemo(() => Array.from({ length: 20 }), []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110%", x: `${Math.random() * 100}%`, opacity: 0 }}
          animate={{ 
            y: "-10%", 
            opacity: [0, 0.8, 0],
            scale: [0.2, 1, 0.2]
          }}
          transition={{ 
            duration: 8 + Math.random() * 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10 
          }}
          className={`absolute w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-gradient-to-t ${color} blur-[0.5px]`}
        />
      ))}
    </div>
  );
};

// --- SUB-COMPONENT: Tech Grid Overlay ---
const TechOverlay = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    {/* Subtle Hexagon/Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
  </div>
);

export default function EventCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrent((prev) => (prev + 1) % EVENTS.length);
    } else {
      setCurrent((prev) => (prev === 0 ? EVENTS.length - 1 : prev - 1));
    }
  };

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    if (!isPaused) {
      timeoutRef.current = window.setTimeout(() => {
        paginate(1);
      }, AUTOPLAY_DELAY);
    }
    return () => resetTimeout();
  }, [current, isPaused]);

  // 3D Parallax Mouse Handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  const handleDragEnd = (_: unknown, { offset }: PanInfo) => {
    if (offset.x < -50) paginate(1);
    else if (offset.x > 50) paginate(-1);
  };

  // --- TYPED VARIANTS (FIXED) ---
  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.15,
      filter: "blur(8px)" 
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)" 
    })
  };

  const imageAnimation: Variants = {
    initial: { scale: 1.1, x: 0, y: 0 },
    animate: { 
      scale: 1.15, 
      x: mousePosition.x * -25, 
      y: mousePosition.y * -25,
      transition: { duration: 0.4, ease: "linear" as const } // FIX: explicit const
    }
  };

  const textContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 }
    }
  };

  const textItem: Variants = {
    hidden: { y: 40, opacity: 0, filter: "blur(5px)" },
    show: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[550px] md:h-[650px] rounded-[3rem] overflow-hidden group select-none border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.8)] bg-[#050505]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false); setMousePosition({ x: 0, y: 0 }); }}
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 200, damping: 30 },
            opacity: { duration: 0.5 },
            filter: { duration: 0.4 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing bg-black"
        >
          {/* --- LAYER 1: Parallax Image --- */}
          <motion.div 
            variants={imageAnimation}
            initial="initial"
            animate="animate"
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${EVENTS[current].image})` }} 
          />

          {/* --- LAYER 2: Cinematic Atmosphere --- */}
          {/* Main Vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/75 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-[#030305]/20 to-transparent z-0" />
          
          {/* Meteor Garden & Particles */}
          <MeteorShower />
          <FloatingParticles color={EVENTS[current].color} />
          <TechOverlay />

          {/* --- LAYER 3: Content --- */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24 max-w-6xl z-20 pointer-events-none">
            
            <motion.div variants={textContainer} initial="hidden" animate="show">
                
                {/* Badge Row */}
                <motion.div variants={textItem} className="flex items-center gap-4 mb-6">
                  <div className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-[0.25em] bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2`}>
                      <Target size={14} className="stroke-[3px]" /> {EVENTS[current].game}
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-yellow-400 font-bold bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-yellow-500/20">
                      <Clock size={16} className="animate-pulse" /> 
                      <span className="tabular-nums tracking-widest">ENDS IN {EVENTS[current].endsIn}</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div variants={textItem} className="overflow-hidden mb-2">
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black italic text-white leading-[0.85] uppercase tracking-tighter drop-shadow-2xl">
                        {EVENTS[current].title}
                    </h2>
                </motion.div>

                {/* Subtitle */}
                <motion.p 
                  variants={textItem}
                  className={`text-3xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r ${EVENTS[current].color} mb-8 tracking-wide drop-shadow-lg filter brightness-125`}
                >
                  {EVENTS[current].subtitle}
                </motion.p>

                {/* Description */}
                <motion.p 
                  variants={textItem}
                  className="text-gray-300 text-base md:text-xl max-w-xl mb-10 leading-relaxed font-medium line-clamp-2 md:line-clamp-3 text-shadow-lg"
                >
                  {EVENTS[current].desc}
                </motion.p>

                {/* Buttons */}
                <motion.div variants={textItem} className="flex gap-4">
                    <button className="pointer-events-auto group/btn relative overflow-hidden bg-white text-black font-black text-sm md:text-lg px-10 py-4 rounded-2xl flex items-center gap-3 w-fit shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1 active:scale-95">
                        <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-20 transition-opacity bg-gradient-to-r ${EVENTS[current].color}`} />
                        <Zap size={22} className="fill-black relative z-10" /> 
                        <span className="relative z-10">{EVENTS[current].btnText}</span>
                        <ArrowRight size={22} className="-rotate-45 group-hover/btn:rotate-0 transition-transform duration-300 relative z-10"/>
                    </button>
                    
                    {/* Secondary Button */}
                    <button className="pointer-events-auto w-14 h-14 md:h-auto md:w-auto md:px-6 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                       <Star size={20} className="fill-white/20" />
                       <span className="hidden md:block">DETAILS</span>
                    </button>
                </motion.div>

            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* --- CONTROLS --- */}
      <div className="absolute right-10 bottom-10 z-30 flex gap-4">
          <button onClick={() => paginate(-1)} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group/nav shadow-2xl">
            <ChevronLeft size={32} className="group-hover/nav:-translate-x-1 transition-transform" />
          </button>
          <button onClick={() => paginate(1)} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group/nav shadow-2xl">
            <ChevronRight size={32} className="group-hover/nav:translate-x-1 transition-transform" />
          </button>
      </div>

      {/* Progress Bars */}
      <div className="absolute bottom-10 left-10 md:left-24 right-48 z-30 flex items-end gap-3">
        {EVENTS.map((evt, idx) => (
          <div 
            key={idx} 
            onClick={() => { setDirection(idx > current ? 1 : -1); setCurrent(idx); }}
            className={`cursor-pointer transition-all duration-500 overflow-hidden rounded-full h-1.5 ${current === idx ? 'w-24 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
          >
             {current === idx && !isPaused && (
               <motion.div 
                 layoutId="progress"
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" as const }} // FIX: explicit const
                 className={`h-full bg-gradient-to-r ${evt.color}`}
               />
             )}
             {current === idx && isPaused && (
               <div className={`h-full w-full bg-gradient-to-r ${evt.color}`} />
             )}
          </div>
        ))}
      </div>
    </div>
  );
}