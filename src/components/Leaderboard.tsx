import React from 'react';
import { getAllUsers } from '../engine/userManager';
import { Trophy, Star, RotateCcw } from 'lucide-react';

interface LeaderboardProps {
  onBackToMenu: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onBackToMenu }) => {
  const users = getAllUsers().sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-4 py-8">
      <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-amber-400" />
          <h2 className="text-3xl font-black font-mono tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-pink-400 bg-clip-text text-transparent">
            NEXUS LEADERBOARD
          </h2>
        </div>
        <p className="text-xs font-mono text-slate-400 mb-8">GLOBAL OPERATOR RANKING & SCORES</p>

        <div className="w-full flex flex-col gap-3 mb-8">
          {users.map((entry, idx) => {
            const completedCount = entry.levelProgress.filter((l) => l.completed).length;

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 font-mono transition-all hover:border-amber-500/40"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      idx === 0
                        ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                        : idx === 1
                        ? 'bg-slate-300 text-black'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-slate-200">
                        {entry.username} {entry.isGuest && '(Guest)'}
                      </span>
                      <span className="text-[10px] text-slate-500">STAGES CLEARED: {completedCount}/30</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-500">STARS</span>
                    <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {entry.totalStars}
                    </span>
                  </div>

                  <div className="flex flex-col items-end min-w-[90px]">
                    <span className="text-[10px] text-slate-500">TOTAL SCORE</span>
                    <span className="text-lg font-black text-amber-400">{entry.totalScore}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-sm text-slate-300 hover:border-cyan-400 transition-all"
        >
          <RotateCcw className="w-4 h-4" /> RETURN TO STAGE MAP
        </button>
      </div>
    </div>
  );
};
