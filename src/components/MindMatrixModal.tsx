import React from 'react';
import type { UserProfile } from '../types/game';
import { Brain, X, ShieldAlert, Zap, Compass, Type, Calculator, Sparkles } from 'lucide-react';

interface MindMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserProfile;
}

export const MindMatrixModal: React.FC<MindMatrixModalProps> = ({ isOpen, onClose, activeUser }) => {
  if (!isOpen) return null;

  const stats = activeUser.mindMatrix || {
    patternRecognition: 50,
    spatialReasoning: 50,
    verbalFluency: 50,
    deductiveLogic: 50,
    mathematicalAgility: 50,
    speedReflexes: 50,
  };

  const axes = [
    { key: 'patternRecognition', label: 'Pattern Recognition', val: stats.patternRecognition, icon: Sparkles, color: '#00f3ff' },
    { key: 'spatialReasoning', label: 'Spatial Reasoning', val: stats.spatialReasoning, icon: Compass, color: '#a855f7' },
    { key: 'verbalFluency', label: 'Verbal Fluency', val: stats.verbalFluency, icon: Type, color: '#ec4899' },
    { key: 'deductiveLogic', label: 'Deductive Logic', val: stats.deductiveLogic, icon: ShieldAlert, color: '#f59e0b' },
    { key: 'mathematicalAgility', label: 'Math Agility', val: stats.mathematicalAgility, icon: Calculator, color: '#10b981' },
    { key: 'speedReflexes', label: 'Speed & Reflexes', val: stats.speedReflexes, icon: Zap, color: '#3b82f6' },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * (2 * Math.PI)) / 6 - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = axes.map((axis, i) => getCoordinates(i, axis.val));
  const dataPolygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const overallRating = Math.round(
    axes.reduce((acc, a) => acc + a.val, 0) / axes.length
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-sans animate-fadeIn">
      <div className="relative w-full max-w-xl p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black font-mono tracking-wider text-slate-100">
              COGNITIVE MIND MATRIX
            </h2>
            <p className="text-xs font-mono text-slate-400">
              PLAYER: <span className="text-cyan-400 font-bold">{activeUser.username}</span>
            </p>
          </div>
        </div>

        {/* 6-Axis Radar SVG */}
        <div className="relative my-4 flex items-center justify-center">
          <svg width={size} height={size} className="overflow-visible">
            <defs>
              <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.45" />
              </linearGradient>
            </defs>

            {/* Concentric grid webs */}
            {gridLevels.map((level, lvlIdx) => {
              const pts = axes
                .map((_, i) => {
                  const coords = getCoordinates(i, level * 100);
                  return `${coords.x},${coords.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvlIdx}
                  points={pts}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray={lvlIdx === gridLevels.length - 1 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Axis spokes */}
            {axes.map((_, i) => {
              const outer = getCoordinates(i, 100);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#334155"
                  strokeWidth="1"
                />
              );
            })}

            {/* Data Polygon Area */}
            <polygon
              points={dataPolygonPoints}
              fill="url(#radarGrad)"
              stroke="#00f3ff"
              strokeWidth="2.5"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,243,255,0.4))' }}
            />

            {/* Node dots */}
            {dataPoints.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill={axes[i].color}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
            ))}
          </svg>

          {/* Center Overall Rating Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-[10px] font-mono text-slate-400">IQ INDEX</span>
            <span className="text-xl font-black font-mono text-amber-400">{overallRating}</span>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full mt-2">
          {axes.map((axis, idx) => {
            const IconComponent = axis.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <IconComponent className="w-3.5 h-3.5" style={{ color: axis.color }} />
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{axis.label}</span>
                </div>
                <span className="text-base font-black font-mono text-slate-100">{axis.val}/100</span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] font-mono text-slate-500 mt-4 text-center">
          Ratings automatically calibrate based on accuracy, response time, and campaign/blitz performance.
        </p>
      </div>
    </div>
  );
};
