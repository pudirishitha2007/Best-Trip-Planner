import React from 'react';
import { travelImages } from '../assets/images';
import { ArrowRight, ShieldCheck, Compass, Sparkles, UtensilsCrossed } from 'lucide-react';

interface HeroSectionProps {
  onQuickSelect: (origin: string, destination: string, isOneDay: boolean) => void;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickSelect,
  onScrollToForm,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-14 lg:py-20">
      {/* Background Graphic with Scrim */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000 ease-out">
        <img
          src={travelImages.hero}
          alt="Scenic World Travel Vista"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-sky-950/80 border border-sky-800/80 text-sky-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Intelligent AI Travel Engine · 100% Tailored</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Best Trip <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">Planner</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium text-slate-200">
                “Your AI Travel Agent – Plan Better, Travel Smarter.”
              </p>
            </div>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Whether you have just one free day or an entire week, generate complete travel plans calibrated to your exact origin, budget, transport options, and dining tastes. Guaranteed same-day return routes with zero hotel waste.
            </p>

            {/* Quick Guarantees Adjacency */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Return Guarantee</strong>
                  <span>Calculated return buffer for 1-day trips</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
                <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Guided Route Map</strong>
                  <span>Door-to-door transit & cab directions</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl col-span-2 sm:col-span-1">
                <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold">Farm & Local Food</strong>
                  <span>Organic markets & authentic regional fare</span>
                </div>
              </div>
            </div>

            {/* Popular One-Day Escapes */}
            <div className="pt-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Popular Quick Escapes:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { origin: 'New Delhi', destination: 'Agra', label: 'Delhi ➔ Agra (Same Day Taj)', oneDay: true },
                  { origin: 'Mumbai', destination: 'Lonavala', label: 'Mumbai ➔ Lonavala (Caves & Falls)', oneDay: true },
                  { origin: 'Bengaluru', destination: 'Mysuru', label: 'Bangalore ➔ Mysore (Palace Day)', oneDay: true },
                  { origin: 'San Francisco', destination: 'Napa Valley', label: 'SF ➔ Napa Valley (Farms)', oneDay: true },
                  { origin: 'London', destination: 'Cotswolds', label: 'London ➔ Cotswolds (Villages)', oneDay: true },
                ].map((escape, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickSelect(escape.origin, escape.destination, escape.oneDay)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>{escape.label}</span>
                    <ArrowRight className="w-3 h-3 text-sky-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onScrollToForm}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span>Start Planning Your Trip</span>
                <span className="text-xl">✈️</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Trip Card Previews */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
              <img
                src={travelImages.heritage}
                alt="Heritage Landmark"
                className="w-full h-56 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">⭐ ONE-DAY TRIP SPECIALIST</span>
                  <span>Same-Day Return Verified</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  The One Best Place Philosophy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Avoid overcrowded, exhausting multi-stop rush. Our intelligent engine pinpoints the single most suitable landmark with full transport, dining, and return buffer.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-700 text-xs text-slate-300">
                  <span>🚗 Zero hotel costs needed</span>
                  <span className="text-emerald-400 font-semibold">100% Home Tonight</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                <img
                  src={travelImages.farmDining}
                  alt="Farm to Table Dining"
                  className="w-full h-24 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5">
                  <span className="block text-xs font-semibold text-white">Local & Farm Food</span>
                  <span className="text-[11px] text-slate-400">Farmers markets & fresh produce</span>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                <img
                  src={travelImages.roadTravel}
                  alt="Scenic Road Travel"
                  className="w-full h-24 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5">
                  <span className="block text-xs font-semibold text-white">Cabs & Transit Route</span>
                  <span className="text-[11px] text-slate-400">Step-by-step route directions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
