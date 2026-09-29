import React, { useState, useEffect } from 'react';
import { TripPlan, TripSearchParams, TravelOffer } from './types/trip';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchForm } from './components/SearchForm';
import { OneDayDashboard } from './components/OneDayDashboard';
import { MultiDayDashboard } from './components/MultiDayDashboard';
import { BestTripAIChat } from './components/BestTripAIChat';
import { OffersSection } from './components/OffersSection';
import { Footer } from './components/Footer';
import { Sparkles, Printer, Share2, Compass, ArrowUp, Check } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState<string>('₹');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [activeNav, setActiveNav] = useState<string>('search');
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [aiChatInitialQuery, setAIChatInitialQuery] = useState<string | undefined>(undefined);
  const [offers, setOffers] = useState<TravelOffer[]>([]);
  const [searchParams, setSearchParams] = useState<TripSearchParams>({
    destination: 'Agra',
    origin: 'New Delhi',
    tripType: 'one-day',
    days: 1,
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    travelers: 2,
    budget: 6000,
    currency: '₹',
    hasCar: false,
    needsCab: true,
    rentCar: false,
    hotelPreference: 'No Hotel',
    foodPreference: 'Local cuisine & Indian vegetarian',
    travelStyle: 'Express & Scenic',
    onlyOneBestPlace: true,
  });

  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch initial plan and offers on mount
  useEffect(() => {
    fetchInitialPlan(searchParams);
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (data.offers) setOffers(data.offers);
    } catch (err) {
      console.warn('Failed to load offers:', err);
    }
  };

  const fetchInitialPlan = async (params: TripSearchParams) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, currency }),
      });
      const data = await res.json();
      setCurrentPlan(data);
    } catch (err) {
      console.error('Plan fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (newParams: TripSearchParams) => {
    setSearchParams(newParams);
    fetchInitialPlan(newParams);
    // Smooth scroll down to dashboard
    const dashElement = document.getElementById('trip-dashboard');
    if (dashElement) {
      dashElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickSelect = (origin: string, destination: string, isOneDay: boolean) => {
    const updated: TripSearchParams = {
      ...searchParams,
      origin,
      destination,
      tripType: isOneDay ? 'one-day' : 'multi-day',
      days: isOneDay ? 1 : 3,
      onlyOneBestPlace: true,
    };
    setSearchParams(updated);
    fetchInitialPlan(updated);
    const searchElement = document.getElementById('search-section');
    searchElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToForm = () => {
    const formElement = document.getElementById('search-section');
    formElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (view: 'search' | 'oneday' | 'map' | 'offers') => {
    setActiveNav(view);
    if (view === 'search') {
      document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'oneday') {
      const updated: TripSearchParams = {
        ...searchParams,
        tripType: 'one-day',
        days: 1,
        onlyOneBestPlace: true,
        hotelPreference: 'No Hotel',
      };
      setSearchParams(updated);
      fetchInitialPlan(updated);
      document.getElementById('trip-dashboard')?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'map') {
      document.getElementById('trip-dashboard')?.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'offers') {
      document.getElementById('offers-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAI = (query?: string) => {
    setAIChatInitialQuery(query);
    setIsAIChatOpen(true);
  };

  const handleApplyAIAction = (action: string) => {
    if (action === 'switch_to_one_day') {
      const updated: TripSearchParams = {
        ...searchParams,
        tripType: 'one-day',
        days: 1,
        onlyOneBestPlace: true,
      };
      setSearchParams(updated);
      fetchInitialPlan(updated);
    } else if (action === 'switch_to_multi_day') {
      const updated: TripSearchParams = {
        ...searchParams,
        tripType: 'multi-day',
        days: 3,
        onlyOneBestPlace: false,
      };
      setSearchParams(updated);
      fetchInitialPlan(updated);
    } else if (action === 'reduce_budget') {
      const updated: TripSearchParams = {
        ...searchParams,
        budget: Math.round(searchParams.budget * 0.75),
      };
      setSearchParams(updated);
      fetchInitialPlan(updated);
    } else if (action === 'find_cab') {
      const updated: TripSearchParams = {
        ...searchParams,
        hasCar: false,
        needsCab: true,
      };
      setSearchParams(updated);
      fetchInitialPlan(updated);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onNavClick={handleNavClick}
        onOpenAIModal={() => handleOpenAI()}
        currency={currency}
        onCurrencyChange={(c) => {
          setCurrency(c);
          if (currentPlan) {
            fetchInitialPlan({ ...searchParams, currency: c });
          }
        }}
        activeNav={activeNav}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onQuickSelect={handleQuickSelect}
          onScrollToForm={handleScrollToForm}
        />

        {/* Master Search Form */}
        <SearchForm
          onSearch={handleSearchSubmit}
          isLoading={isLoading}
          initialParams={searchParams}
          currency={currency}
        />

        {/* Dashboard Area */}
        <div id="trip-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 space-y-12">
          {isLoading && (
            <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Best Trip AI is Architecting Your Journey
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Calculating road travel distances, same-day return buffer, farm food markets, and optimizing your budget...
                </p>
              </div>
            </div>
          )}

          {!isLoading && currentPlan && (
            <div className="space-y-8">
              {/* Trip Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-sm text-slate-900">
                    YOUR BEST TRIP PLAN: {currentPlan.destination}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">
                    {currentPlan.tripType === 'one-day' ? 'One-Day Trip (Same-Day Return)' : 'Multiple-Day Journey'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={handleShare}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link!' : 'Share'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Plan</span>
                  </button>

                  <button
                    onClick={() => handleOpenAI()}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>AI Assistant</span>
                  </button>
                </div>
              </div>

              {/* Mode-specific Dashboard View */}
              {currentPlan.tripType === 'one-day' ? (
                <OneDayDashboard
                  plan={currentPlan}
                  onModifySearch={handleScrollToForm}
                  onOpenAI={handleOpenAI}
                  currency={currency}
                />
              ) : (
                <MultiDayDashboard
                  plan={currentPlan}
                  onModifySearch={handleScrollToForm}
                  onOpenAI={handleOpenAI}
                  currency={currency}
                />
              )}
            </div>
          )}

          {/* Offers & Deals Section */}
          <div id="offers-section">
            <OffersSection offers={offers} />
          </div>
        </div>
      </main>

      {/* Persistent Floating AI Agent Trigger (Mobile / Quick access) */}
      <button
        onClick={() => handleOpenAI()}
        className="fixed bottom-6 right-6 z-40 p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group"
        aria-label="Open Best Trip AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="block font-bold text-xs">Best Trip AI</span>
          <span className="block text-[10px] text-slate-400">Ask your travel agent</span>
        </div>
      </button>

      {/* Best Trip AI Assistant Modal / Drawer */}
      <BestTripAIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentPlan={currentPlan}
        onApplyPlanAction={handleApplyAIAction}
        initialQuery={aiChatInitialQuery}
      />

      {/* Footer */}
      <Footer onNavClick={handleNavClick} />
    </div>
  );
}
