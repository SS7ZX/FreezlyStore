import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIXED: Removed unused imports (Trophy, History, BarChart3, Star, ImageOff) to clear TS6133 errors
import { 
  CheckCircle2, Search, User, CreditCard, Zap, 
  Gamepad2, Loader2, Flame, Ticket, X, 
  ChevronRight, ShieldCheck, ArrowUpRight, Lock, Wallet
} from 'lucide-react';

// --- EXISTING IMPORTS ---
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCarousel from './components/EventCarousel';
import Footer from './components/Footer'; 
import FloatingWidget from './components/FloatingWidget'; 
import Toast from './components/Toast'; 
import { WinRateCalculator, Leaderboard, TransactionLookup } from './components/Features';
import { GAMES } from './data/games'; 
import type { Product } from './data/games';

// ============================================================================
// SECTION 1: TYPES & INTERFACES (STRICT TYPING)
// ============================================================================

type ViewState = 'HOME' | 'HISTORY' | 'LEADERBOARD' | 'CALCULATOR' | 'SUCCESS';
type CategoryFilter = 'ALL' | 'MOBILE' | 'PC' | 'VOUCHER';
type CheckoutStep = 'ID_ENTRY' | 'PRODUCT_SELECT' | 'PAYMENT_SELECT' | 'CONFIRMATION';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  isVip: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  maintenance: boolean;
}

interface ToastState {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info';
}

