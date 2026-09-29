import React from 'react';
import { Logo } from './Logo';
import { Shield, PhoneCall, Info } from 'lucide-react';

interface FooterProps {
  onNavClick: (view: 'search' | 'oneday' | 'map' | 'offers') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Wordmark & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" />
            <p className="text-slate-400 text-xs leading-relaxed">
              “Your AI Travel Agent – Plan Better, Travel Smarter.”
              Dedicated to intelligent itinerary design, verified same-day return guarantees, and transparent budgeting.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-[11px]">
              Explore
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavClick('search')}
                  className="hover:text-white transition-colors"
                >
                  Trip Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('oneday')}
                  className="hover:text-white transition-colors"
                >
                  One-Day Trip Specialist
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('map')}
                  className="hover:text-white transition-colors"
                >
                  Guided Route Maps
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('offers')}
                  className="hover:text-white transition-colors"
                >
                  Offers & Promo Codes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Data Accuracy & Safety */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-[11px]">
              Data Accuracy Policy
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Information is explicitly tagged as <strong>LIVE</strong> or <strong>ESTIMATED</strong> based on live transport queries. International travelers must verify entry regulations with official government consulates.
            </p>
            <div className="pt-1 flex items-center gap-2 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Same-Day Return Buffer Guarantee</span>
            </div>
          </div>

          {/* Col 4: Emergency Contacts */}
          <div className="space-y-2">
            <span className="font-semibold text-white uppercase tracking-wider block text-[11px]">
              Emergency Information
            </span>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-200">
                <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-bold">Tourist Support: 1363 / 112</span>
              </div>
              <p className="text-slate-400">Available 24x7 for intercity assistance</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Best Trip Planner. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-medium">LIVE · ESTIMATED · LAST UPDATED</span>
            <span>Privacy Policy</span>
            <span>Terms of Travel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
