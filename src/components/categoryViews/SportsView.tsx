import React from 'react';

interface SportsViewProps {
  data: any;
}

export const SportsView: React.FC<SportsViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl w-full flex flex-col items-center text-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <span className="text-6xl mb-3 animate-pulse">{data.iconEmoji}</span>
        <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-3">
          SPORTS & CULTURE BENCHMARK
        </span>
        <h3 className="text-xl font-bold font-mono text-slate-100 leading-snug">
          {data.question}
        </h3>
      </div>
    </div>
  );
};
