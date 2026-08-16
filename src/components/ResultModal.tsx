import React from 'react';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface ResultModalProps {
  stars: number;
  score: number;
  timeSec: number;
  levelNumber: number;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onBackToMap: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  stars,
  score,
  timeSec,
  levelNumber,
  onNextLevel,
  onRetryLevel,
  onBackToMap,
}) => {
  return (
    <div className="relative z-20 w-full max-w-xl mx-auto px-4 py-8">
      <div className="p-8 rounded-3xl bg-slate-950/90 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <h2 className="text-3xl font-black font-mono tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent mb-1">
          {stars > 0 ? 'STAGE CLEARED!' : 'TRY AGAIN'}
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6">STAGE {levelNumber} PERFORMANCE REPORT</p>

        {/* Stars Banner */}
        <div className="flex items-center gap-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Star
              key={i}
              className={`w-10 h-10 transition-all duration-500 ${
                i < stars
                  ? 'text-amber-400 fill-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] scale-110'
                  : 'text-slate-800 fill-slate-900'
              }`}
            />
          ))}
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase">TIME SPENT</span>
            <span className="text-2xl font-black font-mono text-cyan-400 mt-1">{timeSec}s</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase">SCORE EARNED</span>
            <span className="text-2xl font-black font-mono text-amber-400 mt-1">+{score}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {stars > 0 && levelNumber < 15 && (
            <button
              onClick={onNextLevel}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-mono font-extrabold text-white text-sm shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:scale-102 transition-all"
            >
              NEXT STAGE <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onRetryLevel}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 border border-slate-700 font-mono font-extrabold text-slate-200 text-sm hover:border-cyan-400 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> RETRY STAGE
          </button>

          <button
            onClick={onBackToMap}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 border border-slate-700 font-mono font-extrabold text-slate-400 text-sm hover:text-slate-200 transition-all"
          >
            STAGE MAP
          </button>
        </div>
      </div>
    </div>
  );
};
