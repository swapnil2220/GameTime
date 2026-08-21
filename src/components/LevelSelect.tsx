import React from 'react';
import type { LevelProgress, UserProfile, RelicModifierId } from '../types/game';
import { ALL_RELICS, toggleRelicInList } from '../engine/modifierEngine';
import { Star, Lock, Flame, ShieldCheck, HelpCircle, Award, Sparkles, Play, Zap, Brain, Swords, Crown, ShieldAlert } from 'lucide-react';

interface LevelSelectProps {
  activeUser: UserProfile;
  levels: LevelProgress[];
  onSelectLevel: (levelNumber: number) => void;
  onStartDailyAIChallenge: () => void;
  onStartBlitz: () => void;
  onStartKBC: () => void;
  onStartGhostDuel: () => void;
  onOpenMindMatrix: () => void;
  onOpenAIStudio: () => void;
  onOpenHowToPlay: () => void;
  onUserUpdated?: (user: UserProfile) => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  activeUser,
  levels,
  onSelectLevel,
  onStartDailyAIChallenge,
  onStartBlitz,
  onStartKBC,
  onStartGhostDuel,
  onOpenMindMatrix,
  onOpenAIStudio,
  onOpenHowToPlay,
  onUserUpdated,
}) => {
  const activeRelicIds = activeUser.activeRelics || [];

  const handleToggleRelic = (rId: RelicModifierId) => {
    const updatedRelics = toggleRelicInList(activeRelicIds, rId);
    const updatedUser: UserProfile = {
      ...activeUser,
      activeRelics: updatedRelics,
    };
    if (onUserUpdated) onUserUpdated(updatedUser);
  };

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
          KBC Grand Ladder mode, Generative AI puzzles, 60s Speed Blitz, and Seeded Ghost Duels.
        </p>

        {/* Featured Game Modes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full mb-6">
          {/* Grand Ladder KBC Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-purple-950/90 border-2 border-amber-400 backdrop-blur-md flex flex-col justify-between text-left shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5 fill-amber-400/30" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-amber-400 font-extrabold uppercase">
                  GRAND LADDER
                </span>
                <span className="text-[9px] font-mono text-slate-300">
                  15 Stages • 4 Lifelines
                </span>
              </div>
            </div>

            <button
              onClick={onStartKBC}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 font-mono font-extrabold text-black text-xs shadow-md hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> PLAY LADDER
            </button>
          </div>

          {/* Speed Blitz Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/70 via-amber-950/70 to-slate-900/90 border border-slate-700 backdrop-blur-md flex flex-col justify-between text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
                <Zap className="w-5 h-5 fill-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-amber-400 font-extrabold uppercase">
                  SPEED BLITZ
                </span>
                <span className="text-[9px] font-mono text-slate-300">
                  60s Timer • Multiplier
                </span>
              </div>
            </div>

            <button
              onClick={onStartBlitz}
              className="w-full py-2 rounded-xl bg-slate-900 border border-amber-500/50 font-mono font-extrabold text-amber-300 text-xs hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> BLITZ
            </button>
          </div>

          {/* Ghost Duel PvP Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-slate-900/90 border border-slate-700 backdrop-blur-md flex flex-col justify-between text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-amber-400 flex items-center justify-center text-amber-400">
                <Swords className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-amber-300 font-extrabold uppercase">
                  GHOST DUELS
                </span>
                <span className="text-[9px] font-mono text-slate-300">
                  Seeded Race • Delta HUD
                </span>
              </div>
            </div>

            <button
              onClick={onStartGhostDuel}
              className="w-full py-2 rounded-xl bg-slate-900 border border-purple-500/50 font-mono font-extrabold text-purple-300 text-xs hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <Swords className="w-3.5 h-3.5" /> DUEL
            </button>
          </div>

          {/* Daily AI Mystery Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-950/90 to-slate-900/90 border border-purple-400/80 backdrop-blur-md flex flex-col justify-between text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-300">
                <Sparkles className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono text-purple-400 font-extrabold uppercase">
                  DAILY AI #42
                </span>
                <span className="text-[9px] font-mono text-slate-300">
                  16-Tile Connections
                </span>
              </div>
            </div>

            <button
              onClick={onStartDailyAIChallenge}
              className="w-full py-2 rounded-xl bg-purple-900 border border-purple-500 font-mono font-extrabold text-white text-xs hover:scale-102 transition-all flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> DAILY AI
            </button>
          </div>
        </div>

        {/* Cognitive Relics & Modifiers Manager HUD */}
        <div className="w-full p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md mb-6 flex flex-col text-left">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-extrabold text-amber-300 uppercase tracking-wider">
              COGNITIVE RELICS & MODIFIERS (EQUIP MAX 2)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {ALL_RELICS.map((relic) => {
              const isActive = activeRelicIds.includes(relic.id);
              return (
                <button
                  key={relic.id}
                  onClick={() => handleToggleRelic(relic.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all font-mono ${
                    isActive
                      ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-2xl">{relic.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-slate-100 flex items-center gap-2">
                      {relic.name}
                      {isActive && <span className="text-[9px] text-amber-400 font-bold uppercase">[EQUIPPED]</span>}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{relic.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Mind Matrix & AI Studio */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            onClick={onOpenMindMatrix}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400/60 font-mono text-xs text-cyan-300 font-bold hover:border-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
          >
            <Brain className="w-4 h-4 text-cyan-400" /> VIEW MY 6-AXIS MIND MATRIX
          </button>

          <button
            onClick={onOpenAIStudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-purple-500/50 font-mono text-xs text-purple-300 font-bold hover:border-purple-400 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> CREATE CUSTOM AI QUIZ ON ANY TOPIC
          </button>
        </div>

        {/* Active User Daily Stats Badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeUser.avatar}</span>
            <span className="font-bold text-slate-200">{activeUser.username}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1 text-orange-400 font-bold">
            <Flame className="w-4 h-4 fill-orange-400/80" /> {activeUser.dailyStreak} DAY STREAK
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" /> {activeUser.totalStars} STARS
          </div>

          {activeUser.kbcHighPrize ? (
            <>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Crown className="w-4 h-4 fill-amber-300/20" /> LADDER BEST: ₹{activeUser.kbcHighPrize.toLocaleString()}
              </div>
            </>
          ) : null}
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
