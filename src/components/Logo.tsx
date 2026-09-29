import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-[11px]' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Unified Symbol: Globe + Airplane + Pin + Suitcase */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={currentSize.icon}
          height={currentSize.icon}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-3"
        >
          <defs>
            <linearGradient id="globeGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="planeGrad" x1="30" y1="8" x2="54" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="caseGrad" x1="20" y1="36" x2="44" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="1" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* 1. Globe Base Circle */}
          <circle cx="32" cy="32" r="26" fill="url(#globeGrad)" />

          {/* Globe Meridians and Parallels */}
          <ellipse cx="32" cy="32" rx="14" ry="25.5" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.65" />
          <line x1="6.5" y1="32" x2="57.5" y2="32" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
          <path d="M12 20 Q32 25 52 20" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.4" />
          <path d="M12 44 Q32 39 52 44" stroke="#38bdf8" strokeWidth="1.2" fill="none" opacity="0.4" />

          {/* 2. Suitcase Base (🧳) at lower center of the globe */}
          <rect x="22" y="34" width="20" height="15" rx="3" fill="url(#caseGrad)" stroke="#b45309" strokeWidth="1.5" />
          {/* Suitcase Handle */}
          <path d="M28 34 V30 C28 28.5 29.5 27.5 32 27.5 C34.5 27.5 36 28.5 36 30 V34" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Suitcase Straps */}
          <line x1="27" y1="34" x2="27" y2="49" stroke="#78350f" strokeWidth="1.2" />
          <line x1="37" y1="34" x2="37" y2="49" stroke="#78350f" strokeWidth="1.2" />

          {/* 3. Location Pin (📍) at the top vertex */}
          <path
            d="M32 6 C26.5 6 22 10.5 22 16 C22 23 32 32 32 32 C32 32 42 23 42 16 C42 10.5 37.5 6 32 6 Z"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="15" r="3.5" fill="#ffffff" />

          {/* 4. Airplane (✈️) soaring on an orbital trajectory */}
          <path
            d="M8 44 C12 22 28 10 50 14"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeDasharray="4 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* Jet geometry */}
          <path
            d="M50 14 L42 10 L44 14 L36 15 L35 13 L33 13.5 L34 16.5 L44 18 L43 23 L47 21 L53 25 L55 24 L52 18 L58 16 Z"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight text-slate-900 ${currentSize.text}`}>
              Best Trip <span className="text-sky-600">Planner</span>
            </span>
          </div>
          <span className={`font-medium tracking-wide text-slate-500 uppercase ${currentSize.sub}`}>
            Plan Better · Travel Smarter
          </span>
        </div>
      )}
    </div>
  );
};
