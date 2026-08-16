import React from 'react';

interface SeriesViewProps {
  sequence: number[];
}

export const SeriesView: React.FC<SeriesViewProps> = ({ sequence }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center shadow-xl">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
          DEDUCE THE NEXT NUMBER IN PATTERN
        </span>

        <div className="flex items-center gap-3">
          {sequence.map((num, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-cyan-500/40 text-cyan-300 font-mono font-extrabold text-2xl shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                {num}
              </div>
              <span className="text-slate-500 font-mono text-lg">→</span>
            </React.Fragment>
          ))}

          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-2 border-pink-500 text-pink-300 font-mono font-black text-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)] animate-pulse">
            ?
          </div>
        </div>
      </div>
    </div>
  );
};
