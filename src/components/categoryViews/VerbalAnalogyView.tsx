import React from 'react';
import type { VerbalAnalogyData } from '../../engine/categories/verbalAnalogies';
import { Type } from 'lucide-react';

interface VerbalAnalogyViewProps {
  data: VerbalAnalogyData;
}

export const VerbalAnalogyView: React.FC<VerbalAnalogyViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4 font-sans">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-widest mb-4">
          <Type className="w-4 h-4 text-purple-400" /> VERBAL WORD ANALOGY
        </div>

        {/* Word Analogy Equation Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full mb-4 font-mono">
          <span className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-base">
            {data.wordA}
          </span>
          <span className="text-slate-400 text-xl font-bold">:</span>
          <span className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-base">
            {data.wordB}
          </span>
          <span className="text-amber-400 text-2xl font-black px-1">::</span>
          <span className="px-4 py-2 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-300 font-bold text-base">
            {data.wordC}
          </span>
          <span className="text-slate-400 text-xl font-bold">:</span>
          <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-900 to-pink-900 border-2 border-pink-500 text-amber-300 font-black text-xl shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse">
            ?
          </span>
        </div>

        <p className="text-xs font-mono text-slate-400">
          Which word completes the analogy relationship?
        </p>
      </div>
    </div>
  );
};
