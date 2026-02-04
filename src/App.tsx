import React, { useState } from 'react';
import { db } from './firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Globe, ShoppingCart } from 'lucide-react';

// --- ENTERPRISE TYPES ---
interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
}

const PRODUCTS: Product[] = [
  { id: 'topup_50', name: '500 Diamond Pack', price: 4.99, currency: 'USD' },
  { id: 'topup_100', name: '1200 Diamond Pack', price: 9.99, currency: 'USD' },
  { id: 'topup_500', name: '6000 Diamond Pack', price: 49.99, currency: 'USD' },
];

// --- MAIN COMPONENT ---
export default function FreezyleStore() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const processTransaction = async (product: Product) => {
    setLoading(true);
    try {
      // Logic for Enterprise Database Logging
      await addDoc(collection(db, "orders"), {
        storeName: "FreezyleStore",
        productId: product.id,
        amount: product.price,
        timestamp: serverTimestamp(),
        status: "initiated"
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Critical System Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter text-cyan-400">
          FREEZYLE<span className="text-white">STORE</span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Games</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
          <button className="bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase">Verified Global Provider</span>
          <h1 className="text-6xl md:text-8xl font-bold mt-4 mb-6">Level Up Fast.</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Instant fulfillment and enterprise-grade security for your gaming top-ups. 
            Trusted by players across <span className="text-white font-semibold">FreezyleStore</span> ecosystem.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((item) => (
            <motion.div 
              whileHover={{ scale: 1.02 }}
              key={item.id}
              className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-cyan-500/50 transition-all group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Zap className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <div className="text-4xl font-black mb-6">${item.price}</div>
              <button 
                onClick={() => processTransaction(item)}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-black py-4 rounded-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {loading ? "Establishing Connection..." : <><ShoppingCart size={16}/> Instant Buy</>}
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-10 right-10 bg-cyan-500 p-4 rounded-lg flex items-center gap-3 text-black font-bold shadow-2xl"
          >
            <ShieldCheck /> Order Logged in FreezyleStore Database!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}