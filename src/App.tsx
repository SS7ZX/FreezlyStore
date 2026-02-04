import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventCarousel from './components/EventCarousel';
import InvoiceModal from './components/InvoiceModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer'; 
import FloatingWidget from './components/FloatingWidget'; 
import Toast from './components/Toast'; 
import BackgroundWrapper from './components/BackgroundWrapper';
import { WinRateCalculator, Leaderboard, TransactionLookup } from './components/Features';
import { GAMES, type Game, type Product } from './data/games'; 
import { motion, AnimatePresence, type Variants } from 'framer-motion';

import { CheckCircle2, Search, User, CreditCard, ShieldCheck, Zap, Smartphone, Monitor, Gamepad2 } from 'lucide-react';
const PAYMENTS = [
  { id: 'qris', name: 'QRIS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qris.svg/1200px-Qris.svg.png' },
  { id: 'gopay', name: 'GoPay', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
  { id: 'dana', name: 'DANA', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Logo_dana_blue.svg/2560px-Logo_dana_blue.svg.png' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

function App() {
  const [currentView, setCurrentView] = useState<'HOME' | 'HISTORY' | 'LEADERBOARD' | 'CALCULATOR' | 'SUCCESS'>('HOME');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'MOBILE' | 'PC'>('ALL'); // NEW FILTER
  
  const [userId, setUserId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error'; visible: boolean }>({ msg: '', type: 'success', visible: false });

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type, visible: true }); };
  
  // Filter Logic
  const filteredGames = GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || game.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeGame = GAMES.find(g => g.id === selectedGameId);

  const handleGameSelect = (id: string) => { 
    setSelectedGameId(id); 
    setCurrentView('HOME'); 
    setUserId(''); 
    setZoneId(''); 
    setSelectedProduct(null); 
    setSelectedPayment(null); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  
  const handleCheckout = () => { 
      if(!userId || !selectedProduct || !selectedPayment) { 
        showToast("Please complete all fields!", 'error'); 
        return; 
      } 
  };

  const handlePaymentConfirm = () => { 
      setCurrentView('SUCCESS'); 
      window.scrollTo(0,0); 
      showToast("Payment Confirmed!", 'success'); 
  };
  
  const handleLoginSuccess = (u: any) => { setUser(u); showToast(`Welcome back, ${u.name}!`, 'success'); };

  return (
    <BackgroundWrapper>
      <div className="min-h-screen font-sans text-white flex flex-col justify-between selection:bg-purple-500 selection:text-white">
        <Toast message={toast.msg} type={toast.type} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
        <FloatingWidget />

        {currentView === 'SUCCESS' ? (
          <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center z-10 bg-[#0a0514]/80 backdrop-blur-xl p-12 rounded-[2rem] border border-green-500/30 shadow-[0_0_100px_rgba(34,197,94,0.3)]">
              <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.6)] animate-bounce">
                <CheckCircle2 size={48} className="text-black" />
              </div>
              <h1 className="text-5xl font-black italic mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">SUCCESS!</h1>
              <p className="text-gray-300 mb-8 text-lg">Transaction ID: <span className="font-mono text-green-400">TRX-{Math.floor(Math.random()*100000)}</span><br/>Items sent to: <b className="text-white">{userId}</b></p>
              <button onClick={() => { setCurrentView('HOME'); setSelectedGameId(null); }} className="bg-white text-black px-10 py-4 rounded-full font-black tracking-wide hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.4)]">TOP UP AGAIN</button>
            </motion.div>
          </div>
        ) : (
          <>
            <Navbar 
              onOpenAuth={(view) => { setAuthView(view); setIsAuthOpen(true); }} user={user} onLogout={() => { setUser(null); showToast("Logged out.", 'success'); }} currentView={currentView} onNavigate={(view) => { setCurrentView(view as any); setSelectedGameId(null); }} onSearch={setSearchQuery} 
            />
            
            <div className="flex-grow">
              {/* HERO & CAROUSEL */}
              {currentView === 'HOME' && !selectedGameId && (
                <>
                  <Hero />
                  <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10 mb-12">
                    <EventCarousel /> 
                  </div>
                </>
              )}

              <div className="container mx-auto px-4 md:px-6 pb-20 min-h-[600px]">
                <AnimatePresence mode="wait">
                  
                  {/* --- GAME GRID --- */}
                  {currentView === 'HOME' && !selectedGameId && (
                    <motion.div key="home" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}>
                      
                      {/* FILTER BAR */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                         <div className="flex items-center gap-3">
                             <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                             <h2 className="text-3xl font-black italic tracking-tight">POPULAR GAMES</h2>
                         </div>
                         
                         <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                           {['ALL', 'MOBILE', 'PC'].map((cat) => (
                             <button 
                                key={cat}
                                onClick={() => setCategoryFilter(cat as any)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${categoryFilter === cat ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                             >
                               {cat === 'ALL' ? <Gamepad2 size={16} /> : cat === 'MOBILE' ? <Smartphone size={16}/> : <Monitor size={16} />}
                               <span className="ml-2 hidden md:inline">{cat}</span>
                             </button>
                           ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                          {filteredGames.map((game) => (
                            <motion.div 
                              key={game.id} 
                              variants={itemVariants}
                              whileHover={{ y: -10, scale: 1.02 }}
                              onClick={() => handleGameSelect(game.id)}
                              className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer border border-white/10 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                            >
                              <img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0514] via-[#0a0514]/20 to-transparent" />
                              
                              {/* Floating Logo */}
                              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md p-1 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <img src={game.logo} className="w-full h-full object-contain" />
                              </div>

                              <div className="absolute bottom-0 w-full p-5">
                                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                  <h3 className="text-xl md:text-2xl font-black italic uppercase leading-none mb-1 text-white drop-shadow-md">{game.name}</h3>
                                  <p className="text-xs text-purple-300 font-bold tracking-wider uppercase">{game.publisher}</p>
                                </div>
                                <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                                   <div className="pt-3 flex items-center gap-2 text-xs text-green-400 font-bold">
                                     <Zap size={12} fill="currentColor" /> INSTANT DELIVERY
                                   </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* --- DETAIL GAME VIEW --- */}
                  {currentView === 'HOME' && selectedGameId && activeGame && (
                    <motion.div key="detail" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="max-w-6xl mx-auto">
                      
                      {/* Header Detail */}
                      <div className="relative rounded-[3rem] overflow-hidden mb-10 border border-white/10 shadow-2xl">
                        {/* Background Banner */}
                        <div className="absolute inset-0">
                           <img src={activeGame.image} className="w-full h-full object-cover blur-sm opacity-50" />
                           <div className="absolute inset-0 bg-gradient-to-r from-[#0a0514] via-[#0a0514]/90 to-transparent" />
                        </div>

                        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-end">
                          <img src={activeGame.logo} alt={activeGame.name} className="w-32 h-32 md:w-40 md:h-40 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] object-cover bg-black/50 p-2 border border-white/10" />
                          <div className="flex-1 text-center md:text-left">
                            <button onClick={() => setSelectedGameId(null)} className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-bold mb-4 transition-colors">
                              <Search className="rotate-90" size={16} /> Back to Games
                            </button>
                            <h1 className="text-4xl md:text-7xl font-black italic uppercase text-white mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{activeGame.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-gray-300">
                               <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2"><ShieldCheck size={14} className="text-green-400"/> Official Distributor</span>
                               <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2"><Zap size={14} className="text-yellow-400"/> Instant 24/7</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* LEFT COLUMN: INPUTS & PAYMENT */}
                        <div className="lg:col-span-2 space-y-8">
                          
                          {/* SECTION 1: USER ID */}
                          <div className="bg-[#130d21]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-600" />
                             <h3 className="text-xl font-black italic flex items-center gap-3 mb-6"><span className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm shadow-[0_0_15px_rgba(168,85,247,0.5)]">1</span> ACCOUNT DATA</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="relative">
                                 <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                 <input type="text" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-[#05020a] border border-white/10 rounded-2xl py-4 pl-12 text-white focus:border-purple-500 focus:bg-[#0a0514] outline-none transition-all" />
                               </div>
                               <div className="relative">
                                 <Zap className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                                 <input type="text" placeholder="Zone ID (Optional)" value={zoneId} onChange={e => setZoneId(e.target.value)} className="w-full bg-[#05020a] border border-white/10 rounded-2xl py-4 pl-12 text-white focus:border-purple-500 focus:bg-[#0a0514] outline-none transition-all" />
                               </div>
                             </div>
                          </div>

                          {/* SECTION 2: ITEMS */}
                          <div className="bg-[#130d21]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-blue-600" />
                             <h3 className="text-xl font-black italic flex items-center gap-3 mb-6"><span className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">2</span> SELECT ITEM</h3>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {activeGame.products.map((p, idx) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => setSelectedProduct(p)}
                                    className={`cursor-pointer p-4 rounded-2xl border transition-all relative overflow-hidden group ${selectedProduct?.name === p.name ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-[#05020a] border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                                  >
                                    <h4 className="font-bold text-sm text-gray-300 group-hover:text-white transition-colors">{p.name}</h4>
                                    <p className={`font-black italic mt-2 text-lg ${selectedProduct?.name === p.name ? 'text-cyan-400' : 'text-white'}`}>{p.price}</p>
                                    {selectedProduct?.name === p.name && <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />}
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* SECTION 3: PAYMENTS */}
                          <div className="bg-[#130d21]/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-pink-500 to-rose-600" />
                             <h3 className="text-xl font-black italic flex items-center gap-3 mb-6"><span className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm shadow-[0_0_15px_rgba(236,72,153,0.5)]">3</span> PAYMENT</h3>
                             <div className="space-y-3">
                                {PAYMENTS.map((pay) => (
                                  <div 
                                    key={pay.id} 
                                    onClick={() => setSelectedPayment(pay.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${selectedPayment === pay.id ? 'bg-pink-500/10 border-pink-500 shadow-[inset_0_0_20px_rgba(236,72,153,0.1)]' : 'bg-[#05020a] border-white/5 hover:bg-white/5'}`}
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="bg-white p-1 rounded-lg w-12 h-8 flex items-center justify-center">
                                         <img src={pay.icon} alt={pay.name} className="h-full w-auto object-contain" />
                                      </div>
                                      <span className="font-bold">{pay.name}</span>
                                    </div>
                                    {selectedProduct && selectedPayment === pay.id && (
                                      <div className="text-right">
                                          <p className="text-xs text-gray-400 line-through">{selectedProduct.price}</p>
                                          <span className="font-black text-pink-400 text-lg">{selectedProduct.price}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                             </div>
                          </div>

                        </div>

                        {/* RIGHT COLUMN: SUMMARY (STICKY) */}
                        <div className="lg:col-span-1">
                          <div className="sticky top-28 bg-[#130d21] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
                             {/* Decoration */}
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                             
                             <h3 className="text-xl font-black italic mb-6 relative z-10">ORDER DETAILS</h3>
                             <div className="space-y-4 text-sm mb-8 border-b border-white/10 pb-8 relative z-10">
                               <div className="flex justify-between text-gray-400"><span>User ID</span><span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{userId || '-'}</span></div>
                               <div className="flex justify-between text-gray-400"><span>Product</span><span className="text-white text-right w-1/2">{selectedProduct?.name || '-'}</span></div>
                               <div className="flex justify-between text-gray-400"><span>Payment</span><span className="text-white capitalize flex items-center gap-1">{selectedPayment ? <div className="w-2 h-2 bg-green-500 rounded-full"/> : ''}{selectedPayment || '-'}</span></div>
                             </div>
                             <div className="flex justify-between items-end mb-8 relative z-10">
                               <span className="font-bold text-gray-400 mb-1">Total Pay</span>
                               <span className="text-3xl font-black italic text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">{selectedProduct?.price || 'Rp 0'}</span>
                             </div>
                             <button 
                               onClick={handleCheckout}
                               disabled={!userId || !selectedProduct || !selectedPayment}
                               className={`w-full py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all relative z-10 ${(!userId || !selectedProduct || !selectedPayment) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-white to-gray-200 text-black hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}
                             >
                               <CreditCard size={20} /> PAY NOW
                             </button>
                             <p className="text-center text-[10px] text-gray-500 mt-4 relative z-10">
                               <ShieldCheck size={10} className="inline mr-1" /> Secure 256-bit SSL Encryption
                             </p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {currentView === 'HISTORY' && <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><TransactionLookup /></motion.div>}
                  {currentView === 'CALCULATOR' && <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><WinRateCalculator /></motion.div>}
                  {currentView === 'LEADERBOARD' && <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Leaderboard /></motion.div>}

                </AnimatePresence>
              </div>
            </div>

            <Footer />
            
            <InvoiceModal 
              isOpen={!!(userId && selectedProduct && selectedPayment && currentView === 'HOME' && selectedGameId)} 
              onClose={() => setSelectedPayment(null)} 
              onConfirm={handlePaymentConfirm} 
              productName={selectedProduct?.name || ''} 
              price={selectedProduct?.price || ''} 
            />
            
            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} onLoginSuccess={handleLoginSuccess} />
          </>
        )}
      </div>
    </BackgroundWrapper>
  );
}

export default App;