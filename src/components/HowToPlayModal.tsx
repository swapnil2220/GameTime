import React, { useState } from 'react';
import { X, ShieldCheck, Star, Lightbulb, Zap, Globe, Trophy, Compass } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'categories' | 'scoring'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-extrabold font-mono text-cyan-400">HOW TO PLAY</h3>
              <span className="text-[10px] font-mono text-slate-400">NEXUS OPERATOR GUIDE</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          {(['rules', 'categories', 'scoring'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'rules' && (
          <div className="flex flex-col gap-4 text-xs font-mono text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-300 block mb-1">1. Master 30 Campaign Stages</strong>
                Progress sequentially from Tier 1 (Beginner Warm-Up) to Tier 2 (Standard Aptitude) and Tier 3 (Genius Challenge).
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-1">2. Interactive Clue System</strong>
                Stuck on a puzzle? Click "SHOW VISUAL HINT" on any level to reveal a contextual deduction clue.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <Zap className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-pink-300 block mb-1">3. Instant Logic Explanations</strong>
                After picking an answer, a step-by-step logic breakdown is displayed so you can learn effortlessly!
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {[
              { title: 'GEOGRAPHY MAPS', desc: 'Identify SVG country outlines, capitals & landmarks.', icon: <Globe className="w-4 h-4 text-cyan-400" /> },
              { title: 'SPORTS ARENA', desc: 'Rules, court dimensions & international sports trivia.', icon: <Trophy className="w-4 h-4 text-amber-400" /> },
              { title: 'VISUAL ANALOGIES', desc: 'Spatial transformations (A : B :: C : ?).', icon: '📐' },
              { title: 'CODE CIPHERS', desc: 'Alphabet shifts and number decoding.', icon: '🔐' },
              { title: 'VENN LOGIC', desc: 'Set relationships & circle intersections.', icon: '⭕' },
              { title: 'NUMBER SERIES', desc: 'Progression sequence rules.', icon: '🔢' },
            ].map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  {c.icon} {c.title}
                </div>
                <span className="text-[11px] text-slate-400">{c.desc}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="flex flex-col gap-4 text-xs font-mono text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-amber-300 font-bold">Solve under 15 seconds</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-amber-300 font-bold">Solve under 30 seconds</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-amber-300 font-bold">Solve correctly</span>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-mono font-extrabold text-white text-sm shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-102 transition-all"
        >
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};
