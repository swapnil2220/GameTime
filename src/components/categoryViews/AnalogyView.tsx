import React from 'react';
import type { AnalogyShape } from '../../engine/categories/analogies';

interface AnalogyShapeSVGProps {
  shape: AnalogyShape | null;
  size?: number;
  label?: string;
  isQuestion?: boolean;
}

export const AnalogyShapeSVG: React.FC<AnalogyShapeSVGProps> = ({
  shape,
  size = 115,
  label,
  isQuestion = false,
}) => {
  if (isQuestion || !shape) {
    return (
      <div
        style={{ width: size, height: size }}
        className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-900/90 border-2 border-dashed border-cyan-400/60 shadow-[0_0_20px_rgba(0,243,255,0.2)] animate-pulse"
      >
        <span className="text-4xl font-extrabold text-cyan-400 font-mono">?</span>
        {label && <span className="text-[10px] font-mono text-cyan-400/80 mt-1 uppercase tracking-wider">{label}</span>}
      </div>
    );
  }

  const center = size / 2;
  const outerR = size * 0.36;
  const innerR = size * 0.18;

  const renderOuterPath = () => {
    if (shape.outerShape === 'circle') {
      return <circle cx={center} cy={center} r={outerR} fill={`${shape.outerColor}22`} stroke={shape.outerColor} strokeWidth="3.5" />;
    }
    if (shape.outerShape === 'square') {
      const s = outerR * 1.5;
      return <rect x={center - s / 2} y={center - s / 2} width={s} height={s} rx="10" fill={`${shape.outerColor}22`} stroke={shape.outerColor} strokeWidth="3.5" />;
    }
    if (shape.outerShape === 'triangle') {
      const pts = `${center},${center - outerR} ${center + outerR},${center + outerR * 0.85} ${center - outerR},${center + outerR * 0.85}`;
      return <polygon points={pts} fill={`${shape.outerColor}22`} stroke={shape.outerColor} strokeWidth="3.5" />;
    }
    if (shape.outerShape === 'pentagon') {
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        pts.push(`${center + outerR * Math.cos(angle)},${center + outerR * Math.sin(angle)}`);
      }
      return <polygon points={pts.join(' ')} fill={`${shape.outerColor}22`} stroke={shape.outerColor} strokeWidth="3.5" />;
    }
    return null;
  };

  const renderInnerPath = () => {
    if (shape.innerShape === 'dot') {
      return <circle cx={center} cy={center} r={innerR} fill={shape.innerColor} />;
    }
    if (shape.innerShape === 'diamond') {
      const pts = `${center},${center - innerR} ${center + innerR},${center} ${center},${center + innerR} ${center - innerR},${center}`;
      return <polygon points={pts} fill={shape.innerColor} />;
    }
    if (shape.innerShape === 'star') {
      const pts: string[] = [];
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? innerR : innerR * 0.45;
        const angle = (i * Math.PI) / 4;
        pts.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
      }
      return <polygon points={pts.join(' ')} fill={shape.innerColor} />;
    }
    if (shape.innerShape === 'cross') {
      const w = innerR * 0.4;
      const l = innerR;
      return (
        <path
          d={`M ${center - w},${center - l} H ${center + w} V ${center - w} H ${center + l} V ${center + w} H ${center + w} V ${center + l} H ${center - w} V ${center + w} H ${center - l} V ${center - w} H ${center - w} Z`}
          fill={shape.innerColor}
        />
      );
    }
    return null;
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-900/80 border border-slate-700/80 p-2 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,243,255,0.25)] hover:scale-105"
    >
      <svg
        width={size - 16}
        height={size - 16}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${shape.rotation}deg)` }}
      >
        <g style={{ filter: `drop-shadow(0 0 8px ${shape.outerColor}99)` }}>
          {renderOuterPath()}
          {renderInnerPath()}
        </g>
      </svg>
      {label && <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">{label}</span>}
    </div>
  );
};
