import React, { useState } from 'react';
import { TripPlan } from '../types/trip';
import { travelImages } from '../assets/images';
import {
  Calendar,
  Building,
  Utensils,
  Car,
  Compass,
  Briefcase,
  Star,
  Clock,
  ExternalLink,
  Plane,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';

interface MultiDayDashboardProps {
  plan: TripPlan;
  onModifySearch: () => void;
  onOpenAI: (query?: string) => void;
  currency: string;
}

export const MultiDayDashboard: React.FC<MultiDayDashboardProps> = ({
  plan,
  onModifySearch,
  onOpenAI,
  currency,
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'food' | 'map' | 'budget'>('itinerary');
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const { multiDayItinerary, hotels, restaurants, localAndFarmFood, budget, bestTimeToVisit, travelPreparation } = plan;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                🗓️ MULTIPLE-DAY TRIP PLAN
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium">{plan.destination} Experience</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">{plan.dataStatus}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              {multiDayItinerary.length}-Day Personalized Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Starting from <strong className="text-slate-900">{plan.origin}</strong> to <strong className="text-slate-900">{plan.destination}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onModifySearch}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Modify Plan
            </button>
            <button
              onClick={() => onOpenAI('Reduce my budget for this multi-day trip')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Ask Best Trip AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold">
          {[
            { id: 'itinerary', label: '🗓️ Day-by-Day Itinerary', icon: Calendar },
            { id: 'hotels', label: '🏨 Curated Hotels', icon: Building },
            { id: 'food', label: '🍴 Dining & Farm Markets', icon: Utensils },
            { id: 'map', label: '🗺️ Destination Map', icon: Compass },
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

      {/* TAB 1: DAY BY DAY ITINERARY */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {/* Day Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {multiDayItinerary.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedDay === day.day
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Day {day.day}</span>
                <span className="text-[10px] opacity-80 font-normal">({day.theme})</span>
              </button>
            ))}
          </div>

          {/* Active Day Detail Card */}
          {multiDayItinerary
            .filter((d) => d.day === selectedDay)
            .map((day) => (
              <div key={day.day} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                    Day {day.day} Focus
                  </span>
                  <h3 className="font-display text-2xl font-bold text-slate-900 mt-1">
                    {day.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {day.highlightAttractions.map((att, i) => (
                      <span key={i} className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        📍 {att}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Morning
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {day.morning}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-sky-700 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Afternoon
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {day.afternoon}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Evening
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {day.evening}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* TAB 2: HOTELS */}
      {activeTab === 'hotels' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Recommended Stays Near Attractions
              </h3>
              <p className="text-xs text-slate-600">
                Hand-vetted hotels with verified guest reviews and central locations:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.items.map((hotel, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden space-y-3">
                  <div className="h-44 relative">
                    <img
                      src={idx % 2 === 0 ? travelImages.heritage : travelImages.farmDining}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/90 text-amber-400 text-xs font-bold px-2 py-1 rounded">
                      ★ {hotel.rating} / 5
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{hotel.name}</h4>
                        <span className="text-xs text-slate-500">{hotel.location} · {hotel.distanceFromAttraction}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                        {hotel.pricePerNight} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {hotel.facilities.map((fac, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                          {fac}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel.name + ' ' + plan.destination)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Check Booking Rates</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FOOD */}
      {activeTab === 'food' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Top Rated Local Restaurants
            </h3>
            <div className="space-y-3">
              {restaurants.map((rest, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{rest.name}</span>
                    <span className="text-emerald-700">★ {rest.rating}</span>
                  </div>
                  <span className="text-slate-500 block">{rest.cuisine} · {rest.priceRange}</span>
                  <span className="text-slate-700 block">🌱 {rest.vegetarianOptions}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Farmers Markets & Agro-Farms 🌾
            </h3>
            <div className="space-y-3">
              {localAndFarmFood.map((farm, i) => (
                <div key={i} className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{farm.name}</span>
                    <span className="text-amber-800 font-semibold">{farm.type}</span>
                  </div>
                  <p className="text-slate-600">{farm.foodAvailable}</p>
                  <span className="text-slate-500 block">📍 {farm.location} · {farm.openingHours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MAP */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-display text-xl font-bold text-slate-900">
            Interactive Destination & Route Map
          </h3>
          <InteractiveMap
            waypoints={plan.mapWaypoints}
            destination={plan.destination}
            origin={plan.origin}
            mode="car"
          />
        </div>
      )}

      {/* TAB 5: BUDGET */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">
                Multi-Day Budget Estimator
              </h3>
              <p className="text-xs text-slate-600">
                Comprehensive allocation for hotels, intercity travel, local cabs, and food:
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="p-2.5 bg-slate-100 rounded-lg">
                <span className="text-slate-500 block">User Budget</span>
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3">Expense Category</th>
                  <th className="py-2.5 px-3 text-right">Estimated Amount ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budget.breakdown.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.category}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {currency} {item.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
