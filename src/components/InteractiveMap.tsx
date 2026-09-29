import React, { useState } from 'react';
import { MapWaypoint } from '../types/trip';
import { travelImages } from '../assets/images';
import {
  MapPin,
  Car,
  Compass,
  Utensils,
  ShoppingBag,
  Home,
  CheckCircle2,
  Navigation,
  Layers,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface InteractiveMapProps {
  waypoints: MapWaypoint[];
  destination: string;
  origin: string;
  mode: 'car' | 'cab' | 'transit' | 'walk';
}

interface POI {
  id: string;
  category: 'attraction' | 'restaurant' | 'hotel' | 'farm' | 'transit' | 'taxi' | 'rental';
  name: string;
  icon: string;
  coords: { x: number; y: number }; // percentage on map canvas
  description: string;
  price: string;
  hours: string;
  image: string;
  directions: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  waypoints,
  destination,
  origin,
  mode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePOI, setActivePOI] = useState<POI | null>(null);
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number>(0);

  // Curated POIs on map
  const pois: POI[] = [
    {
      id: 'poi-1',
      category: 'attraction',
      name: `${destination} Primary Landmark`,
      icon: '🏛️',
      coords: { x: 58, y: 36 },
      description: 'UNESCO World Heritage marvel and central historic attraction.',
      price: '₹250 - 500 Entry',
      hours: 'Sunrise - Sunset',
      image: travelImages.heritage,
      directions: 'Take Monument Expressway exit 4, proceed to visitor gate'
    },
    {
      id: 'poi-2',
      category: 'restaurant',
      name: 'The Royal Courtyard & Farm Garden',
      icon: '🍴',
      coords: { x: 65, y: 44 },
      description: 'Artisanal regional dining, clay tandoor breads, 100% veg options.',
      price: '₹400 - 800 per meal',
      hours: '11:30 AM – 10:30 PM',
      image: travelImages.farmDining,
      directions: '650m east of main monument portal'
    },
    {
      id: 'poi-3',
      category: 'farm',
      name: 'Heritage Organic Farmers Market',
      icon: '🌾',
      coords: { x: 72, y: 38 },
      description: 'Fresh seasonal fruits, mustard oil, local honey, farm tours.',
      price: 'Free entry',
      hours: '7:00 AM – 4:00 PM',
      image: travelImages.farmDining,
      directions: '5-minute auto ride from town square'
    },
    {
      id: 'poi-4',
      category: 'hotel',
      name: `${destination} Heritage Palace Resort`,
      icon: '🏨',
      coords: { x: 50, y: 28 },
      description: 'Optional luxury stay with courtyard swimming pool & buffet.',
      price: '₹4,200 / night',
      hours: '24h Check-in',
      image: travelImages.heritage,
      directions: '1 km from primary attraction'
    },
    {
      id: 'poi-5',
      category: 'taxi',
      name: 'Central Taxi & Cab Stand',
      icon: '🚕',
      coords: { x: 42, y: 48 },
      description: 'Pre-paid outstation cabs, verified meters, Uber pickup point.',
      price: 'Metered / App fixed rate',
      hours: '24 Hours',
      image: travelImages.roadTravel,
      directions: 'Main junction opposite Railway station gate'
    },
    {
      id: 'poi-6',
      category: 'rental',
      name: 'Express Self-Drive Car Hub',
      icon: '🚗',
      coords: { x: 30, y: 60 },
      description: 'Quick keyless car pickup for returning road travelers.',
      price: 'From ₹1,800/day',
      hours: '6:00 AM – 11:00 PM',
      image: travelImages.roadTravel,
      directions: 'Highway Service Plaza junction'
    },
    {
      id: 'poi-7',
      category: 'transit',
      name: `${destination} Express Railway Terminal`,
      icon: '🚆',
      coords: { x: 38, y: 52 },
      description: 'Superfast express trains linking directly back to origin.',
      price: '₹180 - 650',
      hours: 'Round the clock departures',
      image: travelImages.roadTravel,
      directions: 'Connected by dedicated shuttle bus'
    },
  ];

  const filteredPois = selectedCategory === 'all'
    ? pois
    : pois.filter((p) => p.category === selectedCategory);

  const modeSpeeds = {
    car: { time: '3h 15m', speed: 'Expwy 80-100 km/h' },
    cab: { time: '3h 30m', speed: 'Chauffeured AC Taxi' },
    transit: { time: '2h 10m', speed: 'Superfast Express Rail' },
    walk: { time: 'Local area walk', speed: '4.5 km/h' }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl text-xs font-semibold">
        {[
          { id: 'all', label: 'All Markers' },
          { id: 'attraction', label: '🏛️ Attractions' },
          { id: 'restaurant', label: '🍴 Restaurants' },
          { id: 'farm', label: '🌾 Farm & Markets' },
          { id: 'hotel', label: '🏨 Hotels' },
          { id: 'taxi', label: '🚕 Taxi / Cab Points' },
          { id: 'rental', label: '🚗 Car Rentals' },
          { id: 'transit', label: '🚆 Metro / Rail' },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Map Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Map Surface */}
        <div className="lg:col-span-8 relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner min-h-[440px] flex items-center justify-center">
          {/* Map Topographic & Highway Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* Simulated River / Coastline */}
            <path
              d="M0,320 C180,310 240,240 450,260 C650,280 720,180 900,160"
              fill="none"
              stroke="#0284c7"
              strokeWidth="14"
              opacity="0.45"
              strokeLinecap="round"
            />

            {/* Complete Guided Route Path: Origin -> Expressway -> Destination -> Food -> Return */}
            <path
              d="M80,360 C160,340 280,260 480,180 C580,140 680,160 760,220"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
            {/* Return Path back */}
            <path
              d="M760,220 C640,300 420,380 80,360"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>
              Route: <strong>{origin}</strong> ➔ <strong>{destination}</strong> ({modeSpeeds[mode].time})
            </span>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300">
            Click any pin for details
          </div>

          {/* Interactive POI Markers */}
          {filteredPois.map((poi) => {
            const isSelected = activePOI?.id === poi.id;
            return (
              <button
                key={poi.id}
                type="button"
                onClick={() => setActivePOI(poi)}
                style={{ left: `${poi.coords.x}%`, top: `${poi.coords.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
                aria-label={poi.name}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all ${
                  isSelected
                    ? 'bg-amber-400 border-white text-slate-950 ring-4 ring-amber-400/40'
                    : 'bg-slate-900/90 border-sky-400 text-white hover:bg-sky-600'
                }`}>
                  <span className="text-sm">{poi.icon}</span>
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {poi.name}
                </span>
              </button>
            );
          })}

          {/* Origin and Return Terminus Marker */}
          <div
            style={{ left: '12%', top: '78%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="px-2 py-1 bg-emerald-600 text-white font-bold text-xs rounded-md shadow-lg border border-white flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>{origin} (Start & Return)</span>
            </div>
          </div>
        </div>

        {/* Route Stepper & Active Marker Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active POI Popup Card */}
          {activePOI ? (
            <div className="bg-slate-50 border-2 border-sky-400 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <div className="relative h-28 rounded-xl overflow-hidden">
                <img
                  src={activePOI.image}
                  alt={activePOI.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setActivePOI(null)}
                  className="absolute top-2 right-2 w-6 h-6 bg-slate-900/80 text-white rounded-full text-xs flex items-center justify-center hover:bg-slate-900"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-sky-700 tracking-wider">
                  {activePOI.category}
                </span>
                <h4 className="font-bold text-slate-900 text-base">{activePOI.name}</h4>
                <p className="text-xs text-slate-600 mt-1">{activePOI.description}</p>
              </div>

              <div className="pt-1 text-xs text-slate-700 space-y-1">
                <p><strong>Pricing:</strong> {activePOI.price}</p>
                <p><strong>Operating Hours:</strong> {activePOI.hours}</p>
                <p className="text-[11px] text-slate-500 italic">📍 {activePOI.directions}</p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePOI.name + ' ' + destination)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-2">
              <span className="font-bold text-slate-900 block">🗺️ Map Inspector Active</span>
              <p>Click any icon on the map to view attraction hours, ticket fees, food menus, taxi stands, or rental desks.</p>
            </div>
          )}

          {/* Sequential Waypoint Route List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="font-bold text-xs text-slate-900 uppercase tracking-wider block">
              Sequential Route Leg Checkpoints:
            </span>

            <div className="space-y-2">
              {waypoints.map((wp, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedWaypointIndex(idx)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs flex items-center justify-between ${
                    selectedWaypointIndex === idx
                      ? 'bg-sky-50 border-sky-300 text-sky-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{wp.icon}</span>
                    <div>
                      <span className="block font-bold">{wp.title}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{wp.description}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block font-mono font-bold">{wp.estimatedArrival}</span>
                    <span className="text-[10px] text-slate-400">+{wp.distanceFromPrev}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
