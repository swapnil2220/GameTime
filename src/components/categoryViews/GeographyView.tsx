import React from 'react';

interface GeographyViewProps {
  data: any;
}

export const GeographyView: React.FC<GeographyViewProps> = ({ data }) => {
  if (data.type === 'capital') {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
          <span className="text-4xl mb-2">{data.flagEmoji}</span>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            WORLD CAPITAL TRIVIA
          </span>
          <h3 className="text-2xl font-black font-mono text-slate-100">
            What is the capital city of <span className="text-amber-400">{data.country}</span>?
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase mt-2">
            LOCATION: {data.continent}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
          IDENTIFY THE COUNTRY FROM ITS MAP OUTLINE
        </span>

        {/* SVG Country Map Outline */}
        <div className="relative w-48 h-48 flex items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 shadow-[0_0_25px_rgba(0,243,255,0.2)]">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path
              d={data.svgPathD}
              fill="rgba(0, 243, 255, 0.15)"
              stroke="#00f3ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 243, 255, 0.6))' }}
            />
          </svg>
        </div>

        <span className="text-[10px] font-mono text-slate-500 uppercase mt-4">
          CONTINENT: {data.continent}
        </span>
      </div>
    </div>
  );
};
