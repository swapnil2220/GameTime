import React from 'react';

interface CipherViewProps {
  exampleWord: string;
  exampleCode: string;
  targetWord: string;
}

export const CipherView: React.FC<CipherViewProps> = ({
  exampleWord,
  exampleCode,
  targetWord,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg my-4">
      {/* Example Cipher Pair */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md w-full shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ORIGINAL WORD</span>
          <span className="text-3xl font-extrabold font-mono text-cyan-400 tracking-widest">{exampleWord}</span>
        </div>

        <span className="text-2xl font-mono text-amber-400">→</span>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase">ENCODED CIPHER</span>
          <span className="text-3xl font-extrabold font-mono text-purple-400 tracking-widest">{exampleCode}</span>
        </div>
      </div>

      {/* Target Cipher Challenge */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-slate-900/90 to-pink-900/40 border-2 border-pink-500/60 backdrop-blur-md w-full shadow-[0_0_25px_rgba(236,72,153,0.25)] animate-pulse">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-pink-300 uppercase">TARGET WORD</span>
          <span className="text-3xl font-black font-mono text-pink-300 tracking-widest">{targetWord}</span>
        </div>

        <span className="text-2xl font-mono text-pink-400">→</span>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-pink-300 uppercase">DECODE TARGET</span>
          <span className="text-3xl font-black font-mono text-amber-300 bg-black/50 px-4 py-0.5 rounded border border-amber-400/50">
            ?
          </span>
        </div>
      </div>
    </div>
  );
};
