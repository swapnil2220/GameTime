import React, { useRef, useEffect, useState } from 'react';
import { X, Copy, Check, Download, Share2, Sparkles } from 'lucide-react';
import type { UserProfile } from '../types/game';

interface ShareScoreModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  emojiGrid?: string;
  activeUser: UserProfile;
  onClose: () => void;
}

export const ShareScoreModal: React.FC<ShareScoreModalProps> = ({
  isOpen,
  score,
  stars,
  emojiGrid,
  activeUser,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const starString = '⭐'.repeat(stars) + '░'.repeat(3 - stars);
  const shareText = `LOGIC LINK: AI NEXUS 🧠
Player: ${activeUser.avatar} ${activeUser.username}
Score: ${score} | Rating: ${starString}
${emojiGrid ? `\n${emojiGrid}\n` : ''}
Play live at https://swapnil2220.github.io/GameTime/`;

  useEffect(() => {
    if (!isOpen) return;

    // Render HTML5 Canvas Scorecard
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 450;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Obsidian Slate)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing border
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Inner Gold Accent Line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Header Title
    ctx.font = '900 28px monospace';
    ctx.fillStyle = '#00f3ff';
    ctx.fillText('LOGIC LINK: AI NEXUS', 45, 65);

    ctx.font = '600 14px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('COGNITIVE PERFORMANCE SCORECARD', 45, 90);

    // User Avatar & Name Card
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(45, 120, 320, 100, 16);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.font = '40px sans-serif';
    ctx.fillText(activeUser.avatar || '⚡', 65, 182);

    ctx.font = '800 20px monospace';
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText(activeUser.username.substring(0, 14), 130, 165);

    ctx.font = '600 13px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`STREAK: ${activeUser.dailyStreak || 1} DAYS 🔥`, 130, 190);

    // Score Banner Card
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(390, 120, 365, 100, 16);
    ctx.fill();
    ctx.strokeStyle = '#00f3ff';
    ctx.stroke();

    ctx.font = '600 13px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('STAGE SCORE', 415, 150);

    ctx.font = '900 36px monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`+${score}`, 415, 195);

    ctx.font = '30px sans-serif';
    ctx.fillText(starString, 630, 185);

    // Mini Mind Matrix Stats Bar
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(45, 245, 710, 140, 16);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    ctx.font = '700 14px monospace';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('COGNITIVE SKILL INDEX', 65, 275);

    const matrix = activeUser.mindMatrix || {
      patternRecognition: 50,
      spatialReasoning: 50,
      verbalFluency: 50,
      deductiveLogic: 50,
      mathematicalAgility: 50,
      speedReflexes: 50,
    };

    const statsList = [
      { label: 'PATTERN', val: matrix.patternRecognition },
      { label: 'SPATIAL', val: matrix.spatialReasoning },
      { label: 'VERBAL', val: matrix.verbalFluency },
      { label: 'LOGIC', val: matrix.deductiveLogic },
      { label: 'MATH', val: matrix.mathematicalAgility },
      { label: 'REFLEX', val: matrix.speedReflexes },
    ];

    statsList.forEach((stat, i) => {
      const x = 65 + i * 112;
      const y = 300;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x, y, 98, 65, 10);
      ctx.fill();

      ctx.font = '600 10px monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(stat.label, x + 10, y + 25);

      ctx.font = '800 16px monospace';
      ctx.fillStyle = '#00f3ff';
      ctx.fillText(`${stat.val}/100`, x + 10, y + 50);
    });

    // Footer URL
    ctx.font = '500 12px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText('https://swapnil2220.github.io/GameTime/', 45, 415);

    setCardDataUrl(canvas.toDataURL('image/png'));
  }, [isOpen, score, stars, activeUser]);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCard = () => {
    if (!cardDataUrl) return;
    const a = document.createElement('a');
    a.href = cardDataUrl;
    a.download = `LogicLink_${activeUser.username}_Scorecard.png`;
    a.click();
  };

  const handleShareImage = async () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob(async (blob) => {
      if (blob && navigator.share && navigator.canShare) {
        const file = new File([blob], 'scorecard.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Logic Link Scorecard',
              text: shareText,
              files: [file],
            });
            return;
          } catch (e) {
            // Fallback to text copy
          }
        }
      }
      handleDownloadCard();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-black font-mono tracking-wider text-slate-100">
            SHARE SCORECARD
          </h2>
        </div>

        {/* Render Hidden Canvas & Visual Preview */}
        <canvas ref={canvasRef} className="hidden" />

        {cardDataUrl && (
          <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl mb-4">
            <img src={cardDataUrl} alt="Scorecard Preview" className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Text Emoji Scorecard Preview */}
        <div className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-line mb-6">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <button
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-slate-200 hover:border-cyan-400 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            {copied ? 'TEXT COPIED!' : 'COPY EMOJI TEXT'}
          </button>

          <button
            onClick={handleDownloadCard}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 border border-slate-700 font-mono text-xs font-bold text-slate-200 hover:border-amber-400 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" /> DOWNLOAD PNG
          </button>

          <button
            onClick={handleShareImage}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 font-mono font-black text-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-105 transition-all"
          >
            <Share2 className="w-4 h-4" /> SHARE CARD
          </button>
        </div>
      </div>
    </div>
  );
};