// ============================================================================
// SECTION 2: MOCK DATA & CONSTANTS
// ============================================================================

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS Instant', fee: 0, maintenance: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qris.svg/1200px-Qris.svg.png' },
  { id: 'gopay', name: 'GoPay', fee: 1000, maintenance: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
  { id: 'dana', name: 'DANA', fee: 500, maintenance: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png' },
  { id: 'ovo', name: 'OVO', fee: 1500, maintenance: false, icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_ovo_purple.svg/2560px-Logo_ovo_purple.svg.png' },
  { id: 'va_bca', name: 'BCA Virtual Account', fee: 4000, maintenance: true, icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
];

const RECENT_TRANSACTIONS = [
  { user: 'Shadow_Slayer', game: 'Mobile Legends', item: '86 Diamonds', time: '2s ago' },
  { user: 'Pro_Gamer_ID', game: 'Valorant', item: '1250 Points', time: '5s ago' },
  { user: 'Kratos_X', game: 'PUBG Mobile', item: '60 UC', time: '12s ago' },
  { user: 'Genshin_Whale', game: 'Genshin Impact', item: '6480 Crystals', time: '18s ago' },
  { user: 'Faker_Fan', game: 'League of Legends', item: 'RP Bundle', time: '25s ago' },
  { user: 'S1mple', game: 'CS2', item: 'Prime Status', time: '30s ago' },
];

// ============================================================================
// SECTION 3: ADVANCED VISUAL COMPONENTS
// ============================================================================

// 3.1 Optimized Meteor Shower
const MeteorShower = React.memo(() => {
  const meteors = useMemo(() => Array.from({ length: 20 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {meteors.map((_, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-cyan-500/50 shadow-[0_0_0_1px_#ffffff10]"
          style={{
            top: -100,
            left: Math.floor(Math.random() * 100) + "%",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[100px] -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-transparent" />
        </span>
      ))}
    </div>
  );
});

// 3.2 Dynamic Starfield
const StarField = React.memo(() => {
    return (
        <div className="absolute inset-0 z-0">
            {[...Array(50)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: Math.random() }}
                    animate={{ opacity: [0.1, 0.8, 0.1] }}
                    transition={{ 
                        duration: Math.random() * 3 + 2, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: Math.random() * 2 
                    }}
                    className="absolute bg-white rounded-full"
                    style={{ 
                        top: Math.random() * 100 + '%', 
                        left: Math.random() * 100 + '%', 
                        width: Math.random() * 2 + 'px', 
                        height: Math.random() * 2 + 'px',
                        filter: 'blur(0.5px)'
                    }}
                />
            ))}
        </div>
    );
});

// 3.3 Noise Overlay
const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.03] mix-blend-overlay" 
         style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }} 
    />
);

// 3.4 Interactive Spotlight Card
const SpotlightCard = ({ children, className = "", onClick, disabled = false }: { children: React.ReactNode, className?: string, onClick?: () => void, disabled?: boolean }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || disabled) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={!disabled ? onClick : undefined}
      className={`relative overflow-hidden rounded-3xl p-[1px] bg-[#1a1528]/40 border border-white/5 transition-all duration-300 backdrop-blur-md ${disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
    >
      <div 
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
        }}
      />
       <div 
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
            opacity,
            background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`,
            zIndex: 0
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// FIXED: Removed unused 'SkeletonLine' component to clear TS6133 error.

// 3.6 Image Handler with Fallback
// FIXED: Removed unused 'fallbackType' check for 'ImageOff' to clear unused import.
const SmartImage = ({ src, alt, className, fallbackType = 'game' }: { src: string, alt: string, className?: string, fallbackType?: 'game' | 'payment' }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <div className={`bg-[#0f0f12] border border-white/5 flex items-center justify-center flex-col text-gray-700 ${className}`}>
        {fallbackType === 'game' ? <Gamepad2 size={24} /> : <CreditCard size={20} />}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} loading="lazy" />;
};

// ============================================================================
// SECTION 4: FUNCTIONAL SUB-COMPONENTS
// ============================================================================

// 4.1 Global Command Palette (Search)
const CommandPalette = ({ isOpen, onClose, onSelect, searchQuery, setSearchQuery, games }: any) => {
    if (!isOpen) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
            <motion.div 
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} 
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl bg-[#0f0a1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
            >
                <div className="flex items-center gap-4 px-6 py-6 border-b border-white/10">
                    <Search className="text-purple-500" size={24}/>
                    <input 
                        autoFocus 
                        type="text" 
                        placeholder="Search for games or vouchers..." 
                        className="flex-1 bg-transparent outline-none text-white text-lg placeholder:text-gray-600 font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <kbd className="hidden md:block px-2 py-1 bg-white/10 rounded text-[10px] text-gray-400 font-mono">ESC</kbd>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {games.length > 0 ? (
                        games.map((game: any) => (
                            <div key={game.id} onClick={() => onSelect(game.id)} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl cursor-pointer group transition-colors">
                                <SmartImage src={game.logo} className="w-12 h-12 rounded-lg object-cover shadow-lg" alt={game.name} />
                                <div>
                                    <div className="font-bold text-gray-200 group-hover:text-white">{game.name}</div>
                                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">{game.publisher}</div>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="text-purple-500" size={18} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-gray-600">No results found.</div>
                    )}
                </div>
                <div className="px-6 py-3 bg-black/40 text-[10px] text-gray-500 border-t border-white/5 flex justify-between">
                    <span>Use arrow keys to navigate</span>
                    <span>Takapedia Engine v2.5</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

// 4.2 Live Ticker
const LiveTicker = () => (
    <div className="bg-[#050505]/80 backdrop-blur-md border-b border-white/5 h-10 flex items-center relative z-20 overflow-hidden">
        <div className="flex items-center px-4 gap-2 text-[10px] font-black tracking-widest text-green-400 shrink-0 border-r border-white/5 h-full bg-[#0a0a0a]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"/> 
            LIVE FEED
        </div>
        <div className="flex-1 overflow-hidden mask-linear-fade">
            <div className="flex gap-12 animate-marquee whitespace-nowrap text-[10px] text-gray-500 font-mono items-center h-full">
            {[...RECENT_TRANSACTIONS, ...RECENT_TRANSACTIONS].map((trx, i) => (
                <span key={i} className="flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity">
                    <span className="w-1 h-1 bg-purple-500 rounded-full"/>
                    <span className="text-gray-300 font-bold">{trx.user}</span> 
                    <span className="text-gray-600">bought</span> 
                    <span className="text-cyan-400">{trx.item}</span>
                    <span className="text-gray-600">in</span>
                    <span className="text-purple-400 uppercase">{trx.game}</span>
                    <span className="text-gray-700">({trx.time})</span>
                </span>
            ))}
            </div>
        </div>
    </div>
);

// 4.3 Confetti Explosion
const ConfettiExplosion = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-50 flex items-center justify-center">
    {[...Array(50)].map((_, i) => {
      const angle = Math.random() * 360;
      const velocity = 150 + Math.random() * 350;
      const size = Math.random() * 8 + 4;
      const color = ['#a855f7', '#06b6d4', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 4)];
      
      return (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ 
            x: Math.cos(angle * (Math.PI / 180)) * velocity, 
            y: Math.sin(angle * (Math.PI / 180)) * velocity,
            opacity: 0,
            scale: 1
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{ width: size, height: size, backgroundColor: color }}
        />
      );
    })}
  </div>
);

// ============================================================================
// SECTION 5: MAIN APPLICATION CORE
// ============================================================================

