import { motion } from 'framer-motion';
import { X, Mail, Lock, User, Github } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView: 'LOGIN' | 'REGISTER';
  onLoginSuccess: (user: { name: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, initialView, onLoginSuccess }: AuthModalProps) {
  const [view, setView] = useState(initialView);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock Login
      onLoginSuccess({
          name: name || "Gamer123",
          email: email || "gamer@example.com"
      });
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm bg-[#130d21] border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-white"><X size={20} /></button>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-black italic text-white mb-2">{view === 'LOGIN' ? 'WELCOME BACK' : 'JOIN THE SQUAD'}</h2>
            <p className="text-gray-400 text-sm">Enter your details to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'REGISTER' && (
                <div className="relative">
                    <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    <input type="text" placeholder="Username" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#05020a] border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-purple-500 outline-none" />
                </div>
            )}
            <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-[#05020a] border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-purple-500 outline-none" />
            </div>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input type="password" placeholder="Password" className="w-full bg-[#05020a] border border-white/10 rounded-xl py-3 pl-12 text-white focus:border-purple-500 outline-none" />
            </div>

            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg hover:scale-[1.02] transition-transform">
                {view === 'LOGIN' ? 'LOG IN' : 'CREATE ACCOUNT'}
            </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 mb-4">Or continue with</p>
            <div className="flex gap-3 justify-center">
                <SocialButton icon={<Github size={18} />} />
                <SocialButton icon={<span className="font-bold text-lg">G</span>} />
            </div>
            <p className="text-xs text-gray-400 mt-6">
                {view === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="text-purple-400 font-bold hover:underline">
                    {view === 'LOGIN' ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
      </motion.div>
    </div>
  );
}

function SocialButton({ icon }: any) {
    return (
        <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            {icon}
        </button>
    )
}