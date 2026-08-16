import React from 'react';
import type { LevelProgress } from '../types/game';
import { Star, Lock, Flame, ShieldCheck } from 'lucide-react';

interface LevelSelectProps {
  levels: LevelProgress[];
  onSelectLevel: (levelNumber: number) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ levels, onSelectLevel }) => {
  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Header Banner */}
      <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl mb-8 text-center flex flex-col items-center shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
          <ShieldCheck className="w-4 h-4" /> 32-STAGE CAMPAIGN • REASONING, MAPS & TRIVIA
        </div>

        <h2 className="text-4xl font-black font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-2">
          SELECT STAGE LEVEL
        </h2>
        <p className="max-w-xl text-xs font-mono text-slate-400 leading-relaxed">
          Master 32 stages across Visual Analogies, Code Ciphers, Venn Logic, Number Series, SVG Country Maps, and Sports Trivia.
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="w-full flex flex-col gap-8">
        {[
          { title: 'TIER 1: ROOKIE WARM-UP (BEGINNER 1–8)', range: [1, 8], color: 'text-cyan-400', border: 'border-cyan-500/40' },
          { title: 'TIER 2: APTITUDE STANDARD (INTERMEDIATE 9–16)', range: [9, 16], color: 'text-purple-400', border: 'border-purple-500/40' },
          { title: 'TIER 3: GEO MAPS & SPORTS (EXPERT 17–24)', range: [17, 24], color: 'text-pink-400', border: 'border-pink-500/40' },
          { title: 'TIER 4: MASTER BENCHMARK (GENIUS 25–32)', range: [25, 32], color: 'text-amber-400', border: 'border-amber-500/40' },
        ].map((tier, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 border-b pb-2 ${tier.border}`}>
              <Flame className={`w-5 h-5 ${tier.color}`} />
              <span className={`font-mono font-extrabold text-sm ${tier.color}`}>{tier.title}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {levels
                .filter((l) => l.levelNumber >= tier.range[0] && l.levelNumber <= tier.range[1])
                .map((lvl) => (
                  <button
                    key={lvl.levelNumber}
                    disabled={!lvl.unlocked}
                    onClick={() => onSelectLevel(lvl.levelNumber)}
                    className={`relative p-4 rounded-2xl border flex flex-col items-center justify-between font-mono transition-all duration-300 min-h-[105px] ${
                      lvl.unlocked
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,243,255,0.25)] hover:scale-105 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!lvl.unlocked && <Lock className="w-5 h-5 text-slate-600 my-auto" />}
                    {lvl.unlocked && (
                      <span className="text-2xl font-black text-slate-100 mb-1">
                        {lvl.levelNumber}
                      </span>
                    )}

                    <span className="text-[9px] text-slate-400 uppercase tracking-widest">
                      STAGE {lvl.levelNumber}
                    </span>

                    {/* Stars */}
                    {lvl.unlocked && (
                      <div className="flex items-center gap-0.5 mt-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < lvl.stars
                                ? 'text-amber-400 fill-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                                : 'text-slate-800 fill-slate-900'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
