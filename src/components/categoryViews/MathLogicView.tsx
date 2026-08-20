import React from 'react';
import { Calculator } from 'lucide-react';

interface MathLogicViewProps {
  equationText: string;
}

export const MathLogicView: React.FC<MathLogicViewProps> = ({ equationText }) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4 font-sans">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center text-center shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4">
          <Calculator className="w-4 h-4 text-cyan-400" /> SPEED MATH LOGIC
        </div>

        <div className="px-8 py-5 rounded-2xl bg-gradient-to-r from-slate-950 via-cyan-950/60 to-purple-950/60 border-2 border-cyan-500/60 font-mono text-3xl font-black text-amber-300 tracking-wider shadow-[0_0_25px_rgba(0,243,255,0.2)] mb-3">
          {equationText}
        </div>

        <p className="text-xs font-mono text-slate-400">
          Find the missing numerical value for <span className="text-amber-400 font-bold">?</span> that balances the equation.
        </p>
      </div>
    </div>
  );
};
