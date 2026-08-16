import React from 'react';
import type { LevelProgress, UserProfile } from '../types/game';
import { Star, Lock, Flame, ShieldCheck, HelpCircle, Award, Sparkles, Play } from 'lucide-react';

interface LevelSelectProps {
  activeUser: UserProfile;
  levels: LevelProgress[];
  onSelectLevel: (levelNumber: number) => void;
  onStartDailyAIChallenge: () => void;
  onOpenAIStudio: () => void;
  onOpenHowToPlay: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  activeUser,
  levels,
  onSelectLevel,
  onStartDailyAIChallenge,
  onOpenAIStudio,
  onOpenHowToPlay,
}) => {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center font-sans">
      {/* Hero Banner */}
      <div className="w-full p-8 rounded-3xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl mb-8 text-center flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <ShieldCheck className="w-4 h-4" /> AI POWERED COGNITIVE NEXUS
          </div>

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-mono hover:bg-purple-900 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" /> HOW TO PLAY
          </button>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-purple-400 bg-clip-text text-transparent mb-2">
          LOGIC LINK: AI NEXUS
        </h2>
        <p className="max-w-md text-xs font-mono text-slate-400 mb-6">
          Generative AI puzzles, 16-tile NYT Connections grid grouping, and custom AI prompt studio.
        </p>

        {/* Featured Daily AI Mystery Challenge Card */}
        <div className="w-full max-w-xl p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900/90 border-2 border-amber-400/80 backdrop-blur-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <Sparkles className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-amber-400 font-extrabold tracking-wider uppercase">
                FEATURED DAILY AI MYSTERY #42
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                16-Tile Connections Grid • 4 Mystery Categories
              </span>
            </div>
          </div>

          <button
            onClick={onStartDailyAIChallenge}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-mono font-extrabold text-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Play className="w-4 h-4 fill-current" /> PLAY DAILY AI
          </button>
        </div>

        {/* Action Buttons: AI Studio */}
        <button
          onClick={onOpenAIStudio}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-purple-500/50 font-mono text-xs text-purple-300 font-bold hover:border-purple-400 transition-all mb-6"
        >
          <Sparkles className="w-4 h-4 text-purple-400" /> CREATE CUSTOM AI QUIZ ON ANY TOPIC
        </button>

        {/* Active User Daily Stats Badge */}
        <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeUser.avatar}</span>
            <span className="font-bold text-slate-200">{activeUser.username}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-orange-400 font-bold">
            <Flame className="w-4 h-4 fill-orange-400/80" /> {activeUser.dailyStreak} DAY STREAK
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" /> {activeUser.totalStars} STARS
          </div>
        </div>
      </div>

      {/* 3 Tiers Grid */}
      <div className="w-full flex flex-col gap-8">
        {[
          { title: 'TIER 1: WARM-UP (BEGINNER • STAGES 1-10)', range: [1, 10], color: 'text-amber-400', border: 'border-amber-500/40' },
          { title: 'TIER 2: APTITUDE STANDARD (INTERMEDIATE • STAGES 11-20)', range: [11, 20], color: 'text-purple-400', border: 'border-purple-500/40' },
          { title: 'TIER 3: GENIUS CHALLENGE (EXPERT • STAGES 21-30)', range: [21, 30], color: 'text-pink-400', border: 'border-pink-500/40' },
        ].map((tier, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 border-b pb-2 ${tier.border}`}>
              <Award className={`w-5 h-5 ${tier.color}`} />
              <span className={`font-mono font-extrabold text-sm ${tier.color}`}>{tier.title}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {levels
                .filter((l) => l.levelNumber >= tier.range[0] && l.levelNumber <= tier.range[1])
                .map((lvl) => (
                  <button
                    key={lvl.levelNumber}
                    disabled={!lvl.unlocked}
                    onClick={() => onSelectLevel(lvl.levelNumber)}
                    className={`relative p-4 rounded-2xl border flex flex-col items-center justify-between font-mono transition-all duration-300 ${
                      lvl.unlocked
                        ? 'bg-slate-900/80 border-slate-700/80 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:scale-105 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 text-slate-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {!lvl.unlocked && <Lock className="w-5 h-5 text-slate-600 mb-2" />}
                    {lvl.unlocked && (
                      <span className="text-2xl font-black text-slate-100 mb-1">
                        {lvl.levelNumber}
                      </span>
                    )}

                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                      STAGE {lvl.levelNumber}
                    </span>

                    {/* Stars */}
                    {lvl.unlocked && (
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < lvl.stars
                                ? 'text-amber-400 fill-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                                : 'text-slate-700 fill-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
