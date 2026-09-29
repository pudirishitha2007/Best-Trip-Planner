import React, { useState } from 'react';
import { TripSearchParams } from '../types/trip';
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Car,
  Compass,
  Utensils,
  Building,
  CheckCircle2,
  Sparkles,
  Plane,
  AlertCircle
} from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: TripSearchParams) => void;
  isLoading: boolean;
  initialParams?: Partial<TripSearchParams>;
  currency: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  isLoading,
  initialParams,
  currency,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [destination, setDestination] = useState(initialParams?.destination || 'Agra');
  const [origin, setOrigin] = useState(initialParams?.origin || 'New Delhi');
  const [tripType, setTripType] = useState<'one-day' | 'multi-day'>(initialParams?.tripType || 'one-day');
  const [days, setDays] = useState<number>(initialParams?.days || 1);
  const [startDate, setStartDate] = useState(initialParams?.startDate || tomorrow);
  const [returnDate, setReturnDate] = useState(initialParams?.returnDate || tomorrow);
  const [travelers, setTravelers] = useState<number>(initialParams?.travelers || 2);
  const [budget, setBudget] = useState<number>(initialParams?.budget || 6000);
  const [hotelPreference, setHotelPreference] = useState(initialParams?.hotelPreference || 'No Hotel (Same Day Return)');
  const [foodPreference, setFoodPreference] = useState(initialParams?.foodPreference || 'Local cuisine & Indian vegetarian');
  const [travelStyle, setTravelStyle] = useState(initialParams?.travelStyle || 'Express & Scenic');
  const [hasCar, setHasCar] = useState<boolean>(initialParams?.hasCar ?? false);
  const [needsCab, setNeedsCab] = useState<boolean>(initialParams?.needsCab ?? true);
  const [rentCar, setRentCar] = useState<boolean>(initialParams?.rentCar ?? false);
  const [onlyOneBestPlace, setOnlyOneBestPlace] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync when trip type changes
  const handleTripTypeChange = (type: 'one-day' | 'multi-day') => {
    setTripType(type);
    if (type === 'one-day') {
      setDays(1);
      setReturnDate(startDate);
      setHotelPreference('No Hotel (Same Day Return)');
      setOnlyOneBestPlace(true);
    } else {
      if (days <= 1) setDays(3);
      setHotelPreference('Comfort Boutique / 3-Star');
      const nextDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
      setReturnDate(nextDate);
    }
  };

  const handleOneDaySpecialClick = () => {
    handleTripTypeChange('one-day');
    setOnlyOneBestPlace(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setFormError('Please enter a destination.');
      return;
    }
    if (!origin.trim()) {
      setFormError('Please enter your starting location.');
      return;
    }
    setFormError(null);

    onSearch({
      destination: destination.trim(),
      origin: origin.trim(),
      tripType,
      days: tripType === 'one-day' ? 1 : days,
      startDate,
      returnDate: tripType === 'one-day' ? startDate : returnDate,
      travelers,
      budget,
      currency,
      hasCar,
      needsCab,
      rentCar,
      hotelPreference: tripType === 'one-day' ? 'No Hotel' : hotelPreference,
      foodPreference,
      travelStyle,
      onlyOneBestPlace,
    });
  };

  return (
    <div id="search-section" className="relative -mt-6 max-w-5xl mx-auto px-4 sm:px-6 z-20">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
        {/* Trip Type Selector & One-Day Quick Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl max-w-md">
            <button
              type="button"
              onClick={() => handleTripTypeChange('one-day')}
              className={`flex-1 py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                tripType === 'one-day'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⭐ One-Day Trip</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                Return Today
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleTripTypeChange('multi-day')}
              className={`flex-1 py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                tripType === 'multi-day'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🗓️ Multiple-Day Trip</span>
            </button>
          </div>

          {/* Quick One-Day Trigger Prompt Quote */}
          <button
            type="button"
            onClick={handleOneDaySpecialClick}
            className={`text-xs text-left p-2.5 rounded-xl border transition-all flex items-center gap-2 ${
              tripType === 'one-day' && onlyOneBestPlace
                ? 'bg-amber-50/70 border-amber-300 text-amber-900 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>«“I only want to visit one best place and return on the same day.”»</span>
          </button>
        </div>

        {formError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Row 1: Destination & Origin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Where do you want to go? (Destination)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Agra, Lonavala, Kyoto, Napa Valley, Paris..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Starting Location (Origin)
              </label>
              <div className="relative">
                <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. New Delhi, Mumbai, Bengaluru, San Francisco, London..."
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Dates, Days, Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (tripType === 'one-day') setReturnDate(e.target.value);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {tripType === 'multi-day' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    min={startDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Return Schedule
                </label>
                <div className="py-2.5 px-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Returns Same Evening</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                How many days?
              </label>
              {tripType === 'one-day' ? (
                <div className="py-2.5 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
                  1 Day (One-Day Trip)
                </div>
              ) : (
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={2}>2 Days (Weekend Trip)</option>
                  <option value={3}>3 Days (Long Weekend)</option>
                  <option value={4}>4 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days (1 Week)</option>
                  <option value={10}>10 Days</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travelers
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value={1}>1 Traveler (Solo)</option>
                  <option value={2}>2 Travelers (Couple/Duo)</option>
                  <option value={3}>3 Travelers</option>
                  <option value={4}>4 Travelers (Family/Group)</option>
                  <option value={5}>5+ Travelers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Budget & Travel Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Budget ({currency})
              </label>
              <div className="relative">
                <Wallet className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="number"
                  min={500}
                  step={200}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold tabular-nums text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <span className="block text-[11px] text-slate-500 mt-1">
                {tripType === 'one-day' ? 'Covers transport, food, farm & entry' : 'Covers stay, transport & dining'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Express & Scenic">Express & Scenic (Efficient)</option>
                <option value="Relaxed & Leisure">Relaxed & Leisure</option>
                <option value="Cultural & Historic">Cultural & Historic</option>
                <option value="Family Friendly">Family Friendly</option>
                <option value="Food & Farm Lovers">Food & Farm Lovers</option>
                <option value="Budget Backpacker">Budget Backpacker</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Food Preference
              </label>
              <div className="relative">
                <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Local cuisine & Indian vegetarian">Local cuisine & Indian Vegetarian</option>
                  <option value="100% Pure Vegetarian">100% Pure Vegetarian</option>
                  <option value="Indian Food Specialty">Indian Food Specialty</option>
                  <option value="Farm-to-Table & Organic">Farm-to-Table & Organic</option>
                  <option value="Street Food & Local Markets">Street Food & Local Markets</option>
                  <option value="Multi-Cuisine & International">Multi-Cuisine & International</option>
                  <option value="Halal Friendly">Halal Friendly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Hotel Preference & Car/Transport Preferences */}
          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hotel Preference
                </label>
                {tripType === 'one-day' ? (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>No hotel required for this one-day trip (100% savings)</span>
                  </div>
                ) : (
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={hotelPreference}
                      onChange={(e) => setHotelPreference(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="Comfort Boutique / 3-Star">Comfort Boutique / 3-Star</option>
                      <option value="Heritage / Palace Stay">Heritage / Palace Stay</option>
                      <option value="Luxury 5-Star Resort">Luxury 5-Star Resort</option>
                      <option value="Budget Homestay / Hostel">Budget Homestay / Hostel</option>
                      <option value="Eco-Farm Stay">Eco-Farm Stay</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Transportation Questions */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transportation Setup:
                </span>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {/* Do you have a car? */}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={hasCar}
                      onChange={(e) => {
                        setHasCar(e.target.checked);
                        if (e.target.checked) setNeedsCab(false);
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-medium text-slate-700">I have a car</span>
                  </label>

                  {/* Do you need a cab? */}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={needsCab}
                      onChange={(e) => {
                        setNeedsCab(e.target.checked);
                        if (e.target.checked) setHasCar(false);
                      }}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-medium text-slate-700">I need a cab</span>
                  </label>

                  {/* Do you want to rent a car? */}
                  <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300">
                    <input
                      type="checkbox"
                      checked={rentCar}
                      onChange={(e) => setRentCar(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="font-medium text-slate-700">Rent a car</span>
                  </label>
                </div>
              </div>
            </div>

            {/* One Best Place Priority Toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={onlyOneBestPlace}
                  onChange={(e) => setOnlyOneBestPlace(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-medium">
                  Prioritize <strong>One Single Best Place</strong> (No exhausting tourist rush)
                </span>
              </label>

              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {tripType === 'one-day' ? 'Calculates safe return journey buffer' : 'Optimizes day groupings'}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-amber-500 hover:from-sky-700 hover:to-amber-600 text-white font-display font-extrabold text-lg shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Your Custom AI Trip Plan...</span>
                </>
              ) : (
                <>
                  <span>PLAN MY TRIP</span>
                  <Plane className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
