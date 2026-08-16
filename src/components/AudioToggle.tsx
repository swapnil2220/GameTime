import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../engine/sound';

interface AudioToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export const AudioToggle: React.FC<AudioToggleProps> = ({ enabled, onChange }) => {
  const toggle = () => {
    const next = !enabled;
    sound.enabled = next;
    if (next) sound.playClick();
    onChange(next);
  };

  return (
    <button
      onClick={toggle}
      className={`p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 ${
        enabled
          ? 'bg-slate-900/80 border-cyan-500/50 text-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.2)] hover:border-cyan-400'
          : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-400'
      }`}
      title={enabled ? 'Mute Audio SFX' : 'Enable Audio SFX'}
    >
      {enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};
