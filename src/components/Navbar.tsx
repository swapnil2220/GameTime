import React from 'react';
import type { UserProfile } from '../types/game';
import { AudioToggle } from './AudioToggle';
import { Zap, Trophy, HelpCircle, User, Flame, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeUser: UserProfile;
  onNavigate: (view: 'level_select' | 'leaderboard') => void;
  onOpenHowToPlay: () => void;
  onOpenAIStudio: () => void;
  onOpenAuth: () => void;
  audioEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  onNavigate,
  onOpenHowToPlay,
  onOpenAIStudio,
  onOpenAuth,
  audioEnabled,
  onAudioToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between font-sans">
      {/* Brand Logo */}
      <div
        onClick={() => onNavigate('level_select')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl font-mono tracking-wider bg-gradient-to-r from-amber-400 via-orange-300 to-pink-400 bg-clip-text text-transparent">
            LOGIC LINK
          </span>
          <span className="text-[9px] font-mono text-amber-400/70 uppercase tracking-widest -mt-1">
            AI NEXUS V3
          </span>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center gap-3">
        {/* Daily Streak Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/80 to-orange-950/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-[0_0_12px_rgba(245,158,11,0.2)]"
          title="Daily Habit Streak"
        >
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400/80 animate-pulse" />
          <span>{activeUser.dailyStreak} DAY STREAK</span>
        </div>

        {/* AI Custom Studio Button */}
        <button
          onClick={onOpenAIStudio}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border bg-gradient-to-r from-amber-950/80 to-purple-950/80 border-amber-400 text-amber-300 hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span>AI STUDIO</span>
        </button>

        {/* How to Play button */}
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-amber-400 transition-all"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">GUIDE</span>
        </button>

        {/* Leaderboard button */}
        <button
          onClick={() => onNavigate('leaderboard')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border bg-slate-900/80 border-amber-500/40 text-amber-300 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">SCORES</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border bg-slate-900 border-purple-500/50 text-purple-300 hover:border-purple-400 transition-all"
        >
          <span className="text-lg">{activeUser.avatar}</span>
          <span className="text-xs font-mono font-bold max-w-[90px] truncate hidden sm:inline">
            {activeUser.username}
          </span>
          <User className="w-3.5 h-3.5 text-purple-400" />
        </button>

        <AudioToggle enabled={audioEnabled} onChange={onAudioToggle} />
      </div>
    </header>
  );
};