export default function App() {
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  
  // Checkout Machine
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('ID_ENTRY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [trxId, setTrxId] = useState('');

  // UI States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Derived Data
  const activeGame = useMemo(() => GAMES.find(g => g.id === selectedGameId), [selectedGameId]);
  
  const filteredGames = useMemo(() => {
    return GAMES.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || game.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // --- HOOKS & EFFECTS ---

  // Toast Handler
  const addToast = useCallback((msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsAuthOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll Reset
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedGameId]);

  // --- HANDLERS ---

  const handleGameSelect = useCallback((id: string) => {
    setSelectedGameId(id);
    setCurrentView('HOME');
    // Reset Form
    setUserId('');
    setZoneId('');
    setSelectedProduct(null);
    setSelectedPayment(null);
    setPromoCode('');
    setCheckoutStep('ID_ENTRY');
    setIsSearchOpen(false);
  }, []);

  const handlePayment = async () => {
    if (!userId || !selectedProduct || !selectedPayment) {
        addToast("Please fill in all fields correctly.", "error");
        return;
    }
    
    setIsProcessing(true);
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsProcessing(false);
    setTrxId(`INV-${Math.floor(Math.random() * 1000000000)}`);
    setCurrentView('SUCCESS');
    addToast("Transaction successful!", "success");
  };

  const handleLogin = () => {
    // Simulate Login
    setUser({
        id: 'user_123',
        name: 'ViperCommander',
        email: 'viper@takapedia.com',
        avatar: '',
        balance: 50000,
        isVip: true
    });
    setIsAuthOpen(false);
    addToast("Welcome back, Commander.", "success");
  };

  // --- RENDER HELPERS ---

  const renderSuccessView = () => (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }} 
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} 
      exit={{ opacity: 0, scale: 1.05 }}
      className="container mx-auto px-4 flex justify-center items-center min-h-[60vh] py-20"
    >
      <div className="relative w-full max-w-md">
        <ConfettiExplosion />
        <SpotlightCard className="w-full !rounded-[2rem] border-purple-500/20 shadow-[0_0_100px_rgba(168,85,247,0.1)]">
          <div className="bg-gradient-to-b from-purple-500/10 to-transparent p-10 text-center border-b border-white/5 relative overflow-hidden">
             {/* Success Icon Animation */}
              <motion.div 
              initial={{scale:0, rotate: -180}} animate={{scale:1, rotate: 0}} transition={{type:"spring", delay: 0.2}}
              className="w-24 h-24 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(168,85,247,0.5)] ring-4 ring-white/10 relative z-10"
              >
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg mb-2">Payment Verified</h2>
              <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">Order dispatched to server</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="text-white font-mono">{trxId}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Account</span>
                    <span className="text-white font-bold">{userId} {zoneId ? `(${zoneId})` : ''}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="text-white uppercase">{PAYMENT_METHODS.find(p => p.id === selectedPayment)?.name}</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Paid</span>
                    <span className="text-2xl font-black text-cyan-400">
                        {selectedProduct?.price}
                    </span>
                </div>
            </div>
            
            <button 
                onClick={() => { setCurrentView('HOME'); setSelectedGameId(null); }} 
                className="w-full bg-white text-black py-4 rounded-xl font-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2"
            >
              <ChevronRight size={16} /> Return to Home
            </button>
          </div>
        </SpotlightCard>
      </div>
    </motion.div>
  );

  const renderCheckoutView = () => {
    if (!activeGame) return null;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 max-w-6xl pb-24 pt-8"
        >
            {/* Breadcrumb / Back */}
            <button onClick={() => setSelectedGameId(null)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white font-bold text-xs uppercase tracking-widest hover:-translate-x-2 transition-transform group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-purple-500 transition-colors">
                    <ChevronRight className="rotate-180" size={14} />
                </div>
                Abort Transaction
            </button>

            {/* Game Header Card */}
            <div className="relative rounded-[2.5rem] border border-white/10 overflow-hidden mb-10 shadow-2xl bg-[#0f0a1e]">
                <div className="absolute inset-0">
                    <img src={activeGame.image} className="w-full h-full object-cover opacity-40 blur-sm" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                </div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-8 text-center md:text-left">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0 bg-black">
                        <SmartImage src={activeGame.logo} alt={activeGame.name} className="w-full h-full object-cover" />
                    </motion.div>
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-2">{activeGame.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-bold text-gray-400">
                            <span className="flex items-center gap-1"><User size={14}/> {activeGame.publisher}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                            <span className="flex items-center gap-1 text-green-400"><Zap size={14}/> Instant Delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN: STEPS */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* STEP 1: ID */}
                    <SpotlightCard className={`p-8 transition-opacity ${checkoutStep === 'ID_ENTRY' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-black border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">1</div>
                            <h3 className="font-black text-xl italic tracking-wider text-white">USER IDENTIFICATION</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">User ID</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={userId} 
                                        onChange={e => setUserId(e.target.value)} 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        placeholder="12345678"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18}/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Zone ID</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={zoneId} 
                                        onChange={e => setZoneId(e.target.value)} 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                                        placeholder="(1234)"
                                    />
                                    <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18}/>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* STEP 2: PRODUCTS */}
                    <SpotlightCard className={`p-8 transition-opacity ${checkoutStep !== 'PRODUCT_SELECT' && selectedProduct ? 'opacity-60 hover:opacity-100' : 'opacity-100'}`}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">2</div>
                            <h3 className="font-black text-xl italic tracking-wider text-white">SELECT PACKAGE</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {activeGame.products?.map((product, idx) => (
                                <motion.button
                                    key={idx}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`relative p-4 rounded-2xl border text-left transition-all duration-300 group overflow-hidden ${selectedProduct?.name === product.name ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    <div className="relative z-10">
                                        <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide group-hover:text-white transition-colors">{product.name}</div>
                                        <div className={`font-black italic text-lg ${selectedProduct?.name === product.name ? 'text-cyan-400' : 'text-white'}`}>{product.price}</div>
                                    </div>
                                    {selectedProduct?.name === product.name && (
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </SpotlightCard>

                    {/* STEP 3: PAYMENT */}
                    <SpotlightCard className="p-8">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-black border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]">3</div>
                            <h3 className="font-black text-xl italic tracking-wider text-white">PAYMENT GATEWAY</h3>
                        </div>
                        <div className="space-y-3">
                            {PAYMENT_METHODS.map(method => (
                                <div 
                                    key={method.id}
                                    onClick={() => !method.maintenance && setSelectedPayment(method.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${method.maintenance ? 'opacity-50 cursor-not-allowed grayscale bg-black/20' : selectedPayment === method.id ? 'bg-pink-500/10 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.1)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-10 bg-white rounded-lg flex items-center justify-center p-2"><SmartImage src={method.icon} alt={method.name} fallbackType='payment' className="max-w-full max-h-full" /></div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{method.name}</div>
                                            {method.maintenance && <div className="text-[10px] text-red-400 font-bold uppercase tracking-wide">Under Maintenance</div>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Service Fee</div>
                                        <div className="font-bold text-pink-400">+{method.fee === 0 ? 'Free' : `Rp ${method.fee.toLocaleString()}`}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SpotlightCard>
                </div>

                {/* RIGHT COLUMN: SUMMARY STICKY */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24">
                        <SpotlightCard className="p-6 bg-[#0a0a0c]/90 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <h3 className="font-black italic text-xl mb-6 tracking-widest text-white flex items-center gap-3 border-b border-white/10 pb-4">
                                <span className="w-1 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"/> 
                                ORDER SUMMARY
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Product</span>
                                    <span className="font-bold text-white text-right w-1/2 truncate">{selectedProduct?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-bold text-white uppercase">{selectedPayment || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Target</span>
                                    <span className="font-mono text-white text-xs bg-white/5 px-2 py-0.5 rounded border border-white/5">{userId || '-'}</span>
                                </div>
                            </div>

                            {/* Promo Input */}
                            <div className="bg-black/40 p-3 rounded-xl border border-white/5 mb-6">
                                <div className="flex gap-2">
                                    <Ticket className="text-gray-500" size={16}/>
                                    <input 
                                        type="text" 
                                        placeholder="PROMO CODE" 
                                        value={promoCode}
                                        onChange={e => setPromoCode(e.target.value)}
                                        className="bg-transparent w-full text-xs font-bold text-white outline-none placeholder:text-gray-700 uppercase"
                                    />
                                    <button className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300">APPLY</button>
                                </div>
                            </div>

                            <div className="border-t border-dashed border-white/10 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total Payable</span>
                                    <div className="text-right">
                                        <div className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">
                                            {selectedProduct ? selectedProduct.price : 'Rp 0'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden group/btn ${isProcessing ? 'bg-white/10 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover/btn:opacity-20 transition-opacity" />
                                {isProcessing ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck size={18} />
                                        <span className="relative z-10 tracking-widest text-sm uppercase">Secure Checkout</span>
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600">
                                <Lock size={10} /> 256-Bit SSL Encrypted
                            </div>
                        </SpotlightCard>
                    </div>
                </div>
            </div>
        </motion.div>
    );
  }

  // --- MAIN RENDER ---

  return (
    <div className="min-h-screen text-white relative bg-[#050505] selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden font-sans">
        {/* Toast Container */}
        <div className="fixed top-24 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map(t => (
                    <Toast key={t.id} message={t.msg} type={t.type} isVisible={true} onClose={() => {}} />
                ))}
            </AnimatePresence>
        </div>

        {/* Global Backgrounds */}
        <NoiseOverlay />
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#130f1e] via-[#050505] to-black" />
            <StarField />
            <MeteorShower />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
        </div>

        <FloatingWidget />
        <LiveTicker />

        <Navbar 
            onOpenAuth={() => setIsAuthOpen(true)} 
            user={user} 
            onLogout={() => { setUser(null); addToast("Logged out successfully.", "info"); }} 
            currentView={currentView} 
            onNavigate={(view) => { setCurrentView(view as any); setSelectedGameId(null); }} 
            onSearch={() => setIsSearchOpen(true)} 
        />

        {/* Main Content Area */}
        <div className="pt-24 pb-12 relative z-10 min-h-screen">
            <AnimatePresence mode="wait">
                {currentView === 'SUCCESS' ? (
                    renderSuccessView()
                ) : selectedGameId ? (
                    renderCheckoutView()
                ) : currentView === 'HOME' ? (
                    <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Hero />
                        <div className="container mx-auto px-4 -mt-16 relative z-10 mb-16">
                            <EventCarousel />
                        </div>
                        
                        <div className="container mx-auto px-4 max-w-7xl pb-24">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] rotate-3">
                                        <Flame size={24} className="text-white fill-white"/>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black italic tracking-tighter text-white leading-none">GAME CATALOGUE</h2>
                                        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mt-1">Select your battlefield</p>
                                    </div>
                                </div>
                                <div className="flex bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/5">
                                    {['ALL', 'MOBILE', 'PC', 'VOUCHER'].map((cat) => (
                                        <button 
                                            key={cat} 
                                            onClick={() => setCategoryFilter(cat as any)}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-bold tracking-widest transition-all ${categoryFilter === cat ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                <AnimatePresence>
                                    {filteredGames.map((game) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }} 
                                            animate={{ opacity: 1, scale: 1 }} 
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={game.id}
                                        >
                                            <SpotlightCard onClick={() => handleGameSelect(game.id)} className="h-full group">
                                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                                    <SmartImage src={game.image} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] via-transparent to-transparent opacity-90" />
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase">Top Up</div>
                                                    </div>
                                                    <div className="absolute bottom-0 w-full p-4 z-20">
                                                        <h3 className="text-lg font-black italic uppercase text-white leading-none mb-1 group-hover:text-cyan-400 transition-colors drop-shadow-md truncate">{game.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-0.5 w-4 bg-cyan-500 rounded-full" />
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{game.publisher}</span>
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
                ) : (
                    // Placeholder for other views (Leaderboard, Calculator, etc.)
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12">
                         {currentView === 'HISTORY' && <TransactionLookup />}
                         {currentView === 'CALCULATOR' && <WinRateCalculator />}
                         {currentView === 'LEADERBOARD' && <Leaderboard />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <Footer />
        <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelect={handleGameSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} games={GAMES} />

        {/* Auth Modal */}
        <AnimatePresence>
            {isAuthOpen && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <SpotlightCard className="p-10 max-w-md w-full text-center border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.05)] relative">
                        <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10">
                            <User size={32} className="text-white"/>
                        </div>
                        <h2 className="text-3xl font-black italic mb-2 text-white tracking-tighter uppercase">Identify Yourself</h2>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed px-4">Login to sync your battle data, track transaction history, and unlock elite VIP pricing.</p>
                        
                        <div className="space-y-3">
                            <button onClick={handleLogin} className="w-full bg-white text-black py-4 rounded-xl font-black hover:bg-cyan-400 hover:scale-[1.02] transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                                <Wallet size={18} /> Connect Wallet
                            </button>
                            <button onClick={handleLogin} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black hover:bg-white/10 transition-colors uppercase tracking-widest">
                                Guest Login
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-8">Secure Access Protocol v2.0</p>
                    </SpotlightCard>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}