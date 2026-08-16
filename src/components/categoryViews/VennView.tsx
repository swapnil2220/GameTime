import React from 'react';
import type { VennQuestionData } from '../../engine/categories/vennLogic';

interface VennViewProps {
  data: VennQuestionData;
}

export const VennView: React.FC<VennViewProps> = ({ data }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
          ANALYZE CATEGORY RELATIONSHIP
        </span>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-base shadow-[0_0_12px_rgba(0,243,255,0.2)]">
            1. {data.itemA}
          </span>
          <span className="text-slate-500 font-mono text-xl">•</span>
          <span className="px-4 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono font-bold text-base shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            2. {data.itemB}
          </span>
          <span className="text-slate-500 font-mono text-xl">•</span>
          <span className="px-4 py-2 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-300 font-mono font-bold text-base shadow-[0_0_12px_rgba(236,72,153,0.2)]">
            3. {data.itemC}
          </span>
        </div>

        <p className="text-xs font-mono text-slate-400 mt-4">
          Which Venn diagram best describes the logical set relationships between these three items?
        </p>
      </div>
    </div>
  );
};
