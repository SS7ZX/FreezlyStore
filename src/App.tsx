import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCarousel from './components/EventCarousel';
import Footer from './components/Footer'; 
import FloatingWidget from './components/FloatingWidget'; 
import Toast from './components/Toast'; 
import { WinRateCalculator, Leaderboard, TransactionLookup } from './components/Features';

// --- IMPORTS ---
import { GAMES } from './data/games'; 
import type { Product } from './data/games';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Search, User, CreditCard, Zap, 
  Gamepad2, Loader2, ImageOff, Flame, Ticket, X
} from 'lucide-react';

// --- DATA CONSTANTS ---
const PAYMENTS = [
  { id: 'qris', name: 'QRIS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qris.svg/1200px-Qris.svg.png' },
  { id: 'gopay', name: 'GoPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
  { id: 'dana', name: 'DANA', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png' },
  { id: 'ovo', name: 'OVO', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png' },
];

const RECENT_BUYS = [
  { user: 'xX_Shadow_Xx', game: 'Mobile Legends', item: '86 Diamonds' },
  { user: 'ProPlayer99', game: 'Valorant', item: '125 Points' },
  { user: 'Kratos_ID', game: 'PUBG', item: '60 UC' },
  { user: 'Ryu_Ken', game: 'Genshin Impact', item: '300 Crystals' },
];

// --- VISUAL SUB-COMPONENTS ---

// 1. The Meteor Shower (Background)
const MeteorShower = () => {
  // Memoize to prevent re-renders - generate all random values at once
  const meteors = useMemo(() => {
    const randomValues = Array.from({ length: 15 * 3 }, () => Math.random());
    return Array.from({ length: 15 }).map((_, i) => ({
      left: Math.floor(randomValues[i * 3] * 100) + "%",
      animationDelay: randomValues[i * 3 + 1] * (0.8 - 0.2) + 0.2 + "s",
      animationDuration: Math.floor(randomValues[i * 3 + 2] * (10 - 2) + 2) + "s",
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: 0,
            left: meteor.left,
            animationDelay: meteor.animationDelay,
            animationDuration: meteor.animationDuration,
          }}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-transparent" />
        </span>
      ))}
    </div>
  );
};

// 2. Star Field (Background)
const StarField = () => {
    const stars = useMemo(() => {
        const randomValues = Array.from({ length: 40 * 4 }, () => Math.random());
        return Array.from({ length: 40 }).map((_, i) => ({
            top: randomValues[i * 4] * 100 + '%',
            left: randomValues[i * 4 + 1] * 100 + '%',
            size: randomValues[i * 4 + 2] * 2 + 1,
            delay: randomValues[i * 4 + 3] * 5
        }));
    }, []);

    return (
        <div className="absolute inset-0">
            {stars.map((star, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: star.delay, ease: "easeInOut" }}
                    className="absolute bg-white rounded-full blur-[0.5px]"
                    style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                />
            ))}
        </div>
    );
};

// 3. Spotlight Card (UI)
const SpotlightCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card relative overflow-hidden rounded-3xl p-[1px] bg-white/5 border border-white/10 ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''} transition-all duration-300 backdrop-blur-md ${className}`}
      style={{ "--mouse-x": `${position.x}px`, "--mouse-y": `${position.y}px` } as React.CSSProperties}
    >
      {/* Spotlight Effect Layer */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(168,85,247,0.15), transparent 40%)`
        }}
      />
      {/* Border Glow Layer */}
      <div 
         className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
         style={{
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(6,182,212,0.3), transparent 40%)`,
            zIndex: 0
         }}
      />
      
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// 4. Confetti (Success)
const ConfettiExplosion = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-50 flex items-center justify-center">
    {[...Array(40)].map((_, i) => {
      const angle = Math.random() * 360;
      const velocity = 150 + Math.random() * 250;
      const tx = Math.cos(angle * (Math.PI / 180)) * velocity + "px";
      const ty = Math.sin(angle * (Math.PI / 180)) * velocity + "px";
      return (
        <div
          key={i}
          className="particle"
          style={{ "--tx": tx, "--ty": ty, backgroundColor: ['#a855f7', '#06b6d4', '#ec4899', '#ffffff'][i % 4] } as React.CSSProperties}
        />
      );
    })}
  </div>
);

// 5. Image Helper
const ImageWithFallback = ({ src, alt, className, type = 'cover' }: { src: string, alt: string, className?: string, type?: 'cover' | 'logo' }) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`${className} bg-[#1a1528] flex items-center justify-center flex-col text-gray-600 border border-white/5`}>
        {type === 'cover' ? <Gamepad2 size={40} className="mb-2 opacity-50"/> : <ImageOff size={20} />}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} loading="lazy" />;
};


