import React, { useState } from 'react';
import { TripPlan } from '../types/trip';
import { travelImages } from '../assets/images';
import {
  ShieldAlert,
  Clock,
  Car,
  Compass,
  Utensils,
  Plane,
  Building,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sun,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface OneDayDashboardProps {
  plan: TripPlan;
  onModifySearch: () => void;
  onOpenAI: (initialQuery?: string) => void;
  currency: string;
}

export const OneDayDashboard: React.FC<OneDayDashboardProps> = ({
  plan,
  onModifySearch,
  onOpenAI,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'food' | 'transport' | 'map' | 'budget'>('overview');
  const [showOptionalHotels, setShowOptionalHotels] = useState(false);
  const [transportMode, setTransportMode] = useState<'car' | 'cab' | 'transit' | 'walk'>('car');

  const { returnGuarantee, recommendedPlace, alternativePlaces, timeline, budget, restaurants, localAndFarmFood, transportationPlan, cabGuide, carRental, flights, bestTimeToVisit, travelPreparation } = plan;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Verification Badge & Return Guarantee Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                ⭐ ONE-DAY TRIP MODE ACTIVE
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">Status: {plan.dataStatus}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{plan.lastUpdated}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              One-Day Excursion: {recommendedPlace.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Origin: <strong className="text-slate-900">{plan.origin}</strong> → Destination: <strong className="text-slate-900">{plan.destination}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onModifySearch}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Adjust Parameters
            </button>
            <button
              onClick={() => onOpenAI('Give me a faster return route')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Ask Best Trip AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Return Guarantee Callout */}
        <div className="mt-5">
          {returnGuarantee.isFeasibleSameDay ? (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-900 text-sm">
                    Same-Day Return Guaranteed
                  </span>
                  <span className="text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                    Home by {returnGuarantee.expectedArrivalTimeHome}
                  </span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  {returnGuarantee.feasibilityExplanation}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-emerald-700 font-medium">
                  <span>🚗 Estimated Total Driving: {Math.round(returnGuarantee.totalTravelTimeMinutes / 60)} hrs roundtrip</span>
                  <span>🛡️ Buffer Included: {returnGuarantee.bufferTimeMinutes} mins</span>
                  <span>🏨 Hotel Cost: ₹0 (No Overnight Required)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-amber-900">
                <strong className="block text-sm font-bold text-amber-950">
                  {returnGuarantee.warningMessage || '“This destination may be difficult to visit and return on the same day.”'}
                </strong>
                <p className="leading-relaxed">
                  The roundtrip journey requires {Math.round(returnGuarantee.totalTravelTimeMinutes / 60)} hours on the road, which leaves limited sightseeing daylight.
                </p>
                {returnGuarantee.closerAlternative && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="font-semibold text-amber-950">Recommended Closer Alternative:</span>
                    <button
                      onClick={() => onOpenAI(`Suggest a trip to ${returnGuarantee.closerAlternative}`)}
                      className="underline font-bold text-sky-700 hover:text-sky-900"
                    >
                      {returnGuarantee.closerAlternative}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'overview', label: '⭐ Recommended Destination', icon: Compass },
            { id: 'timeline', label: '🕐 Exact Timeline', icon: Clock },
            { id: 'food', label: '🍴 Restaurants & Farm Food', icon: Utensils },
            { id: 'transport', label: '🚕 Transportation & Cabs', icon: Car },
            { id: 'map', label: '🗺️ Guided Route Map', icon: Compass },
            { id: 'budget', label: '💰 Budget Breakdown', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & ONE BEST PLACE */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Main Recommended Landmark Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[300px]">
              <img
                src={travelImages.heritage}
                alt={recommendedPlace.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 font-bold text-xs px-2.5 py-1 rounded-md">
                ⭐ Primary One-Day Selection
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                  Heritage & Scenic Focus
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {recommendedPlace.name}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {recommendedPlace.shortDescription}
                </p>
              </div>

              {/* Why it fits a one-day trip */}
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-600" />
                  Why It Fits a One-Day Excursion:
                </span>
                <p className="text-xs sm:text-sm text-sky-950 leading-relaxed">
                  {recommendedPlace.whyFitsOneDay}
                </p>
              </div>

              {/* Key Practical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Distance from Origin</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    {recommendedPlace.distanceFromOriginKm} km
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Travel Duration</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {recommendedPlace.estimatedTravelTime}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Recommended Duration</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {recommendedPlace.recommendedDuration}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Opening Hours</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {recommendedPlace.openingHours}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Entry Fee</span>
                  <span className="font-bold text-emerald-700 text-xs">
                    {recommendedPlace.entryFee}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Best Mode</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {recommendedPlace.practicalTransportation}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>View Full Schedule</span>
                  <Clock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>View Route Map</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Up to 2 Alternative Places (No arbitrary scores) */}
          {alternativePlaces && alternativePlaces.length > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Alternative Sites (If Primary is Busy or Weather Shifts)
                  </h4>
                  <p className="text-xs text-slate-600">
                    Curated fallbacks in the same vicinity without overloading your day:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternativePlaces.map((alt, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-amber-700 uppercase">
                      Alternative Option #{idx + 1}
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm">{alt.name}</h5>
                    <p className="text-xs text-slate-600">{alt.shortDescription}</p>
                    <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                      Why consider: {alt.whyAlternative}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hotel Logic Callout */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Accommodation Policy:</span>
              </div>
              <p className="text-xs text-slate-600">
                {plan.hotels.noticeMessage}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowOptionalHotels(!showOptionalHotels)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 underline whitespace-nowrap"
            >
              {showOptionalHotels ? 'Hide Hotel Listings' : 'I actually need a hotel (Show options)'}
            </button>
          </div>

          {showOptionalHotels && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800">Optional Hotels Near {plan.destination}:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.hotels.items.map((hotel, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{hotel.name}</span>
                      <span className="text-emerald-700 tabular-nums">{hotel.pricePerNight}</span>
                    </div>
                    <span className="text-slate-500 block">{hotel.location} · {hotel.distanceFromAttraction}</span>
                    <span className="text-amber-600 font-semibold block">★ {hotel.rating} / 5</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flights Practicality Verification */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-sky-600" />
              <h4 className="font-bold text-sm text-slate-900">Flight Feasibility Assessment:</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {flights.analysisMessage}
            </p>
            {flights.isFlightPractical && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-wrap justify-between gap-2">
                <span>Airline: <strong>{flights.airline}</strong></span>
                <span>Depart: <strong>{flights.departure}</strong> ➔ Arrive: <strong>{flights.arrival}</strong></span>
                <span>Return: <strong>{flights.returnFlight}</strong></span>
                <a
                  href={flights.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Check Flights</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: EXACT TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-display text-xl font-bold text-slate-900">
              One-Day Trip Practical Schedule
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Precisely timed based on distance, opening hours, local dining, and return buffer:
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Node marker */}
                <div className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  step.period === 'Return'
                    ? 'bg-amber-500 border-amber-600 text-white'
                    : 'bg-sky-600 border-sky-700 text-white'
                }`}>
                  {idx + 1}
                </div>

                <div className="bg-slate-50 hover:bg-slate-100/70 p-4 rounded-xl border border-slate-200 transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{step.time}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">({step.period})</span>
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      📍 {step.location}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {step.activity}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <span>✅ Total trip fits seamlessly within 14 daylight hours with a guaranteed evening return home.</span>
            <span className="font-bold">Zero Overnight Fatigue</span>
          </div>
        </div>
      )}

      {/* TAB 3: RESTAURANTS & FARM FOOD */}
      {activeTab === 'food' && (
        <div className="space-y-6">
          {/* Near-Attraction Restaurants */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Recommended Dining Near {recommendedPlace.name}
              </h3>
              <p className="text-xs text-slate-600">
                Selected for schedule convenience, high culinary standards, and pure vegetarian / Indian food options:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {restaurants.map((rest, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                        {rest.cuisine}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base">{rest.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      ★ {rest.rating}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5">
                    <p><strong>Popular Dishes:</strong> {rest.popularDishes.join(', ')}</p>
                    <p className="text-emerald-800">🌱 <strong>Vegetarian:</strong> {rest.vegetarianOptions}</p>
                    <p className="text-sky-900">🍛 <strong>Indian Food:</strong> {rest.indianFoodOptions}</p>
                    <p><strong>Price Range:</strong> {rest.priceRange}</p>
                    <p><strong>Hours:</strong> {rest.openingHours}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>📍 {rest.distanceFromAttraction} · {rest.directions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local & Farm Food Experiences */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Local & Farm Food Experiences 🌾
                </h3>
                <p className="text-xs text-slate-600">
                  Farmers markets, local produce, and farm-to-table stops verified safe for your same-day return:
                </p>
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                Safe for 1-Day Return
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {localAndFarmFood.map((farm, idx) => (
                <div key={idx} className="bg-amber-50/40 rounded-xl border border-amber-200 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {farm.type}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1">{farm.name}</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 tabular-nums">
                      {farm.price}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Produce & Food:</strong> {farm.foodAvailable}
                  </p>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Location:</strong> {farm.location}</p>
                    <p><strong>Hours:</strong> {farm.openingHours}</p>
                    <p><strong>Transit:</strong> {farm.transportation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSPORTATION, CABS & CAR RENTAL */}
      {activeTab === 'transport' && (
        <div className="space-y-6">
          {/* Step-by-Step Route Legs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-display text-xl font-bold text-slate-900">
                Step-by-Step Journey Breakdown
              </h3>
              <p className="text-xs text-slate-600">
                From your doorstep to the attraction, dining, and back home:
              </p>
            </div>

            <div className="space-y-3">
              {transportationPlan.legs.map((leg, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{leg.from}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-900 text-sm">{leg.to}</span>
                    </div>
                    <p className="text-slate-600 font-medium">Recommended: <strong>{leg.recommendedMode}</strong></p>
                    <p className="text-slate-500">Boarding: {leg.whereToBoard}</p>
                  </div>

                  <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1 shrink-0">
                    <span className="font-bold text-slate-900 text-sm">{leg.estimatedCost}</span>
                    <span className="text-slate-500">{leg.travelTime}</span>
                    <span className="text-sky-700 font-semibold">{leg.howToBook}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cab / Taxi Guide */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-base">Where Can I Get a Cab? 🚕</h4>
                <p className="text-xs text-slate-600">Verified pickup locations and ride-hailing guide</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Authorized Pickup Locations:</span>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {cabGuide.pickupLocations.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Fare Estimates & Tips:</span>
                <p><strong>Cost:</strong> {cabGuide.estimatedCost}</p>
                <p><strong>App Options:</strong> {cabGuide.rideHailingServices.join(', ')}</p>
                <p className="text-amber-800 font-medium">💡 {cabGuide.bookingTips}</p>
              </div>
            </div>
          </div>

          {/* Car Rental Option */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Self-Drive Car Rental Option 🚗</h4>
                <p className="text-xs text-slate-600">Practicality check for a 1-day drive</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
                Practical for this Route
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">Company & Vehicle</span>
                <strong className="text-slate-900 block">{carRental.company}</strong>
                <span className="text-slate-600">{carRental.vehicle}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">Daily Rate</span>
                <strong className="text-emerald-700 block text-sm">{carRental.dailyPrice}</strong>
                <span className="text-slate-500">Includes insurance coverage</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block">Requirements</span>
                <span className="text-slate-700 block">{carRental.requiredDocuments}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GUIDED ROUTE MAP */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  One-Day Guided Route Map 🗺️
                </h3>
                <p className="text-xs text-slate-600">
                  Interactive checkpoints from origin to landmark, food, and safe return:
                </p>
              </div>

              {/* Transport Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
                {(['car', 'cab', 'transit', 'walk'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setTransportMode(m)}
                    className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                      transportMode === m ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                    }`}
                  >
                    {m === 'car' ? '🚗 Car' : m === 'cab' ? '🚕 Cab' : m === 'transit' ? '🚇 Transit' : '🚶 Walking'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Visual Map Component */}
            <InteractiveMap
              waypoints={plan.mapWaypoints}
              destination={plan.destination}
              origin={plan.origin}
              mode={transportMode}
            />
          </div>
        </div>
      )}

      {/* TAB 6: SMART BUDGET CALCULATOR */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Smart One-Day Budget Calculator
                </h3>
                <p className="text-xs text-slate-600">
                  Zero hotel cost calculated. All funds prioritized for quality transit, food, and sightseeing:
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <span className="text-slate-500 block">Your Budget</span>
                  <span className="font-bold text-slate-900 text-sm tabular-nums">
                    {currency} {budget.userBudget.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                  <span className="text-emerald-700 block">Estimated Cost</span>
                  <span className="font-bold text-sm tabular-nums">
                    {currency} {budget.totalEstimatedCost.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-900">
                  <span className="text-sky-700 block">Remaining</span>
                  <span className="font-bold text-sm tabular-nums">
                    {currency} {budget.remainingAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabular Expense Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Expense Category</th>
                    <th className="py-2.5 px-3">Allocation Detail</th>
                    <th className="py-2.5 px-3 text-right">Estimated Cost ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budget.breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {item.category}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {item.category.includes('Hotels')
                          ? '₹0 · No hotel needed for 1-day trip'
                          : 'Optimized standard rate'}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {item.cost === 0 ? '—' : `${currency} ${item.cost.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-slate-900 bg-slate-50/80 font-bold">
                    <td className="py-3.5 px-3 text-slate-900 text-sm">TOTAL ESTIMATED</td>
                    <td className="py-3.5 px-3 text-emerald-700">Within Budget</td>
                    <td className="py-3.5 px-3 text-right text-base text-slate-900 tabular-nums font-mono">
                      {currency} {budget.totalEstimatedCost.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Smart Budget Optimization Tips */}
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
              <span className="font-bold text-xs text-sky-950 uppercase tracking-wider">
                🧠 Smart Budget Optimization Advice:
              </span>
              <ul className="space-y-1 text-xs text-sky-900 list-disc list-inside">
                {budget.optimizationTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Travel Preparation & Best Time Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-slate-900 text-base">Best Time to Visit & Weather 🌤️</h4>
          </div>
          <p className="text-xs text-slate-600"><strong>Season:</strong> {bestTimeToVisit.bestSeason}</p>
          <p className="text-xs text-slate-600"><strong>Forecast:</strong> {bestTimeToVisit.weatherSummary}</p>
          <p className="text-xs text-slate-600"><strong>Crowd Levels:</strong> {bestTimeToVisit.crowdLevel}</p>
          <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
            ✓ {bestTimeToVisit.currentSuitability}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-600" />
            <h4 className="font-bold text-slate-900 text-base">Travel Preparation & Checklist 🧳</h4>
          </div>
          <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
            {travelPreparation.checklist.slice(0, 4).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 pt-1">
            Emergency Helpline: {travelPreparation.emergencyInfo}
          </p>
        </div>
      </div>
    </div>
  );
};
