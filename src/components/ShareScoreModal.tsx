import React, { useState } from 'react';
import { Copy, Check, Share2, X } from 'lucide-react';

interface ShareScoreModalProps {
  isOpen: boolean;
  score: number;
  stars: number;
  emojiGrid: string;
  onClose: () => void;
}

export const ShareScoreModal: React.FC<ShareScoreModalProps> = ({
  isOpen,
  score,
  stars,
  emojiGrid,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `LOGIC LINK AI #42 🧠\nScore: ${score} pts • ${'★'.repeat(stars)}\n\n${emojiGrid}\n\nPlay at Logic Link Nexus!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] font-sans text-center">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
            <Share2 className="w-4 h-4" /> SHARE SCORECARD
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Emoji Grid Display Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-sm whitespace-pre-line text-cyan-300 mb-6 shadow-inner select-all">
          {shareText}
        </div>

        <button
          onClick={handleCopy}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-purple-600 font-mono font-extrabold text-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-102 transition-all flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
          {copied ? 'COPIED TO CLIPBOARD!' : 'COPY EMOJI SCORECARD'}
        </button>
      </div>
    </div>
  );
};
