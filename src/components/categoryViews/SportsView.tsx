import React from 'react';

interface SportsViewProps {
  data: any;
}

export const SportsView: React.FC<SportsViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <span className="text-4xl mb-2">{data.iconEmoji}</span>
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          SPORTS & CULTURE BENCHMARK
        </span>
        <h3 className="text-lg font-bold font-mono text-slate-100 leading-snug">
          {data.question}
        </h3>
      </div>
    </div>
  );
};
