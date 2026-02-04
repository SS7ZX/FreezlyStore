import { Search, Globe, LogOut, User, Gamepad2, Trophy, Calculator, FileText, CreditCard, ChevronDown, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// Props Interface tetap sama...
interface NavbarProps {
  onOpenAuth: (view: 'LOGIN' | 'REGISTER') => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
}

export default function Navbar({ onOpenAuth, user, onLogout, currentView, onNavigate, onSearch }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="bg-[#0a0514]/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-6 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(139,92,246,0.1)]">
        
        {/* LOGO with Neon Effect */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          onClick={() => onNavigate('HOME')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
            <img src="https://cdn-icons-png.flaticon.com/512/3408/3408506.png" alt="Logo" className="w-8 md:w-10 h-8 md:h-10 relative z-10" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white italic">
            FREEZLY<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">STORE</span>
          </span>
        </motion.div>

        {/* Search Bar - Modern Glow */}
        <div className="hidden md:flex flex-1 max-w-xl mx-12 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full opacity-30 group-focus-within:opacity-100 transition duration-500 blur"></div>
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search games, vouchers..." 
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-[#130d21] text-gray-200 pl-12 pr-4 py-2.5 rounded-full border border-white/5 focus:outline-none placeholder:text-gray-500 text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-400 transition-colors" />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {user ? (
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 bg-[#1A1A20] hover:bg-[#25252d] border border-white/10 hover:border-purple-500/50 pl-2 pr-4 py-1.5 rounded-full transition-all shadow-lg shadow-purple-900/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Member</p>
                  <p className="text-xs font-bold text-white leading-none truncate max-w-[80px]">{user.name.split(' ')[0]}</p>
                </div>
              </motion.button>
              
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-60 bg-[#130d21]/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden py-2 z-50"
                  >
                    <div className="px-5 py-3 border-b border-white/5 bg-purple-500/5">
                        <p className="text-purple-300 font-bold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                        <MenuItem icon={<User size={16} />} label="My Profile" />
                        <MenuItem icon={<FileText size={16} />} label="History" onClick={() => { onNavigate('HISTORY'); setIsProfileOpen(false); }} />
                        <MenuItem icon={<Settings size={16} />} label="Settings" />
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-colors font-bold mt-2">
                           <LogOut size={16} /> Logout
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => onOpenAuth('LOGIN')} className="text-white text-sm font-bold px-3 py-2 hover:text-purple-400 transition-colors">Login</button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => onOpenAuth('REGISTER')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold px-5 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-white/10 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all"
              >
                Sign Up
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* NAV LINKS (Glowing Active State) */}
      <div className="bg-[#05020a]/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-8 py-3 overflow-x-auto no-scrollbar">
            <NavItem icon={<Gamepad2 size={18} />} label="Top Up" active={currentView === 'HOME'} onClick={() => onNavigate('HOME')} />
            <NavItem icon={<CreditCard size={18} />} label="Check Order" active={currentView === 'HISTORY'} onClick={() => onNavigate('HISTORY')} />
            <NavItem icon={<Trophy size={18} />} label="Leaderboard" active={currentView === 'LEADERBOARD'} onClick={() => onNavigate('LEADERBOARD')} />
            <NavItem icon={<Calculator size={18} />} label="WR Calc" active={currentView === 'CALCULATOR'} onClick={() => onNavigate('CALCULATOR')} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} className={`relative flex items-center gap-2 cursor-pointer pb-2 transition-all duration-300 group`}>
      <span className={`transition-colors ${active ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`}>{icon}</span>
      <span className={`font-bold text-xs md:text-sm uppercase tracking-wider ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
      {active && (
        <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg flex items-center gap-3 transition-colors font-medium">
      {icon} {label}
    </button>
  );
}