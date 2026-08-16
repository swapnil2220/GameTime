import React from 'react';
import type { UserProfile } from '../types/game';
import { AudioToggle } from './AudioToggle';
import { Zap, Trophy, HelpCircle, User } from 'lucide-react';

interface NavbarProps {
  activeProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onNavigateHome: () => void;
  audioEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeProfile,
  onOpenProfile,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onNavigateHome,
  audioEnabled,
  onAudioToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-6 py-4 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between">
      {/* Brand Logo */}
      <div onClick={onNavigateHome} className="flex items-center gap-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xl font-mono tracking-wider bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            LOGIC LINK
          </span>
          <span className="text-[9px] font-mono text-cyan-400/70 uppercase tracking-widest -mt-1">
            NEXUS INVESTOR EDITION
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* User Session Pill */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono hover:border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)] transition-all"
        >
          <span className="text-base">{activeProfile.avatar}</span>
          <span className="font-bold">{activeProfile.name}</span>
          <User className="w-3.5 h-3.5 text-purple-400 ml-1" />
        </button>

        {/* How to play */}
        <button
          onClick={onOpenHowToPlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-cyan-400 text-xs font-mono hover:border-cyan-400 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">HOW TO PLAY</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-amber-400 text-xs font-mono hover:border-amber-400 transition-all"
        >
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline">SCORES</span>
        </button>

        <AudioToggle enabled={audioEnabled} onChange={onAudioToggle} />
      </div>
    </header>
  );
};
