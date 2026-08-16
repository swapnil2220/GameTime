import React, { useState } from 'react';
import { Sparkles, X, Wand2 } from 'lucide-react';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateTopicPuzzle: (topicPrompt: string) => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  onGenerateTopicPuzzle,
}) => {
  const [topicInput, setTopicInput] = useState('');

  if (!isOpen) return null;

  const handlePresetClick = (presetTopic: string) => {
    onGenerateTopicPuzzle(presetTopic);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    onGenerateTopicPuzzle(topicInput.trim());
    setTopicInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 flex items-center justify-center text-black">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-extrabold font-mono text-amber-400">AI CUSTOM STUDIO</h3>
              <span className="text-[10px] font-mono text-slate-400">GENERATIVE AI PUZZLE CREATOR</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <label className="text-xs font-mono text-slate-300">
            Type ANY topic or interest to generate an AI 16-tile puzzle on the fly:
          </label>

          <input
            type="text"
            required
            maxLength={30}
            placeholder="e.g. Marvel Universe, 90s Rock, Space Exploration..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-extrabold text-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2"
          >
            <Wand2 className="w-4 h-4" /> GENERATE AI PUZZLE
          </button>
        </form>

        {/* Popular Presets */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
            OR TRY AN AI POPULAR TOPIC:
          </span>

          <div className="flex flex-wrap gap-2">
            {['Cinema & Hollywood', 'Tech & Innovation', 'Food & Culinary', 'World History', 'Anime & Games'].map(
              (topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handlePresetClick(topic)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:border-amber-400 transition-all"
                >
                  ✨ {topic}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
