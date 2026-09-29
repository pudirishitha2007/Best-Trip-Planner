import React, { useState } from 'react';
import { TravelOffer } from '../types/trip';
import { Tag, Check, Copy, Sparkles, Gift } from 'lucide-react';

interface OffersSectionProps {
  offers: TravelOffer[];
}

export const OffersSection: React.FC<OffersSectionProps> = ({ offers }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" />
            <h3 className="font-display text-xl font-bold text-slate-900">
              Verified Travel Deals & Promo Offers
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Exclusive partner savings for cabs, outstation return trips, farm tastings, and express passes:
          </p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
          Active Promo Codes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {offers.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.id}
              className="bg-slate-50 hover:bg-slate-100/60 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3 transition-colors relative overflow-hidden"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  {offer.category}
                </span>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-slate-900 text-sm">{offer.title}</h4>
                  <span className="font-extrabold text-amber-600 text-sm">{offer.discount}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>{offer.code}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
