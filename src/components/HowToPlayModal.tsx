import React from 'react';
import { X, Star, ShieldCheck } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_0_50px_rgba(0,243,255,0.2)] max-h-[90vh] overflow-y-auto font-mono">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            HOW TO PLAY LOGIC LINK
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-6">COMMERCIAL RULEBOOK & SCORING BENCHMARK</p>

        <div className="flex flex-col gap-6 text-sm text-slate-300">
          {/* Section 1: Categories */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              1. 6 REASONING & TRIVIA CATEGORIES
            </span>
            <ul className="text-xs text-slate-400 flex flex-col gap-1.5 list-disc list-inside">
              <li><strong className="text-slate-200">Visual Shape Analogies:</strong> Match shape transformations ($A : B :: C : ?$).</li>
              <li><strong className="text-slate-200">Code & Cipher Decoding:</strong> Decipher alphabet shifts ($+1, +2, +3$).</li>
              <li><strong className="text-slate-200">Venn Diagram Set Logic:</strong> Identify set relationships between 3 concepts.</li>
              <li><strong className="text-slate-200">Number & Pattern Series:</strong> Calculate progression difference rules.</li>
              <li><strong className="text-slate-200">World Geography & Maps:</strong> Identify SVG country map silhouettes and capitals.</li>
              <li><strong className="text-slate-200">Sports & Global Culture:</strong> Test official rules and historic milestones.</li>
            </ul>
          </div>

          {/* Section 2: Star Rating System */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              2. STAR RATING & SPEED SYSTEM
            </span>
            <div className="flex items-center justify-around py-2">
              <div className="flex flex-col items-center">
                <div className="flex text-amber-400"><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /></div>
                <span className="text-[10px] text-slate-400 mt-1">3 STARS: Solve ≤ 15s</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex text-amber-400"><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-slate-800" /></div>
                <span className="text-[10px] text-slate-400 mt-1">2 STARS: Solve ≤ 30s</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex text-amber-400"><Star className="w-4 h-4 fill-amber-400" /><Star className="w-4 h-4 fill-slate-800" /><Star className="w-4 h-4 fill-slate-800" /></div>
                <span className="text-[10px] text-slate-400 mt-1">1 STAR: Correct Answer</span>
              </div>
            </div>
          </div>

          {/* Section 3: Profile Sessions */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              3. USER SESSIONS & LEADERBOARD
            </span>
            <p className="text-xs text-slate-400">
              Create custom User Profiles to isolate your stage progress, stars, and best times. Compare your rank against all players on the Global Hall of Fame!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-extrabold text-white text-sm shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-102 transition-all"
        >
          GOT IT! START PLAYING
        </button>
      </div>
    </div>
  );
};
