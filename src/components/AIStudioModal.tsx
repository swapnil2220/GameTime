import React, { useState, useEffect } from 'react';
import { Sparkles, X, Wand2, Key, Check } from 'lucide-react';
import { getCustomGeminiKey, saveCustomGeminiKey } from '../engine/userManager';
import { fetchLiveGeminiConnectionsPuzzle } from '../engine/aiEngine';
import type { ConnectionsPuzzle } from '../types/game';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateTopicPuzzle: (topicPrompt: string, livePuzzle?: ConnectionsPuzzle | null) => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({
  isOpen,
  onClose,
  onGenerateTopicPuzzle,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isSavedKey, setIsSavedKey] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getCustomGeminiKey();
      setApiKeyInput(existing);
      setIsSavedKey(!!existing);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    saveCustomGeminiKey(apiKeyInput);
    setIsSavedKey(true);
  };

  const handlePresetClick = async (presetTopic: string) => {
    setLoading(true);
    const live = await fetchLiveGeminiConnectionsPuzzle(presetTopic, apiKeyInput);
    setLoading(false);
    onGenerateTopicPuzzle(presetTopic, live);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    const live = await fetchLiveGeminiConnectionsPuzzle(topicInput.trim(), apiKeyInput);
    setLoading(false);

    onGenerateTopicPuzzle(topicInput.trim(), live);
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
              <span className="text-[10px] font-mono text-slate-400">POWERED BY GOOGLE GEMINI AI</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Gemini API Key Section */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-all"
          >
            <Key className="w-3.5 h-3.5" />
            {showKeyInput ? 'Hide API Key Setting' : isSavedKey ? '🔑 Gemini API Key Saved' : '🔑 Enter Gemini API Key (.env or manual)'}
          </button>

          {showKeyInput && (
            <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-slate-100 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> SAVE
              </button>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <label className="text-xs font-mono text-slate-300">
            Type ANY topic or interest to generate a live AI 16-tile puzzle:
          </label>

          <input
            type="text"
            required
            maxLength={30}
            disabled={loading}
            placeholder="e.g. Marvel Universe, 90s Rock, Space Exploration..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm text-slate-100 focus:border-amber-400 focus:outline-none disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-extrabold text-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">GENERATING WITH GEMINI AI...</span>
            ) : (
              <>
                <Wand2 className="w-4 h-4" /> GENERATE AI PUZZLE
              </>
            )}
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
                  disabled={loading}
                  onClick={() => handlePresetClick(topic)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:border-amber-400 transition-all disabled:opacity-50"
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
