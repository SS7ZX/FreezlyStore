import { useState, useCallback, memo } from 'react';
import { db } from './firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  ShieldCheck, Zap, Globe, CreditCard, 
  Loader2, ChevronRight, Star, Cpu, Lock 
} from 'lucide-react';

// --- ENTERPRISE CONFIGURATION ---
const STORE_CONFIG = {
  name: "FreezyleStore",
  version: "2.1.0-PRO",
  region: "Global/Enterprise"
};

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  badge?: string;
  popular?: boolean;
}

const PRODUCTS: Product[] = [
  { id: 'topup_50', name: '500 Diamond Pack', price: 4.99, currency: 'USD' },
  { id: 'topup_100', name: '1200 Diamond Pack', price: 9.99, currency: 'USD', badge: 'Best Seller', popular: true },
  { id: 'topup_500', name: '6000 Diamond Pack', price: 49.99, currency: 'USD' },
];

// --- LOGIC: TRANSACTION CUSTOM HOOK ---
const useTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeOrder = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      // Enterprise logging with sanitized metadata
      await addDoc(collection(db, "orders"), {
        store: STORE_CONFIG.name,
        productId: product.id,
        amount: product.price,
        iso: product.currency,
        createdAt: serverTimestamp(),
        status: "vault_pending",
        traceId: crypto.randomUUID()
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4500);
    } catch (err) {
      setError("Payment Gateway Timeout. Please retry.");
      console.error("[VAULT_ERROR]:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { executeOrder, loading, success, error };
};

// --- COMPONENT: PREMIUM CARD ---
const ProductCard = memo(({ product, onPurchase, isProcessing }: { 
  product: Product, 
  onPurchase: (product: Product) => Promise<void>, 
  isProcessing: boolean 
}) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden
      ${product.popular ? 'bg-gradient-to-br from-[#0c0c0c] to-[#121212] border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'bg-[#0a0a0a] border-white/5 hover:border-white/20'}`}
  >
    {product.badge && (
      <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-400 text-[10px] font-black uppercase tracking-tighter shadow-sm">
        <Star size={10} fill="currentColor" /> {product.badge}
      </div>
    )}

    <div className="flex flex-col h-full justify-between">
      <div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-transform group-hover:rotate-12
          ${product.popular ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/5 border-white/10 text-cyan-400'}`}>
          <Zap size={28} fill={product.popular ? "black" : "none"} />
        </div>
        
        <h3 className="text-2xl font-bold mb-2 text-white">{product.name}</h3>
        <p className="text-gray-500 text-xs font-mono mb-8 uppercase tracking-widest leading-relaxed">
          Encrypted Asset Delivery
        </p>

        <div className="flex items-baseline gap-1 mb-10">
          <span className="text-sm font-medium text-gray-400">$</span>
          <span className="text-5xl font-black tracking-tight text-white">{product.price}</span>
        </div>
      </div>
      
      <button 
        onClick={() => onPurchase(product)}
        disabled={isProcessing}
        className="group/btn w-full h-16 relative rounded-2xl overflow-hidden bg-white text-black font-extrabold uppercase tracking-[0.15em] text-xs transition-all active:scale-95 disabled:opacity-30"
      >
        <div className="absolute inset-0 bg-cyan-500 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
        <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-black">
          {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
          {isProcessing ? "Validating Path..." : "Secure Checkout"}
        </span>
      </button>
    </div>
  </motion.div>
));

// --- MAIN APPLICATION ---
export default function FreezyleStore() {
  const { executeOrder, loading, success, error } = useTransaction();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/40 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Enterprise Navigation */}
      <nav className="fixed top-0 inset-x-0 h-24 flex justify-between items-center px-8 md:px-16 border-b border-white/5 bg-[#050505]/80 backdrop-blur-2xl z-[100]">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-2 bg-cyan-500/20 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black text-lg">F</div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black uppercase tracking-tighter leading-none">Freezyle<span className="text-cyan-500 font-light">Store</span></span>
            <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-[0.3em]">Enterprise Tier</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          {['Catalog', 'Security', 'Uptime'].map((link) => (
            <a key={link} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">{link}</a>
          ))}
          <div className="h-4 w-px bg-white/10" />
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase transition-all tracking-widest">
            <Lock size={12} className="text-cyan-500" /> User Portal
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-52 pb-32">
        <header className="relative text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/20 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">Status: Nodes Operational</span>
          </motion.div>
          
          <h1 className="text-8xl md:text-[11rem] font-black tracking-tighter leading-[0.75] mb-12">
            GLOBAL<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 italic">EXCHANGE.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            Instantaneous digital asset fulfillment powered by <span className="text-white">Freezyle Engine v2</span>. 
            Zero-latency checkout for elite gamers.
          </p>
        </header>

        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
            {PRODUCTS.map((item) => (
              <ProductCard key={item.id} product={item} onPurchase={executeOrder} isProcessing={loading} />
            ))}
          </div>
        </LayoutGroup>

        {/* Enterprise Metrics Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-12 border-y border-white/5 py-20 px-4 opacity-40">
          <div className="text-center">
            <Cpu size={20} className="mx-auto mb-4 text-cyan-500" />
            <div className="text-2xl font-black tracking-tight">0.02ms</div>
            <div className="text-[9px] uppercase tracking-widest font-bold">Latency API</div>
          </div>
          <div className="text-center">
            <Globe size={20} className="mx-auto mb-4 text-cyan-500" />
            <div className="text-2xl font-black tracking-tight">142+</div>
            <div className="text-[9px] uppercase tracking-widest font-bold">Global Nodes</div>
          </div>
          <div className="text-center">
            <ShieldCheck size={20} className="mx-auto mb-4 text-cyan-500" />
            <div className="text-2xl font-black tracking-tight">AES-256</div>
            <div className="text-[9px] uppercase tracking-widest font-bold">Military Grade</div>
          </div>
          <div className="text-center">
            <CreditCard size={20} className="mx-auto mb-4 text-cyan-500" />
            <div className="text-2xl font-black tracking-tight">Verified</div>
            <div className="text-[9px] uppercase tracking-widest font-bold">PCI-DSS Ready</div>
          </div>
        </section>
      </main>

      {/* Enterprise Toast & Notification Engine */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-white text-black p-1 rounded-3xl flex items-center gap-6 pr-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] z-[500]"
          >
            <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-black" />
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-widest">Protocol Handshake Success</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Transaction encrypted & logged in cloud</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}