// --- MAIN APP ---

function App() {
  const [currentView, setCurrentView] = useState<'HOME' | 'HISTORY' | 'LEADERBOARD' | 'CALCULATOR' | 'SUCCESS'>('HOME');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MOBILE' | 'PC'>('ALL');

  // Transaction State
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
 // Hapus setTrxId-nya aja, biarin trxId kalau emang dipake di bawah
const [trxId] = useState('');

  // UI State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error'; visible: boolean }>({ msg: '', type: 'success', visible: false });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const filteredGames = GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || game.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeGame = GAMES.find(g => g.id === selectedGameId);

  // Handlers
  const handleGameSelect = (id: string) => {
    setSelectedGameId(id);
    setCurrentView('HOME');
    setUserId('');
    setZoneId('');
    setSelectedProduct(null);
    setSelectedPayment(null);
    setDiscount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

// Di dalam App.tsx
// ✅ VERSI FINAL: DEBUGGING MODE ON

// Ganti handleCheckout di App.tsx dengan ini:
  const handleCheckout = async () => {
    if (!userId || !selectedProduct || !selectedPayment) {
        showToast("Lengkapi data dulu bos!", 'error');
        return;
    }

    setIsProcessing(true);
    console.log("🚀 Memulai Checkout ASLI (No Mockup)...");

    try {
        // 1. Bersihkan Harga (Hanya ambil angka)
        let numericPrice: number;
        if (typeof selectedProduct.price === 'string') {
             // @ts-ignore - Biar gak rewel TS-nya
             const cleanString = selectedProduct.price.replace(/[^0-9]/g, '');
             numericPrice = parseInt(cleanString);
        } else {
             numericPrice = Number(selectedProduct.price);
        }

        // 2. HIT API BACKEND (Wajib Connect)
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId, 
                zoneId: zoneId || "-", 
                game: activeGame?.name, 
                product: selectedProduct,
                paymentMethod: selectedPayment,
                price: numericPrice 
            })
        });

        // 3. Cek Error HTML (Server Meledak)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("🔥 Server HTML Error:", text);
            throw new Error("Server Error (Cek Console)");
        }

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Gagal Transaksi");

        // 4. REDIRECT XENDIT (Wajib Ada Link)
        if (result.invoice_url) {
            showToast("Mengarahkan ke Xendit...", 'success');
            console.log("🔗 Redirecting to:", result.invoice_url);
            
            // Kasih jeda dikit biar user baca toast
            setTimeout(() => {
                window.location.href = result.invoice_url; 
            }, 1000);
        } else {
            throw new Error("Backend tidak memberikan Link Xendit!");
        }

    } catch (err: any) {
        console.error("❌ ERROR CHECKOUT:", err);
        showToast(typeof err === 'string' ? err : (err.message || "Gagal"), 'error');
        setIsProcessing(false);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="min-h-screen text-white relative bg-[#050505] selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden font-sans">
      
      {/* --- EXTREME BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Deep Space Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1528] via-[#050505] to-black" />
          <StarField />
          <MeteorShower />
          {/* Atmospheric Fog */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
      </div>

      <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
      <FloatingWidget />
      
      {/* --- LIVE TICKER --- */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/5 py-2 flex items-center relative z-20">
        <div className="flex items-center px-4 gap-2 text-[10px] font-black tracking-widest text-green-400 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"/> LIVE
        </div>
        <div className="flex-1 overflow-hidden mask-linear-fade">
            <div className="flex gap-12 animate-marquee whitespace-nowrap text-[10px] text-gray-500 font-mono">
            {[...RECENT_BUYS, ...RECENT_BUYS, ...RECENT_BUYS].map((buy, i) => (
                <span key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white/20 rounded-full"/>
                <span className="text-gray-300 font-bold">{buy.user}</span> 
                <span className="text-gray-600">purchased</span> 
                <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{buy.item}</span>
                <span className="text-gray-600">in</span>
                <span className="text-purple-400">{buy.game}</span>
                </span>
            ))}
            </div>
        </div>
      </div>

      <Navbar 
        onOpenAuth={() => setIsAuthOpen(true)} 
        user={user} 
        onLogout={() => setUser(null)} 
        currentView={currentView} 
        onNavigate={(view) => { setCurrentView(view as any); setSelectedGameId(null); }} 
        onSearch={() => setSearchOpen(true)} 
      />

      <div className="pt-24 pb-12 relative z-10"> 
        <AnimatePresence mode="wait">

          {/* 1. SUCCESS VIEW */}
          {currentView === 'SUCCESS' ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }} 
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.05 }}
              className="container mx-auto px-4 flex justify-center items-center min-h-[60vh]"
            >
              <div className="relative w-full max-w-sm">
                <ConfettiExplosion />
                <SpotlightCard className="w-full">
                  <div className="bg-gradient-to-b from-purple-500/20 to-transparent p-10 text-center border-b border-white/5">
                      <motion.div 
                      initial={{scale:0, rotate: -180}} animate={{scale:1, rotate: 0}} transition={{type:"spring"}}
                      className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(168,85,247,0.5)] ring-4 ring-white/10"
                      >
                        <CheckCircle2 size={48} className="text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">Mission Accomplished</h2>
                      <p className="text-cyan-400 text-xs font-bold tracking-widest mt-2 uppercase">Payment Verified</p>
                  </div>
                  <div className="p-8 space-y-5">
                    <div className="flex justify-between items-center bg-black/40 p-5 rounded-xl border border-white/5">
                      <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total Amount</span>
                      <span className="text-2xl font-black text-cyan-400">{selectedProduct?.price}</span>
                    </div>
                    <div className="space-y-1 text-[10px] font-mono text-gray-500 text-center py-2 bg-black/20 rounded-lg">
                      <p>TRX ID: <span className="text-white">{trxId}</span></p>
                      <p>ACCOUNT: <span className="text-white">{userId}</span> ({zoneId})</p>
                    </div>
                    <button onClick={() => { setCurrentView('HOME'); setSelectedGameId(null); }} className="w-full bg-white text-black py-4 rounded-xl font-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      Return to Base
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            </motion.div>

          /* 2. HOME VIEW */
          ) : currentView === 'HOME' && !selectedGameId ? (
            <motion.div key="home-grid" exit={{ opacity: 0, y: -20 }}>
              <Hero />
              
              <div className="container mx-auto px-4 -mt-16 relative z-10 mb-20">
                <EventCarousel /> 
              </div>

              <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                        <Flame size={24} className="text-white fill-white"/>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-white leading-none">GAME CATALOGUE</h2>
                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">Select your battlefield</p>
                      </div>
                    </div>
                    
                    <div className="flex bg-white/5 p-1.5 rounded-2xl backdrop-blur-sm border border-white/5">
                      {['ALL', 'MOBILE', 'PC'].map((cat) => (
                        <button 
                          key={cat} onClick={() => setCategoryFilter(cat as any)}
                          className={`px-6 py-2.5 rounded-xl text-[10px] font-bold tracking-widest transition-all ${categoryFilter === cat ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                 </div>

                 <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <AnimatePresence>
                    {filteredGames.map((game) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.8 }}
                        key={game.id}
                        className="h-full"
                      >
                        <SpotlightCard onClick={() => handleGameSelect(game.id)} className="h-full group">
                          <div className="relative aspect-[3/4] w-full overflow-hidden">
                            <ImageWithFallback src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] via-transparent to-transparent opacity-90" />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />

                            <div className="absolute bottom-0 w-full p-5 z-20">
                              <h3 className="text-lg font-black italic uppercase text-white leading-none mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-md">{game.name}</h3>
                              <div className="flex items-center gap-2">
                                 <span className="text-[9px] font-bold bg-white/10 text-white/80 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 uppercase tracking-wider">{game.publisher}</span>
                              </div>
                            </div>
                          </div>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                    </AnimatePresence>
                 </motion.div>
              </div>
            </motion.div>

          /* 3. CHECKOUT VIEW */
          ) : currentView === 'HOME' && selectedGameId && activeGame ? (
            <motion.div 
              key="detail" 
              initial={{ opacity: 0, x: 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="container mx-auto px-4 max-w-6xl"
            >
              <button onClick={() => setSelectedGameId(null)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest hover:-translate-x-2 transition-transform">
                <div className="bg-white/10 p-2 rounded-full"><Search className="rotate-90" size={14} /></div>
                Abort Mission / Back
              </button>

              <SpotlightCard className="mb-10 rounded-[2.5rem] border-0 ring-1 ring-white/10 shadow-2xl">
                  <div className="relative h-64 md:h-96 overflow-hidden group">
                    <ImageWithFallback src={activeGame.image} alt={activeGame.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-in-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 flex flex-col md:flex-row items-start md:items-end gap-8 w-full">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="w-28 h-28 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black"
                      >
                        <ImageWithFallback src={activeGame.logo} alt={activeGame.name} className="w-full h-full object-cover" type="logo" />
                      </motion.div>
                      <div className="mb-2">
                          <motion.h1 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter drop-shadow-lg"
                          >
                            {activeGame.name}
                          </motion.h1>
                          <motion.p 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-cyan-400 font-bold flex items-center gap-2 mt-3 text-sm uppercase tracking-widest"
                          >
                            <Zap size={16} className="fill-cyan-400"/> Instant Delivery Protocol Active
                          </motion.p>
                      </div>
                    </div>
                  </div>
              </SpotlightCard>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: FORM */}
                <div className="lg:col-span-2 space-y-8">
                  {/* ID Input */}
                  <SpotlightCard className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black border border-purple-500/30">01</div>
                        <h3 className="font-black text-xl italic tracking-wider">TARGET IDENTIFICATION</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">User ID</label>
                           <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18}/>
                              <input type="text" placeholder="Enter ID" value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700" />
                           </div>
                        </div>
                        <div className="relative group">
                           <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Zone ID</label>
                           <div className="relative">
                              <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18}/>
                              <input type="text" placeholder="Enter Zone" value={zoneId} onChange={e => setZoneId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-700" />
                           </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-600" /> 
                         Ensure target details are correct to prevent resource loss.
                      </div>
                  </SpotlightCard>

                  {/* Products */}
                  <SpotlightCard className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black border border-cyan-500/30">02</div>
                        <h3 className="font-black text-xl italic tracking-wider">SELECT RESOURCE PACKAGE</h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {activeGame.products && activeGame.products.map((p, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setSelectedProduct(p)}
                            className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${selectedProduct?.name === p.name ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'}`}
                          >
                            <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide group-hover:text-gray-300">{p.name}</div>
                            <div className={`font-black italic text-xl ${selectedProduct?.name === p.name ? 'text-cyan-400' : 'text-white'}`}>{p.price}</div>
                            {selectedProduct?.name === p.name && (
                                <motion.div layoutId="check" className="absolute top-2 right-2 text-cyan-500"><CheckCircle2 size={16} className="fill-cyan-500/20"/></motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                  </SpotlightCard>

                  {/* Payment */}
                  <SpotlightCard className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-black border border-pink-500/30">03</div>
                        <h3 className="font-black text-xl italic tracking-wider">PAYMENT PROTOCOL</h3>
                      </div>
                      <div className="space-y-3">
                        {PAYMENTS.map((pay) => (
                          <div 
                            key={pay.id}
                            onClick={() => setSelectedPayment(pay.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedPayment === pay.id ? 'bg-pink-500/10 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-2 rounded-lg w-16 h-10 flex items-center justify-center shadow-sm"><ImageWithFallback src={pay.icon} alt={pay.name} className="max-h-full max-w-full object-contain"/></div>
                              <span className="font-bold text-sm tracking-wide">{pay.name}</span>
                            </div>
                            {selectedProduct && selectedPayment === pay.id && (
                              <div className="text-right">
                                {discount > 0 && <div className="text-[10px] text-green-400 line-through mb-1">{selectedProduct.price}</div>}
                                <div className="font-black text-pink-500 text-lg">{discount > 0 ? "Rp " + (selectedProduct.rawValue - discount).toLocaleString('id-ID') : selectedProduct.price}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                  </SpotlightCard>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="lg:col-span-1">
                   <div className="sticky top-28 space-y-6">
                    <SpotlightCard className="p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10">
                      <h3 className="font-black italic text-xl mb-8 tracking-widest text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-cyan-500 rounded-full"/> MANIFEST
                      </h3>
                      
                      <div className="space-y-4 mb-8 text-sm">
                          <div className="flex justify-between border-b border-dashed border-white/10 pb-4">
                              <span className="text-gray-500 font-medium">Item</span>
                              <span className="text-white font-bold text-right">{selectedProduct?.name || '-'}</span>
                          </div>
                          <div className="flex justify-between border-b border-dashed border-white/10 pb-4">
                              <span className="text-gray-500 font-medium">Method</span>
                              <span className="text-white uppercase font-bold text-right">{selectedPayment || '-'}</span>
                          </div>
                          
                          {/* Promo */}
                          <div className="pt-2">
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Voucher Code</label>
                            <div className="flex gap-2">
                              <div className="relative flex-grow">
                                <Ticket size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                                <input type="text" placeholder="CODE" value={promoCode} onChange={e => setPromoCode(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 py-2.5 text-xs text-white focus:border-purple-500 outline-none uppercase font-mono tracking-widest"/>
                              </div>
                              <button onClick={() => { if(promoCode === 'GAMER'){ setDiscount(5000); showToast("Voucher Redeemed!", 'success'); } else { showToast("Invalid Code", 'error'); }}} className="bg-white/10 hover:bg-white/20 px-4 rounded-lg text-xs font-bold transition-colors">APPLY</button>
                            </div>
                          </div>
                      </div>

                      <div className="flex justify-between items-center mb-8 pt-6 border-t-2 border-white/5">
                          <span className="text-gray-400 font-black uppercase text-xs tracking-widest">Total Payable</span>
                          <span className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">
                            {selectedProduct ? `Rp ${(selectedProduct.rawValue - discount).toLocaleString('id-ID')}` : 'Rp 0'}
                          </span>
                      </div>

                      <button 
                        onClick={handleCheckout}
                        disabled={!userId || !selectedProduct || !selectedPayment || isProcessing}
                        className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group/btn ${(!userId || !selectedProduct || !selectedPayment || isProcessing) ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}
                      >
                         <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover/btn:opacity-20 transition-opacity`} />
                        {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
                        <span className="relative z-10 tracking-widest text-sm">{isProcessing ? 'PROCESSING...' : 'CONFIRM PAYMENT'}</span>
                      </button>
                      
                      <p className="text-[10px] text-gray-600 text-center mt-4">Secure 256-bit SSL Encrypted Transaction</p>
                    </SpotlightCard>
                   </div>
                </div>
              </div>
            </motion.div>

          /* 4. OTHER FEATURES */
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4">
              {currentView === 'HISTORY' && <TransactionLookup />}
              {currentView === 'CALCULATOR' && <WinRateCalculator />}
              {currentView === 'LEADERBOARD' && <Leaderboard />}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      
      <Footer />

      {/* --- COMMAND PALETTE (Global Search) --- */}
      <AnimatePresence>
      {searchOpen && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4" onClick={() => setSearchOpen(false)}>
           <motion.div initial={{scale:0.9, y: 20}} animate={{scale:1, y: 0}} exit={{scale:0.9, y: 20}} className="w-full max-w-2xl bg-[#0f0a1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-4 px-6 py-6 border-b border-white/10">
                 <Search className="text-purple-500" size={24}/>
                 <input 
                  autoFocus 
                  type="text" 
                  placeholder="Search catalogue..." 
                  className="flex-1 bg-transparent outline-none text-white text-xl placeholder:text-gray-600 font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 <button onClick={() => setSearchOpen(false)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400">ESC</button>
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                 {filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                       <div key={game.id} onClick={() => { handleGameSelect(game.id); setSearchOpen(false); }} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors border border-transparent hover:border-white/5">
                          <img src={game.logo} className="w-12 h-12 rounded-lg object-cover shadow-lg group-hover:scale-110 transition-transform" alt={game.name}/>
                          <div>
                             <div className="font-bold text-gray-200 group-hover:text-white text-lg">{game.name}</div>
                             <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{game.publisher}</div>
                          </div>
                          <ArrowIcon className="ml-auto text-gray-600 group-hover:text-purple-500" />
                       </div>
                    ))
                 ) : (
                    <div className="p-12 text-center text-gray-600 font-bold">No results found in database.</div>
                 )}
              </div>
              <div className="px-6 py-3 bg-black/40 text-[10px] text-gray-500 flex justify-between">
                 <span>PRO TIP: Use arrow keys to navigate</span>
                 <span>v2.0.5-stable</span>
              </div>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
      {isAuthOpen && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
           <SpotlightCard className="p-10 max-w-md w-full text-center border border-white/10 shadow-2xl relative">
              <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                 <User size={32} className="text-white"/>
              </div>
              <h2 className="text-3xl font-black italic mb-2 text-white tracking-tighter uppercase">Identify Yourself</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Login to sync your battle data, track transaction history, and unlock elite rewards.</p>
              
              <button onClick={() => { setUser({name: 'Viper', email: 'user@test.com'}); setIsAuthOpen(false); showToast("Welcome back, Commander.", 'success'); }} className="w-full bg-white text-black py-4 rounded-xl font-black mb-4 hover:bg-cyan-400 transition-colors uppercase tracking-widest shadow-lg">Connect Wallet / Login</button>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-6">Secure Access v1.0</p>
           </SpotlightCard>
        </motion.div>
      )}
      </AnimatePresence>

      {/* --- GLOBAL STYLES FOR ANIMATION --- */}
      <style>{`
        @keyframes meteor {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
        }
        .animate-meteor {
          animation: meteor 5s linear infinite;
        }
        .mask-linear-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}

const ArrowIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

export default App;
