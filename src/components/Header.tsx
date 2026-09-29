import React from 'react';
import { Logo } from './Logo';
import { Sparkles, Compass } from 'lucide-react';

interface HeaderProps {
  onNavClick: (view: 'search' | 'oneday' | 'map' | 'offers') => void;
  onOpenAIModal: () => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  activeNav: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onOpenAIModal,
  currency,
  onCurrencyChange,
  activeNav,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark brand lockup with logo */}
        <button
          onClick={() => onNavClick('search')}
          className="flex items-center text-left hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-sky-500 rounded-lg"
          aria-label="Best Trip Planner Home"
        >
          <Logo size="md" />
        </button>

        {/* Zone 2: 4-6 Clean text navigation links with hover states */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavClick('search')}
            className={`transition-colors hover:text-slate-900 pb-0.5 ${
              activeNav === 'search'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : ''
            }`}
          >
            Trip Planner
          </button>
          <button
            onClick={() => onNavClick('oneday')}
            className={`transition-colors hover:text-slate-900 pb-0.5 flex items-center gap-1.5 ${
              activeNav === 'oneday'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : ''
            }`}
          >
            <span>One-Day Mode</span>
            <span className="text-[10px] text-amber-700 font-semibold">⭐ Same-Day Return</span>
          </button>
          <button
            onClick={() => onNavClick('map')}
            className={`transition-colors hover:text-slate-900 pb-0.5 flex items-center gap-1 ${
              activeNav === 'map'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            <span>Guided Map</span>
          </button>
          <button
            onClick={() => onNavClick('offers')}
            className={`transition-colors hover:text-slate-900 pb-0.5 ${
              activeNav === 'offers'
                ? 'text-sky-600 font-semibold border-b-2 border-sky-600'
                : ''
            }`}
          >
            Special Offers & Deals
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions & Currency selector */}
        <div className="flex items-center gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg p-1 border border-slate-200">
            {(['₹', '$', '€', '£'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onCurrencyChange(curr)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  currency === curr
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* AI Travel Agent Button */}
          <button
            type="button"
            onClick={onOpenAIModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all active:scale-95 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Best Trip AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
