import React from 'react';

export interface AnalogyShape {
  outerShape?: 'circle' | 'square' | 'triangle' | 'pentagon' | 'hexagon' | string;
  innerShape?: 'star' | 'diamond' | 'cross' | 'dot' | string;
  outerColor?: string;
  innerColor?: string;
  rotation?: number;
}

interface AnalogyShapeSVGProps {
  shape: AnalogyShape | string | null;
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

  // Parse if string vs object
  let parsedShape: AnalogyShape;
  if (typeof shape === 'string') {
    const lower = shape.toLowerCase();
    const outerShape = lower.includes('triangle')
      ? 'triangle'
      : lower.includes('square')
      ? 'square'
      : lower.includes('pentagon')
      ? 'pentagon'
      : lower.includes('hexagon')
      ? 'hexagon'
      : 'circle';

    const innerShape = lower.includes('star')
      ? 'star'
      : lower.includes('diamond')
      ? 'diamond'
      : lower.includes('cross')
      ? 'cross'
      : 'dot';

    parsedShape = {
      outerShape,
      innerShape,
      outerColor: '#00f3ff',
      innerColor: '#a855f7',
      rotation: lower.includes('rotate') ? 45 : 0,
    };
  } else {
    parsedShape = {
      outerShape: shape.outerShape || 'circle',
      innerShape: shape.innerShape || 'dot',
      outerColor: shape.outerColor || '#00f3ff',
      innerColor: shape.innerColor || '#a855f7',
      rotation: shape.rotation || 0,
    };
  }

  const center = size / 2;
  const outerR = size * 0.36;
  const innerR = size * 0.18;
  const outerColor = parsedShape.outerColor || '#00f3ff';
  const innerColor = parsedShape.innerColor || '#a855f7';

  const renderOuterPath = () => {
    const oShape = parsedShape.outerShape?.toLowerCase();
    if (oShape === 'circle') {
      return <circle cx={center} cy={center} r={outerR} fill={`${outerColor}22`} stroke={outerColor} strokeWidth="3.5" />;
    }
    if (oShape === 'square') {
      const s = outerR * 1.5;
      return <rect x={center - s / 2} y={center - s / 2} width={s} height={s} rx="10" fill={`${outerColor}22`} stroke={outerColor} strokeWidth="3.5" />;
    }
    if (oShape === 'triangle') {
      const pts = `${center},${center - outerR} ${center + outerR},${center + outerR * 0.85} ${center - outerR},${center + outerR * 0.85}`;
      return <polygon points={pts} fill={`${outerColor}22`} stroke={outerColor} strokeWidth="3.5" />;
    }
    if (oShape === 'pentagon' || oShape === 'hexagon') {
      const sides = oShape === 'hexagon' ? 6 : 5;
      const pts: string[] = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
        pts.push(`${center + outerR * Math.cos(angle)},${center + outerR * Math.sin(angle)}`);
      }
      return <polygon points={pts.join(' ')} fill={`${outerColor}22`} stroke={outerColor} strokeWidth="3.5" />;
    }
    return <circle cx={center} cy={center} r={outerR} fill={`${outerColor}22`} stroke={outerColor} strokeWidth="3.5" />;
  };

  const renderInnerPath = () => {
    const iShape = parsedShape.innerShape?.toLowerCase();
    if (iShape === 'dot') {
      return <circle cx={center} cy={center} r={innerR} fill={innerColor} />;
    }
    if (iShape === 'diamond') {
      const pts = `${center},${center - innerR} ${center + innerR},${center} ${center},${center + innerR} ${center - innerR},${center}`;
      return <polygon points={pts} fill={innerColor} />;
    }
    if (iShape === 'star') {
      const pts: string[] = [];
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? innerR : innerR * 0.45;
        const angle = (i * Math.PI) / 4;
        pts.push(`${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`);
      }
      return <polygon points={pts.join(' ')} fill={innerColor} />;
    }
    if (iShape === 'cross') {
      const w = innerR * 0.4;
      const l = innerR;
      return (
        <path
          d={`M ${center - w},${center - l} H ${center + w} V ${center - w} H ${center + l} V ${center + w} H ${center + w} V ${center + l} H ${center - w} V ${center + w} H ${center - l} V ${center - w} H ${center - w} Z`}
          fill={innerColor}
        />
      );
    }
    return <circle cx={center} cy={center} r={innerR} fill={innerColor} />;
  };

  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex flex-col items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,243,255,0.3)] hover:scale-105"
    >
      <svg
        width={size - 16}
        height={size - 16}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${parsedShape.rotation || 0}deg)` }}
      >
        <g style={{ filter: `drop-shadow(0 0 8px ${outerColor}99)` }}>
          {renderOuterPath()}
          {renderInnerPath()}
        </g>
      </svg>
      {label && <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">{label}</span>}
    </div>
  );
};
