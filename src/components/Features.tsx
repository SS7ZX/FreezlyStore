import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Trophy, Search, Loader2 } from 'lucide-react';

// --- 1. TRANSACTION LOOKUP ---
export function TransactionLookup() {
  const [trxId, setTrxId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!trxId) return;
    setLoading(true);
    setResult(null);
    // Fake API call
    setTimeout(() => {
      setLoading(false);
      setResult({
        id: trxId,
        status: 'SUCCESS',
        item: '86 Diamonds',
        game: 'Mobile Legends',
        date: '2024-03-20 14:30'
      });
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto py-12">
       <div className="glass-card p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
             <Search size={100} />
          </div>
          <h2 className="text-2xl font-black italic mb-6">TRACK ORDER</h2>
          <div className="flex gap-2 mb-6">
             <input 
               type="text" 
               placeholder="Enter Transaction ID (e.g. INV-123...)" 
               value={trxId}
               onChange={(e) => setTrxId(e.target.value)}
               className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
             />
             <button onClick={handleSearch} disabled={loading} className="bg-white text-black px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                {loading ? <Loader2 className="animate-spin" /> : 'Check'}
             </button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
                 <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-green-400">Transaction Found</span>
                    <span className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">PAID</span>
                 </div>
                 <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex justify-between"><span>Item</span><span className="text-white">{result.item}</span></div>
                    <div className="flex justify-between"><span>Game</span><span className="text-white">{result.game}</span></div>
                    <div className="flex justify-between"><span>Date</span><span className="text-white">{result.date}</span></div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
}

// --- 2. WIN RATE CALCULATOR ---
const CalcInput = ({ label, val, setVal, placeholder }: any) => (
  <div>
    <label className="block text-xs text-gray-500 font-bold uppercase mb-1">{label}</label>
    <input 
      type="number" 
      value={val} 
      onChange={(e) => setVal(Number(e.target.value))} 
      className="w-full bg-black/40 border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-500 font-mono text-cyan-400"
      placeholder={placeholder}
    />
  </div>
);

export function WinRateCalculator() {
  const [matches, setMatches] = useState<any>('');
  const [wr, setWr] = useState<any>('');
  const [target, setTarget] = useState<any>('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
     if(!matches || !wr || !target) return;
     const tMatch = matches;
     const tWr = wr;
     const tTarget = target;
     
     if (tTarget > 100 || tWr > 100) { setResult("Impossible! Max 100%"); return; }

     // Formula: (TotalMatches * CurrentWR/100 + x) / (TotalMatches + x) = TargetWR/100
     const currentWins = tMatch * (tWr / 100);
     const needed = Math.ceil((tTarget * tMatch - 100 * currentWins) / (100 - tTarget));
     
     if (needed < 0) {
       setResult(`You are already above ${tTarget}%! You can lose ${Math.abs(needed)} matches.`);
     } else {
       setResult(`You need to win ${needed} matches in a row (without losing).`);
     }
  };

  return (
    <div className="max-w-xl mx-auto py-12">
       <div className="glass-card p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10"><Calculator size={100}/></div>
          <h2 className="text-2xl font-black italic mb-6">WIN RATE CALCULATOR</h2>
          
          <div className="space-y-4 mb-6">
             <CalcInput label="Total Matches" val={matches} setVal={setMatches} placeholder="e.g. 500" />
             <CalcInput label="Current WR (%)" val={wr} setVal={setWr} placeholder="e.g. 48.5" />
             <CalcInput label="Target WR (%)" val={target} setVal={setTarget} placeholder="e.g. 50" />
             
             <button onClick={calculate} className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-black shadow-lg hover:scale-[1.02] transition-transform">
                CALCULATE RESULT
             </button>
          </div>

          <AnimatePresence>
            {result && (
               <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <p className="text-cyan-400 font-bold">{result}</p>
               </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
}

// --- 3. LEADERBOARD ---
export function Leaderboard() {
  const topSpenders = [
    { name: "SultanBebas***", total: "Rp 15.400.000", rank: 1 },
    { name: "ProPlayerID***", total: "Rp 12.250.000", rank: 2 },
    { name: "GeminiUser***", total: "Rp 9.800.000", rank: 3 },
    { name: "MysticGlory", total: "Rp 5.200.000", rank: 4 },
    { name: "EpicComeback", total: "Rp 2.100.000", rank: 5 },
  ];

  return (
    <div className="max-w-xl mx-auto py-12">
       <div className="glass-card p-8 rounded-[2rem] border border-white/10 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-3 opacity-10"><Trophy size={100}/></div>
         <h2 className="text-2xl font-black italic mb-6">TOP SPENDERS</h2>
         
         <div className="space-y-3">
            {topSpenders.map((user, i) => (
               <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${i < 3 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex items-center gap-4">
                     <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${i===0?'bg-yellow-400 text-black': i===1?'bg-gray-300 text-black': i===2?'bg-orange-700 text-white':'bg-white/10 text-gray-500'}`}>
                        {user.rank}
                     </div>
                     <span className={`font-bold ${i < 3 ? 'text-white' : 'text-gray-400'}`}>{user.name}</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">{user.total}</span>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
}