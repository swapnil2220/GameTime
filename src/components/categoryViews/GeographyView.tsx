import React from 'react';

interface GeographyViewProps {
  data: any;
}

export const GeographyView: React.FC<GeographyViewProps> = ({ data }) => {
  if (data.type === 'capital') {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl w-full flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,243,255,0.15)]">
          <span className="text-6xl mb-3 animate-bounce">{data.flagEmoji}</span>
          <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-2">
            WORLD CAPITAL TRIVIA
          </span>
          <h3 className="text-2xl font-black font-mono text-slate-100">
            What is the capital city of <span className="text-amber-400">{data.country}</span>?
          </h3>
          <span className="text-xs font-mono text-slate-500 uppercase mt-3">
            CONTINENT: {data.continent}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-2xl w-full flex flex-col items-center text-center shadow-[0_0_30px_rgba(0,243,255,0.15)]">
        <span className="px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-4">
          IDENTIFY COUNTRY FROM MAP OUTLINE
        </span>

        {/* SVG Country Map Outline with Glow & Pulse */}
        <div className="relative w-56 h-56 flex items-center justify-center p-6 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/60 shadow-[0_0_30px_rgba(0,243,255,0.3)] animate-pulse">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path
              d={data.svgPathD}
              fill="rgba(0, 243, 255, 0.25)"
              stroke="#00f3ff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 12px rgba(0, 243, 255, 0.8))' }}
            />
          </svg>
        </div>

        <span className="text-xs font-mono text-slate-400 uppercase mt-4">
          LOCATION: {data.continent}
        </span>
      </div>
    </div>
  );
};
