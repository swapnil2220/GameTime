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
      case 'canada':
        return (
          <path
            d="M 20,40 Q 90,10 160,30 Q 170,80 130,120 Q 70,140 30,90 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'egypt':
        return (
          <polygon
            points="40,30 140,30 140,130 40,130"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'germany':
        return (
          <polygon
            points="70,20 120,30 130,80 110,130 50,120 40,70"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'spain':
        return (
          <polygon
            points="50,30 130,25 140,100 100,140 40,120"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'argentina':
        return (
          <path
            d="M 70,20 L 110,30 L 95,90 L 80,150 L 65,130 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'mexico':
        return (
          <path
            d="M 30,40 Q 100,30 150,80 Q 120,120 80,100 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'south_korea':
        return (
          <path
            d="M 70,30 C 90,20 110,40 100,70 C 90,100 70,120 60,90 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'uk':
        return (
          <path
            d="M 80,20 C 100,30 90,70 110,100 C 90,130 60,110 70,60 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'greece':
        return (
          <polygon
            points="60,30 110,35 120,80 90,120 50,90"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'kenya':
        return (
          <polygon
            points="60,30 120,40 130,100 80,130 40,80"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'norway':
        return (
          <path
            d="M 120,20 C 110,50 80,90 60,140 C 50,110 70,60 90,30 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'thailand':
        return (
          <path
            d="M 80,20 Q 120,30 110,80 L 80,150 L 70,90 Z"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'south_africa':
        return (
          <polygon
            points="40,40 140,40 120,120 60,120"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      case 'peru':
        return (
          <polygon
            points="40,30 100,20 120,90 70,140 30,80"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
      default:
        return (
          <circle
            cx="90"
            cy="90"
            r="60"
            fill="url(#geo-grad)"
            stroke="#00f3ff"
            strokeWidth="3"
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg my-4 font-sans">
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
