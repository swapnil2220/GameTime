import React, { useState } from 'react';
import type { AIPersonaType, AptitudePuzzle } from '../types/game';
import { fetchPersonaHint } from '../engine/aiEngine';
import { Sparkles, RefreshCw, MessageSquareQuote } from 'lucide-react';

interface NexusAIPersonaProps {
  puzzle: AptitudePuzzle;
  personaType?: AIPersonaType;
  onPersonaChange?: (newPersona: AIPersonaType) => void;
}

export const PERSONAS: { id: AIPersonaType; name: string; avatar: string; tagline: string }[] = [
  {
    id: 'socratic',
    name: 'Socratic Mentor',
    avatar: '🦉',
    tagline: 'Guides your intellect through probing analytical inquiry.',
  },
  {
    id: 'snarky',
    name: 'Glitch-X 9000',
    avatar: '👾',
    tagline: 'Sarcastic, hyper-intelligent AI with zero tolerance for missteps.',
  },
  {
    id: 'zen',
    name: 'Zen Logic Monk',
    avatar: '☯️',
    tagline: 'Calm, harmonious insights into the nature of patterns.',
  },
];

export const NexusAIPersona: React.FC<NexusAIPersonaProps> = ({
  puzzle,
  personaType = 'snarky',
  onPersonaChange,
}) => {
  const [activePersona, setActivePersona] = useState<AIPersonaType>(personaType);
  const [hintStep, setHintStep] = useState<number>(0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentPersona = PERSONAS.find((p) => p.id === activePersona) || PERSONAS[1];

  const handleSelectPersona = (pId: AIPersonaType) => {
    setActivePersona(pId);
    setHintStep(0);
    setHintText(null);
    if (onPersonaChange) onPersonaChange(pId);
  };

  const handleRequestHint = async () => {
    if (loading) return;
    setLoading(true);

    const nextStep = Math.min(3, hintStep + 1);
    setHintStep(nextStep);

    try {
      const hint = await fetchPersonaHint(puzzle, activePersona, nextStep);
      setHintText(hint);
    } catch (e) {
      setHintText(`Look closely at the key relationship in ${puzzle.categoryTitle}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col items-center my-3 font-sans">
      {/* Header & Persona Picker */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentPersona.avatar}</span>
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-cyan-300">{currentPersona.name}</span>
            <span className="text-[10px] font-mono text-slate-400">{currentPersona.tagline}</span>
          </div>
        </div>

        {/* Picker Buttons */}
        <div className="flex items-center gap-1">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPersona(p.id)}
              className={`p-1.5 rounded-lg text-sm transition-all ${
                activePersona === p.id ? 'bg-cyan-950 border border-cyan-400 scale-110' : 'bg-slate-800 opacity-60'
              }`}
              title={p.name}
            >
              {p.avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Hint Area */}
      {hintText ? (
        <div className="w-full p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs font-mono text-cyan-200 text-left flex items-start gap-2.5 mb-3 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
          <MessageSquareQuote className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              HINT LEVEL {hintStep}/3 ({currentPersona.name})
            </span>
            <p className="leading-relaxed">{hintText}</p>
          </div>
        </div>
      ) : null}

      {/* Request Hint Action */}
      <button
        disabled={loading || hintStep >= 3}
        onClick={handleRequestHint}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-purple-950 border border-cyan-500/40 font-mono text-xs text-cyan-300 font-extrabold hover:border-cyan-300 disabled:opacity-40 transition-all shadow-sm"
      >
        {loading ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        )}
        <span>
          {loading
            ? 'CONSULTING AI PERSONA...'
            : hintStep === 0
            ? `ASK ${currentPersona.name.toUpperCase()} FOR A HINT`
            : hintStep < 3
            ? `DEEPER HINT (LEVEL ${hintStep + 1}/3)`
            : 'MAXIMUM HINT REACHED'}
        </span>
      </button>
    </div>
  );
};
