import React, { useState, useEffect, useRef } from 'react';
import type { ConnectionsPuzzle, ConnectionsGroup } from '../types/game';
import { sound } from '../engine/sound';
import { Shuffle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConnectionsGridProps {
  puzzle: ConnectionsPuzzle;
  onComplete: (score: number, stars: number, emojiGrid: string) => void;
  onBackToMap: () => void;
}

export const ConnectionsGrid: React.FC<ConnectionsGridProps> = ({
  puzzle,
  onComplete,
  onBackToMap,
}) => {
  const [tiles, setTiles] = useState<string[]>(puzzle.shuffledTiles);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<ConnectionsGroup[]>([]);
  const [mistakesLeft, setMistakesLeft] = useState<number>(4);
  const [attemptsEmojiHistory, setAttemptsEmojiHistory] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBackToMap = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onBackToMap();
  };

  const COLOR_STYLES: Record<ConnectionsGroup['colorTier'], { bg: string; border: string; text: string; emoji: string }> = {
    yellow: { bg: 'bg-amber-950/80', border: 'border-amber-400', text: 'text-amber-300', emoji: '🟨' },
    green: { bg: 'bg-emerald-950/80', border: 'border-emerald-400', text: 'text-emerald-300', emoji: '🟩' },
    blue: { bg: 'bg-cyan-950/80', border: 'border-cyan-400', text: 'text-cyan-300', emoji: '🟦' },
    purple: { bg: 'bg-purple-950/80', border: 'border-purple-400', text: 'text-purple-300', emoji: '🟪' },
  };

  const handleTileClick = (tile: string) => {
    if (selectedTiles.includes(tile)) {
      setSelectedTiles((prev) => prev.filter((t) => t !== tile));
      sound.playClick();
    } else {
      if (selectedTiles.length < 4) {
        setSelectedTiles((prev) => [...prev, tile]);
        sound.playClick();
      }
    }
  };

  const handleShuffle = () => {
    sound.playClick();
    const currentRemaining = tiles.filter((t) => !solvedGroups.some((g) => g.items.includes(t)));
    const shuffled = [...currentRemaining];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setTiles(shuffled);
  };

  const handleDeselectAll = () => {
    sound.playClick();
    setSelectedTiles([]);
  };

  const handleSubmit = () => {
    if (selectedTiles.length !== 4) return;

    const matchingGroup = puzzle.groups.find((group) => {
      const groupItems = new Set(group.items);
      return selectedTiles.every((t) => groupItems.has(t));
    });

    if (matchingGroup && !solvedGroups.some((g) => g.categoryTitle === matchingGroup.categoryTitle)) {
      sound.playCorrect();
      const nextSolved = [...solvedGroups, matchingGroup];
      setSolvedGroups(nextSolved);

      const emojiRow = COLOR_STYLES[matchingGroup.colorTier].emoji.repeat(4);
      setAttemptsEmojiHistory((prev) => [...prev, emojiRow]);

      setSelectedTiles([]);
      setMessage(`SOLVED: ${matchingGroup.categoryTitle}!`);

      if (nextSolved.length === 4) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        sound.playOverdrive();

        const stars = mistakesLeft >= 3 ? 3 : mistakesLeft >= 1 ? 2 : 1;
        const score = 1000 + mistakesLeft * 200;
        const emojiGrid = attemptsEmojiHistory.concat(emojiRow).join('\n');

        timeoutRef.current = setTimeout(() => {
          onComplete(score, stars, emojiGrid);
        }, 1500);
      }
    } else {
      sound.playWrong();

      let isOneAway = false;
      puzzle.groups.forEach((group) => {
        const groupItems = new Set(group.items);
        const matchCount = selectedTiles.filter((t) => groupItems.has(t)).length;
        if (matchCount === 3) isOneAway = true;
      });

      const nextMistakes = mistakesLeft - 1;
      setMistakesLeft(nextMistakes);

      const wrongEmojiRow = '🟥'.repeat(4);
      setAttemptsEmojiHistory((prev) => [...prev, wrongEmojiRow]);

      if (isOneAway) {
        setMessage('ONE AWAY! 3 of 4 items belong to a group.');
      } else {
        setMessage('INCALCULABLE! Try another 4-tile combination.');
      }

      if (nextMistakes <= 0) {
        timeoutRef.current = setTimeout(() => {
          onComplete(200, 0, attemptsEmojiHistory.join('\n'));
        }, 1500);
      }
    }
  };

  const remainingTiles = tiles.filter((t) => !solvedGroups.some((g) => g.items.includes(t)));

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 flex flex-col items-center font-sans">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800 backdrop-blur-xl shadow-xl mb-6">
        <button
          onClick={handleBackToMap}
          className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300"
        >
          ← STAGE MAP
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-black text-sm text-amber-300 uppercase tracking-wider">
            {puzzle.title}
          </span>
        </div>

        {/* Mistakes counter */}
        <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
          <span>MISTAKES:</span>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < mistakesLeft ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Guidance Message */}
      {message && (
        <div className="w-full p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-mono text-purple-200 text-center mb-4 animate-fadeIn">
          {message}
        </div>
      )}

      {/* Solved Banner Cards */}
      <div className="w-full flex flex-col gap-3 mb-4">
        {solvedGroups.map((group, idx) => {
          const style = COLOR_STYLES[group.colorTier];
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${style.bg} ${style.border} flex flex-col items-center text-center shadow-lg animate-fadeIn`}
            >
              <span className={`font-mono font-black text-sm uppercase ${style.text} tracking-wider`}>
                {group.categoryTitle}
              </span>
              <span className="font-mono text-xs text-slate-200 mt-1">
                {group.items.join(' • ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* 16-Tile Interactive Grid */}
      {remainingTiles.length > 0 && (
        <div className="grid grid-cols-4 gap-3 w-full mb-6">
          {remainingTiles.map((tile) => {
            const isSelected = selectedTiles.includes(tile);

            return (
              <button
                key={tile}
                onClick={() => handleTileClick(tile)}
                className={`p-4 rounded-2xl border font-mono font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 min-h-[75px] flex items-center justify-center text-center ${
                  isSelected
                    ? 'bg-amber-400 border-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                }`}
              >
                {tile}
              </button>
            );
          })}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <button
          onClick={handleShuffle}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-slate-300 hover:border-cyan-400 transition-all"
        >
          <Shuffle className="w-4 h-4" /> SHUFFLE
        </button>

        <button
          onClick={handleDeselectAll}
          disabled={selectedTiles.length === 0}
          className="flex-1 py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-slate-400 disabled:opacity-40 hover:text-slate-200 transition-all"
        >
          DESELECT ALL
        </button>

        <button
          onClick={handleSubmit}
          disabled={selectedTiles.length !== 4}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 font-mono font-extrabold text-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.4)] disabled:opacity-40 hover:scale-105 transition-all"
        >
          SUBMIT (4/4)
        </button>
      </div>
    </div>
  );
};
