import React from 'react';
import type { SyllogismData } from '../../engine/categories/syllogisms';

interface SyllogismViewProps {
  data: SyllogismData;
}

export const SyllogismView: React.FC<SyllogismViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
          STATEMENT DEDUCTION
        </span>

        <div className="flex flex-col gap-2.5 w-full text-left font-mono">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/50 text-cyan-400 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-sm text-slate-200">{data.premise1}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-purple-950 border border-purple-500/50 text-purple-400 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-sm text-slate-200">{data.premise2}</span>
          </div>
        </div>

        <p className="text-xs font-mono text-pink-300 font-bold mt-4 tracking-wide">
          {data.question}
        </p>
      </div>
    </div>
  );
};
