import React from 'react';
import type { SportsQuestionData } from '../../engine/categories/sports';
import { Trophy } from 'lucide-react';

interface SportsViewProps {
  data: SportsQuestionData;
}

export const SportsView: React.FC<SportsViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Trophy className="w-4 h-4" /> {data.sportName.toUpperCase()} ARENA
        </div>

        {/* Sports Icon Visual Badge */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-500/40 flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-4">
          {data.icon}
        </div>

        <p className="text-base font-black font-mono text-slate-100 tracking-wide">
          {data.questionText}
        </p>
      </div>
    </div>
  );
};
