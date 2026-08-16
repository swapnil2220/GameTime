import React from 'react';
import type { CountryMapData } from '../../engine/categories/geography';
import { Globe, MapPin } from 'lucide-react';

interface GeographyViewProps {
  country: CountryMapData;
  questionText: string;
}

export const GeographyView: React.FC<GeographyViewProps> = ({ country, questionText }) => {
  const renderSVGCountryOutline = () => {
    switch (country.svgShapeKey) {
      case 'japan':
        return (
          <path
            d="M 60,30 C 70,20 90,40 100,50 C 110,65 130,80 140,100 C 145,115 130,130 115,120 C 95,100 80,70 60,30 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'italy':
        return (
          <path
            d="M 40,20 L 90,30 L 110,60 L 130,110 L 150,140 L 135,150 L 115,125 L 90,90 L 70,50 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'brazil':
        return (
          <path
            d="M 50,30 Q 120,10 150,60 Q 160,110 110,140 Q 60,150 40,90 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'india':
        return (
          <path
            d="M 80,20 L 130,30 L 140,70 L 100,150 L 60,70 L 70,30 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'australia':
        return (
          <path
            d="M 30,50 Q 80,20 150,40 Q 170,90 140,120 Q 80,140 40,100 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'france':
        return (
          <polygon
            points="90,20 140,40 150,100 100,140 40,110 50,50"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl w-full flex flex-col items-center shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest mb-3">
          <Globe className="w-4 h-4" /> GEOGRAPHY CHALLENGE
        </div>

        {/* Vector SVG Map Container */}
        <div className="w-48 h-48 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-center p-4 shadow-[0_0_20px_rgba(0,243,255,0.15)] mb-4">
          <svg width="160" height="160" viewBox="0 0 180 180">
            <defs>
              <linearGradient id="geo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <g style={{ filter: 'drop-shadow(0 0 8px #00f3ff88)' }}>{renderSVGCountryOutline()}</g>
          </svg>
        </div>

        <p className="text-base font-black font-mono text-cyan-300 text-center tracking-wide flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" /> {questionText}
        </p>
      </div>
    </div>
  );
};
