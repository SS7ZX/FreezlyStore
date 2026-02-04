import { useState } from 'react';
import { Search, Trophy, Percent, Zap, Target } from 'lucide-react'; // Removed unused ArrowRight
import { motion, AnimatePresence } from 'framer-motion';
export function TransactionLookup() {
  const [invoice, setInvoice] = useState('');
  
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#130d21]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
        <h2 className="text-3xl font-black italic mb-2 text-white">TRACK ORDER</h2>
        <p className="text-gray-400 mb-8">Enter your invoice number to track delivery status real-time.</p>
        
        <div className="relative max-w-md mx-auto group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full opacity-30 group-focus-within:opacity-100 transition duration-500 blur"></div>
          <div className="relative flex">
            <input 
              type="text" 
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="INV-2024XXXX"
              className="w-full bg-[#05020a] text-white border border-white/10 rounded-l-full py-4 pl-6 focus:outline-none placeholder:text-gray-600"
            />
            <button className="bg-white text-black font-bold px-6 rounded-r-full hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Search size={18} /> TRACK
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- 2. WR CALCULATOR (NEON STYLE) ---
export function WinRateCalculator() {
  const [matches, setMatches] = useState<any>('');
  const [wr, setWr] = useState<any>('');
  const [target, setTarget] = useState<any>('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    if (!matches || !wr || !target) return;
    const tMatch = Number(matches);
    const tWr = Number(wr);
    const tTarget = Number(target);
    
    if (tTarget > 100 || tTarget <= tWr) {
      setResult("Invalid Target! (Must be higher than current WR)"); 
      return;
    }

    const totalWin = (tMatch * tWr) / 100;
    const remainMatch = ((tTarget * tMatch) - (100 * totalWin)) / (100 - tTarget);
    setResult(`You need ${Math.ceil(remainMatch)} consecutive wins without losing.`);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-4xl font-black italic mb-4">WIN RATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">CALCULATOR</span></h2>
          <p className="text-gray-400 mb-6">Calculate exactly how many matches you need to reach your dream Win Rate.</p>
          <div className="flex flex-col gap-3">
             <FeatureBadge icon={<Zap size={16} />} text="Instant Calculation" />
             <FeatureBadge icon={<Target size={16} />} text="Accurate Algorithm" />
          </div>
        </div>
        
        <div className="bg-[#130d21]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative">
          <div className="space-y-4">
            <CalcInput label="Total Matches" val={matches} setVal={setMatches} placeholder="e.g. 450" />
            <CalcInput label="Current WR (%)" val={wr} setVal={setWr} placeholder="e.g. 48.5" />
            <CalcInput label="Target WR (%)" val={target} setVal={setTarget} placeholder="e.g. 60.0" />
            
            <button onClick={calculate} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl mt-4 flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]">
              <Percent size={18} /> CALCULATE RESULT
            </button>
          </div>
          
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mt-4">
                <p className="text-green-400 font-bold text-center text-sm">{result}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- 3. LEADERBOARD (NEON GLASS) ---
export function Leaderboard() {
  const topSpenders = [
    { name: "SultanBebas***", total: "Rp 15.400.000", rank: 1 },
    { name: "ProPlayerID***", total: "Rp 12.250.000", rank: 2 },
    { name: "User8812***", total: "Rp 8.900.000", rank: 3 },
    { name: "JessNoL***", total: "Rp 5.500.000", rank: 4 },
    { name: "LemonKu***", total: "Rp 3.100.000", rank: 5 },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <div className="inline-flex p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-[0_0_30px_rgba(250,204,21,0.4)]">
          <Trophy size={32} className="text-black" />
        </div>
        <h2 className="text-3xl font-black italic text-white">TOP SPENDERS</h2>
        <p className="text-gray-400">The Hall of Fame of our Sultan customers.</p>
      </div>

      <div className="bg-[#130d21]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {topSpenders.map((user, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
            key={idx} 
            className={`flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${idx < 3 ? 'bg-gradient-to-r from-purple-500/10 to-transparent' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center font-black italic rounded-lg shadow-lg ${
                  idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black' : 
                  idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : 
                  idx === 2 ? 'bg-gradient-to-br from-orange-400 to-red-800 text-white' : 
                  'bg-[#1A1A20] text-gray-500 border border-white/5'
              }`}>
                #{user.rank}
              </div>
              <span className={`font-bold ${idx < 3 ? 'text-white text-lg' : 'text-gray-400'}`}>{user.name}</span>
            </div>
            <span className="font-mono text-cyan-400 font-bold">{user.total}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helpers
function CalcInput({ label, val, setVal, placeholder }: any) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-400 ml-2 mb-1 block uppercase tracking-wider">{label}</label>
            <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full bg-[#0a0514] p-4 rounded-xl border border-white/10 focus:border-purple-500 outline-none text-white transition-all focus:shadow-[0_0_15px_rgba(168,85,247,0.3)]" placeholder={placeholder} />
        </div>
    )
}

function FeatureBadge({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300">
            <div className="text-purple-400">{icon}</div> {text}
        </div>
    )
}