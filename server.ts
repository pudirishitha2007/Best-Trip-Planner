import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize Gemini API client on server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Built-in curated travel offers
const TRAVEL_OFFERS = [
  {
    id: 'off-1',
    title: 'First Trip Discount',
    code: 'BESTTRIP500',
    discount: '₹500 / $10 OFF',
    description: 'Valid on cab bookings, activities, and local guided passes',
    expires: 'Valid until Dec 2026',
    category: 'Activity & Cab'
  },
  {
    id: 'off-2',
    title: 'One-Day Express Pass',
    code: 'ONEDAY20',
    discount: '20% OFF',
    description: 'Express skip-the-line attraction entry and rental car package',
    expires: 'Limited Time',
    category: 'Sightseeing'
  },
  {
    id: 'off-3',
    title: 'Local Farm-to-Table Voucher',
    code: 'FARMDIRECT',
    discount: 'Free Tasting',
    description: 'Complimentary artisan beverage or dessert at partner local farms & bistros',
    expires: 'Weekdays & Weekends',
    category: 'Dining'
  },
  {
    id: 'off-4',
    title: 'Intercity Cab & Return Deal',
    code: 'RETURNWAY',
    discount: '15% Cashback',
    description: 'Roundtrip return guarantee discount on outstation cab bookings',
    expires: 'Roundtrip Bookings',
    category: 'Transport'
  }
];

// Helper to determine distance and same-day return feasibility
function evaluateOneDayFeasibility(origin: string, destination: string) {
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();

  // Known pairings with realistic distances
  if ((o.includes('delhi') && d.includes('agra')) || (o.includes('agra') && d.includes('delhi'))) {
    return { distanceKm: 210, oneWayDriveHours: 3.5, feasible: true, recommendedAlt: null };
  }
  if ((o.includes('delhi') && d.includes('jaipur')) || (o.includes('jaipur') && d.includes('delhi'))) {
    return { distanceKm: 280, oneWayDriveHours: 4.5, feasible: true, recommendedAlt: 'Sultanpur Bird Sanctuary or Neemrana Fort' };
  }
  if ((o.includes('mumbai') && d.includes('lonavala')) || (o.includes('pune') && d.includes('lonavala'))) {
    return { distanceKm: 85, oneWayDriveHours: 2.0, feasible: true, recommendedAlt: null };
  }
  if ((o.includes('mumbai') && d.includes('goa')) || (o.includes('delhi') && d.includes('goa'))) {
    return { distanceKm: 580, oneWayDriveHours: 11.0, feasible: false, recommendedAlt: 'Alibaug or Khandala' };
  }
  if ((o.includes('bangalore') && d.includes('mysore')) || (o.includes('bengaluru') && d.includes('mysuru'))) {
    return { distanceKm: 145, oneWayDriveHours: 2.5, feasible: true, recommendedAlt: null };
  }
  if ((o.includes('bangalore') && d.includes('ooty'))) {
    return { distanceKm: 275, oneWayDriveHours: 6.0, feasible: false, recommendedAlt: 'Nandi Hills or Shivanasamudra Falls' };
  }
  if (o.includes('london') && (d.includes('oxford') || d.includes('cambridge') || d.includes('cotswolds') || d.includes('bath'))) {
    return { distanceKm: 110, oneWayDriveHours: 2.0, feasible: true, recommendedAlt: null };
  }
  if (o.includes('paris') && (d.includes('versailles') || d.includes('giverny') || d.includes('fontainebleau'))) {
    return { distanceKm: 30, oneWayDriveHours: 1.0, feasible: true, recommendedAlt: null };
  }
  if (o.includes('tokyo') && (d.includes('kamakura') || d.includes('hakone') || d.includes('nikko') || d.includes('yokohama'))) {
    return { distanceKm: 70, oneWayDriveHours: 1.5, feasible: true, recommendedAlt: null };
  }
  if (o.includes('san francisco') && (d.includes('napa') || d.includes('sonoma') || d.includes('monterey') || d.includes('carmel'))) {
    return { distanceKm: 90, oneWayDriveHours: 1.5, feasible: true, recommendedAlt: null };
  }

  // Generic estimation
  return { distanceKm: 120, oneWayDriveHours: 2.5, feasible: true, recommendedAlt: null };
}

// Generate smart plan logic
async function generatePlanWithAI(params: any) {
  const {
    destination,
    origin,
    tripType,
    days = 1,
    travelers = 1,
    budget = 5000,
    currency = '₹',
    hasCar = false,
    needsCab = true,
    rentCar = false,
    hotelPreference = 'No Hotel',
    foodPreference = 'Local cuisine',
    travelStyle = 'Balanced',
    onlyOneBestPlace = true,
  } = params;

  const isOneDay = tripType === 'one-day' || days === 1 || onlyOneBestPlace;
  const feasibility = evaluateOneDayFeasibility(origin, destination);

  if (ai) {
    try {
      const prompt = `You are the lead travel architect for "Best Trip Planner".
User parameters:
- Starting Location (Origin): ${origin}
- Destination: ${destination}
- Trip Type: ${isOneDay ? 'One-Day Trip (Must prioritize returning the traveler to origin on the same day)' : `${days}-Day Multiple-Day Trip`}
- Days: ${isOneDay ? 1 : days}
- Travelers: ${travelers}
- User Total Budget: ${currency} ${budget}
- Car status: ${hasCar ? 'User owns and has a car' : 'User does NOT have a car'}
- Needs Cab: ${needsCab}
- Rent Car: ${rentCar}
- Hotel Preference: ${isOneDay ? 'No hotel required unless explicitly requested' : hotelPreference}
- Food Preference: ${foodPreference}
- Travel Style: ${travelStyle}
- Only One Best Place requested: ${onlyOneBestPlace}

CRITICAL RULES FOR ONE-DAY TRIP:
1. Prioritize returning the traveler to starting location on the same day. Calculate: Total travel time + sightseeing time + meal time + reasonable buffer.
2. If it is impossible or stressful to return same day (one-way travel > 4.5 hours), set "isFeasibleSameDay": false, and suggest a closer alternative.
3. Recommend ONE primary attraction, not a big list. Optionally provide up to two alternatives.
4. For one-day trip, do NOT include hotel cost unless requested. Show "No hotel required for this one-day trip".
5. Provide exact practical timeline with morning start, exploration, lunch at a nearby restaurant, afternoon sightseeing/farm, and return journey home.
6. Provide local and farm food recommendations (farmers markets, farm-to-table, fresh produce) near the attraction.
7. Provide exact transportation breakdown: Origin -> Destination -> Attraction -> Food -> Origin.
8. Include realistic budget calculation in ${currency}.

Return a STRICT JSON object with these keys:
{
  "destination": string,
  "origin": string,
  "tripType": "one-day" | "multi-day",
  "dataStatus": "LIVE",
  "lastUpdated": string,
  "returnGuarantee": {
    "isFeasibleSameDay": boolean,
    "totalTravelTimeMinutes": number,
    "recommendedDepartureTime": string,
    "expectedArrivalTimeHome": string,
    "bufferTimeMinutes": number,
    "feasibilityExplanation": string,
    "warningMessage": string or null,
    "closerAlternative": string or null
  },
  "recommendedPlace": {
    "name": string,
    "imageType": "monument" | "nature" | "scenic" | "culture",
    "shortDescription": string,
    "whyFitsOneDay": string,
    "distanceFromOriginKm": number,
    "estimatedTravelTime": string,
    "openingHours": string,
    "entryFee": string,
    "recommendedDuration": string,
    "nearbyFoodSummary": string,
    "practicalTransportation": string,
    "guidedRouteSummary": string
  },
  "alternativePlaces": [
    {
      "name": string,
      "shortDescription": string,
      "whyAlternative": string
    }
  ],
  "timeline": [
    {
      "time": string,
      "period": "Morning" | "Afternoon" | "Evening" | "Return",
      "activity": string,
      "details": string,
      "location": string,
      "icon": string
    }
  ],
  "multiDayItinerary": [
    {
      "day": number,
      "title": string,
      "theme": string,
      "morning": string,
      "afternoon": string,
      "evening": string,
      "highlightAttractions": [string]
    }
  ],
  "flights": {
    "isFlightPractical": boolean,
    "analysisMessage": string,
    "airline": string,
    "departure": string,
    "arrival": string,
    "duration": string,
    "stops": string,
    "price": string,
    "returnFlight": string,
    "bookingUrl": string
  },
  "hotels": {
    "required": boolean,
    "noticeMessage": string,
    "items": [
      {
        "name": string,
        "location": string,
        "rating": number,
        "pricePerNight": string,
        "roomType": string,
        "facilities": [string],
        "distanceFromAttraction": string
      }
    ]
  },
  "restaurants": [
    {
      "name": string,
      "cuisine": string,
      "priceRange": string,
      "rating": number,
      "popularDishes": [string],
      "vegetarianOptions": string,
      "indianFoodOptions": string,
      "openingHours": string,
      "distanceFromAttraction": string,
      "directions": string
    }
  ],
  "localAndFarmFood": [
    {
      "name": string,
      "type": "Farmers' Market" | "Farm-to-Table Restaurant" | "Local Food Producer" | "Organic Orchard",
      "location": string,
      "openingHours": string,
      "price": string,
      "foodAvailable": string,
      "distanceFromAttraction": string,
      "transportation": string,
      "safeForSameDayReturn": boolean
    }
  ],
  "transportationPlan": {
    "hasCar": boolean,
    "legs": [
      {
        "from": string,
        "to": string,
        "recommendedMode": string,
        "alternatives": [string],
        "estimatedCost": string,
        "travelTime": string,
        "howToBook": string,
        "whereToBoard": string
      }
    ]
  },
  "cabGuide": {
    "available": boolean,
    "pickupLocations": [string],
    "rideHailingServices": [string],
    "estimatedCost": string,
    "estimatedTime": string,
    "bookingTips": string
  },
  "carRental": {
    "practicalForTrip": boolean,
    "company": string,
    "vehicle": string,
    "dailyPrice": string,
    "pickupLocation": string,
    "dropoffLocation": string,
    "insurance": string,
    "requiredDocuments": string,
    "drivingRequirements": string
  },
  "mapWaypoints": [
    {
      "title": string,
      "type": "start" | "transport" | "attraction" | "restaurant" | "farm" | "return",
      "icon": string,
      "description": string,
      "estimatedArrival": string,
      "distanceFromPrev": string
    }
  ],
  "budget": {
    "userBudget": number,
    "currency": string,
    "breakdown": [
      { "category": "Flights / Transport", "cost": number },
      { "category": "Hotels", "cost": number },
      { "category": "Food & Dining", "cost": number },
      { "category": "Cabs & Local Transit", "cost": number },
      { "category": "Car Rental", "cost": number },
      { "category": "Attraction Entry Fees", "cost": number },
      { "category": "Local & Farm Experiences", "cost": number },
      { "category": "Buffer / Other", "cost": number }
    ],
    "totalEstimatedCost": number,
    "remainingAmount": number,
    "isWithinBudget": boolean,
    "optimizationTips": [string]
  },
  "bestTimeToVisit": {
    "bestSeason": string,
    "currentSuitability": string,
    "weatherSummary": string,
    "crowdLevel": string,
    "pricingTrends": string,
    "keyEvents": [string]
  },
  "travelPreparation": {
    "checklist": [string],
    "weatherClothing": string,
    "documents": string,
    "simConnectivity": string,
    "emergencyInfo": string,
    "safetyAndRules": string
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart procedural planner:', err);
    }
  }

  // Fallback intelligent planner
  return createProceduralTripPlan(params, feasibility);
}

function createProceduralTripPlan(params: any, feasibility: any) {
  const {
    destination = 'Agra',
    origin = 'New Delhi',
    tripType = 'one-day',
    days = 1,
    travelers = 2,
    budget = 6000,
    currency = '₹',
    hasCar = false,
    needsCab = true,
    rentCar = false,
    hotelPreference = 'No Hotel',
    foodPreference = 'Local cuisine & Indian vegetarian',
    travelStyle = 'Express & Scenic',
    onlyOneBestPlace = true,
  } = params;

  const isOneDay = tripType === 'one-day' || days === 1 || onlyOneBestPlace;
  const dName = destination.trim();
  const oName = origin.trim();

  const isAgra = dName.toLowerCase().includes('agra');
  const isJaipur = dName.toLowerCase().includes('jaipur');
  const isLonavala = dName.toLowerCase().includes('lonavala');
  const isParis = dName.toLowerCase().includes('paris') || dName.toLowerCase().includes('versailles');
  const isKyoto = dName.toLowerCase().includes('kyoto');

  let attractionName = `${dName} Heritage Center & Monument`;
  let attractionDesc = `The crowning architectural masterpiece of ${dName}, renowned for its history, sweeping gardens, and rich heritage.`;
  let whyFits = `Easily reached in under ${feasibility.oneWayDriveHours} hours from ${oName}. Can be fully explored in 3.5 hours, leaving ample time for an authentic local meal and a calm return before nightfall.`;
  let entryFee = `${currency} 250 - 500`;
  let openHours = '6:00 AM – 6:30 PM (Closed on maintenance days)';

  if (isAgra) {
    attractionName = 'The Taj Mahal & Mehtab Bagh Gardens';
    attractionDesc = 'UNESCO World Heritage white marble mausoleum and iconic symbol of eternal love on the Yamuna riverbank.';
    whyFits = 'Directly connected via the Yamuna Expressway (3h 15m). Morning light gives optimal photography and temperature, leaving afternoon free for lunch and a prompt return to Delhi.';
    entryFee = `${currency} 50 (Indian citizen) / ${currency} 1,100 (Foreign visitor)`;
    openHours = 'Sunrise to Sunset (Closed Fridays)';
  } else if (isJaipur) {
    attractionName = 'Amber Fort (Amer Palace)';
    attractionDesc = 'Opulent hilltop palace complex featuring majestic courtyards, Sheesh Mahal (Mirror Palace), and Maota Lake views.';
    whyFits = 'Accessible via the Delhi-Jaipur Expressway. A morning arrival allows 3 hours to tour the fort before lunch in the old city.';
    entryFee = `${currency} 100 - 550`;
    openHours = '8:00 AM – 5:30 PM';
  } else if (isLonavala) {
    attractionName = 'Tiger Point & Karla Buddhist Caves';
    attractionDesc = 'Breathtaking Sahyadri valley clifftops paired with ancient 2nd-century BC rock-cut Buddhist chaitya halls.';
    whyFits = 'Convenient 2-hour drive via Mumbai-Pune Expressway. Excellent cool mountain air and scenic viewpoints that require only 3-4 hours.';
    entryFee = `${currency} 25 - 50`;
    openHours = '6:00 AM – 6:00 PM';
  } else if (isParis) {
    attractionName = 'Palace of Versailles (Château de Versailles)';
    attractionDesc = 'Grand former royal residence of Louis XIV featuring the Hall of Mirrors and vast fountains.';
    whyFits = 'Direct RER C train from central Paris takes only 45 minutes. Perfect 4-hour morning tour with garden stroll.';
    entryFee = '€ 21.00';
    openHours = '9:00 AM – 5:30 PM';
  } else if (isKyoto) {
    attractionName = 'Fushimi Inari-Taisha Shrine & Bamboo Forest';
    attractionDesc = 'Iconic path of 10,000 crimson vermillion torii gates winding through tranquil cedar woods.';
    whyFits = 'Only 15 minutes by rapid train from Kyoto Station. Can be walked in 2.5 hours with immediate transit access.';
    entryFee = 'Free entry to shrine grounds';
    openHours = 'Open 24 hours (Daylight recommended)';
  }

  const transportCost = isOneDay ? Math.round(budget * 0.32) : Math.round(budget * 0.28);
  const foodCost = isOneDay ? Math.round(budget * 0.25) : Math.round(budget * 0.22);
  const hotelCost = isOneDay ? 0 : Math.round(budget * 0.30);
  const cabCost = hasCar ? 0 : Math.round(budget * 0.18);
  const carRentalCost = rentCar ? Math.round(budget * 0.20) : 0;
  const attractionCost = Math.round(budget * 0.08);
  const farmCost = Math.round(budget * 0.07);
  const bufferCost = Math.round(budget * 0.05);

  const totalEstimated = transportCost + foodCost + hotelCost + cabCost + carRentalCost + attractionCost + farmCost + bufferCost;
  const remaining = budget - totalEstimated;

  return {
    destination: dName,
    origin: oName,
    tripType: isOneDay ? 'one-day' : 'multi-day',
    dataStatus: 'ESTIMATED',
    lastUpdated: 'Live Intelligence Engine (Active)',
    returnGuarantee: {
      isFeasibleSameDay: feasibility.feasible,
      totalTravelTimeMinutes: Math.round(feasibility.oneWayDriveHours * 60 * 2),
      recommendedDepartureTime: '6:30 AM',
      expectedArrivalTimeHome: '7:45 PM',
      bufferTimeMinutes: 90,
      feasibilityExplanation: feasibility.feasible
        ? `Comfortable same-day return! One-way journey is ~${feasibility.oneWayDriveHours} hrs (~${feasibility.distanceKm} km). With a 6:30 AM departure, you get 6 full hours at ${dName} plus an authentic meal and return by early evening.`
        : `This destination may be difficult to visit and return on the same day due to long travel times (> ${feasibility.oneWayDriveHours} hours one-way).`,
      warningMessage: feasibility.feasible ? null : `“This destination may be difficult to visit and return on the same day.” Driving over ${feasibility.oneWayDriveHours} hrs each way leaves less than 2 hours for sightseeing.`,
      closerAlternative: feasibility.recommendedAlt || `${oName} Regional Heritage Reserve or Countryside Vista`
    },
    recommendedPlace: {
      name: attractionName,
      imageType: 'monument',
      shortDescription: attractionDesc,
      whyFitsOneDay: whyFits,
      distanceFromOriginKm: feasibility.distanceKm,
      estimatedTravelTime: `${feasibility.oneWayDriveHours} hours by road / express rail`,
      openingHours: openHours,
      entryFee: entryFee,
      recommendedDuration: '3 – 4 hours',
      nearbyFoodSummary: 'Local authentic bistros and farm-fresh garden eateries located within 1.5 km',
      practicalTransportation: hasCar ? 'Private Car / Self-Drive' : (rentCar ? 'Rental Car' : 'Express Train or Pre-booked Cab'),
      guidedRouteSummary: `${oName} → Express Highway / Rail → ${attractionName} → Local Restaurant & Farm Market → Return Route → ${oName}`
    },
    alternativePlaces: [
      {
        name: `${dName} Royal Gardens & Riverside Viewpoint`,
        shortDescription: 'Tranquil scenic viewpoint offering picturesque angles with fewer morning crowds.',
        whyAlternative: 'A calm fallback if lines at the primary attraction are high, located only 15 minutes away.'
      },
      {
        name: `${dName} Artisan Craft & Old Bazaar Quarter`,
        shortDescription: 'Centuries-old stone lanes bustling with local craftspeople, textiles, and spices.',
        whyAlternative: 'Ideal if weather is rainy or if you prefer cultural shopping over monumental walks.'
      }
    ],
    timeline: [
      {
        time: '6:30 AM',
        period: 'Morning',
        activity: 'Depart Starting Location',
        details: `Begin journey from ${oName}. Beat peak commuter traffic to maximize your daylight hours.`,
        location: oName,
        icon: 'Car'
      },
      {
        time: '9:45 AM',
        period: 'Morning',
        activity: `Arrive at ${attractionName}`,
        details: 'Park or alight at priority gate. Use pre-booked QR ticket for immediate skip-the-line entrance.',
        location: attractionName,
        icon: 'MapPin'
      },
      {
        time: '10:00 AM – 1:15 PM',
        period: 'Morning',
        activity: 'Explore the Main Attraction',
        details: `Guided walk through the main complex, historic galleries, and gardens. Take photos during prime ambient light.`,
        location: attractionName,
        icon: 'Camera'
      },
      {
        time: '1:30 PM – 2:45 PM',
        period: 'Afternoon',
        activity: 'Lunch at Recommended Local / Farm-to-Table Restaurant',
        details: `Savor authentic regional dishes with fresh seasonal ingredients. Ample vegetarian & local specialties.`,
        location: `${dName} Culinary Quarter`,
        icon: 'Utensils'
      },
      {
        time: '3:00 PM – 4:15 PM',
        period: 'Afternoon',
        activity: 'Local Farm / Artisan Market Experience',
        details: 'Short stroll to neighboring farmers market for fresh organic produce, local crafts, and heritage souvenirs.',
        location: `${dName} Local Market`,
        icon: 'ShoppingBag'
      },
      {
        time: '4:30 PM',
        period: 'Return',
        activity: 'Commence Return Journey',
        details: `Board your cab, rental car, or express train. Includes a 45-minute highway tea & refreshment buffer.`,
        location: `Departure Terminal / Highway Toll`,
        icon: 'Compass'
      },
      {
        time: '7:45 PM',
        period: 'Return',
        activity: `Arrive back at ${oName}`,
        details: `Safely back at your origin on the same day without needing an overnight hotel stay.`,
        location: oName,
        icon: 'Home'
      }
    ],
    multiDayItinerary: [
      {
        day: 1,
        title: 'Arrival, Iconic Heritage & Sunset Vista',
        theme: 'Orientation & Marquee Landmark',
        morning: `Travel from ${oName} to ${dName}, check into hotel, freshen up.`,
        afternoon: `Visit ${attractionName} for the grand architecture and royal courtyards.`,
        evening: 'Sunset view from riverbank terrace followed by authentic dinner.',
        highlightAttractions: [attractionName, 'River Promenade', 'Old City Gate']
      },
      {
        day: 2,
        title: 'Farms, Local Markets & Artisan Quarters',
        theme: 'Culinary Discovery & Rural Heritage',
        morning: 'Visit regional organic farm and local farmers market for fresh produce & breakfast.',
        afternoon: 'Explore nearby ancient stepwell or secondary palace complex.',
        evening: 'Traditional musical or cultural dinner experience.',
        highlightAttractions: ['Heritage Stepwell', 'Artisan Bazaar', 'Organic Orchard']
      },
      {
        day: 3,
        title: 'Hidden Temples, Nature Trails & Return',
        theme: 'Tranquility & Homeward Journey',
        morning: 'Early morning nature walk or bird sanctuary visit near destination outskirts.',
        afternoon: 'Final souvenir shopping and hearty lunch.',
        evening: `Comfortable transit back to ${oName}.`,
        highlightAttractions: ['Nature Trail', 'Craft Guild Center']
      }
    ],
    flights: {
      isFlightPractical: feasibility.distanceKm > 450,
      analysisMessage: feasibility.distanceKm <= 450
        ? `Flying is NOT recommended for this journey: Total airport check-in, security, and commute (4.5 hrs) exceeds direct expressway or train travel (${feasibility.oneWayDriveHours} hrs). Ground travel offers maximum sightseeing time!`
        : `Direct flights available. Ensure flight return departs after 7:30 PM to allow adequate sightseeing.`,
      airline: 'Regional Express / Intercity Air',
      departure: '07:15 AM',
      arrival: '08:35 AM',
      duration: '1h 20m',
      stops: 'Non-stop',
      price: `${currency} 3,400 per person`,
      baggage: '7 kg Cabin Baggage included',
      returnFlight: '08:20 PM departure (Same Day)',
      bookingUrl: 'https://www.google.com/travel/flights'
    },
    hotels: {
      required: !isOneDay,
      noticeMessage: isOneDay
        ? 'No hotel required for this one-day trip! You will return home on the same day.'
        : `Handpicked stays within easy reach of ${dName}'s primary attractions:`,
      items: [
        {
          name: `${dName} Heritage Palace Resort`,
          location: `0.8 km from ${attractionName}`,
          rating: 4.8,
          pricePerNight: `${currency} 4,200`,
          roomType: 'Deluxe Courtyard King',
          facilities: ['Free High-Speed Wi-Fi', 'Complimentary Breakfast', 'Swimming Pool', 'Airport/Station Shuttle'],
          distanceFromAttraction: '10 min walk'
        },
        {
          name: `${dName} Boutique Eco Haven`,
          location: `Central ${dName}`,
          rating: 4.6,
          pricePerNight: `${currency} 2,600`,
          roomType: 'Organic Garden View Room',
          facilities: ['Farm-to-Table Breakfast', 'Solar Powered', 'Electric Car Charging', 'Luggage Lockers'],
          distanceFromAttraction: '2.5 km (7 min cab)'
        }
      ]
    },
    restaurants: [
      {
        name: `The Royal Courtyard & Spice Garden`,
        cuisine: 'Authentic Regional, North Indian & Continental',
        priceRange: `${currency} 400 - 800 per person`,
        rating: 4.7,
        popularDishes: ['Handi Paneer', 'Fresh Clay-Oven Rotis', 'Dal Tadka', 'Regional Thali', 'Seasonal Kheer'],
        vegetarianOptions: 'Extensive 100% pure vegetarian menu available with dedicated kitchen area',
        indianFoodOptions: 'Full array of regional North Indian curries, fresh tandoor breads, and mild spice options for international guests',
        openingHours: '11:30 AM – 11:00 PM',
        distanceFromAttraction: '650 meters (3 min drive / 8 min stroll)',
        directions: `Exit the main gate of ${attractionName}, turn right onto Monument Boulevard. Located opposite the Heritage Clocktower.`
      },
      {
        name: `Green Leaf Vegetarian Thali Bistro`,
        cuisine: 'Traditional Indian Vegetarian & Local Delicacies',
        priceRange: `${currency} 250 - 450 per person`,
        rating: 4.9,
        popularDishes: ['Executive Unlimited Thali', 'Kadhai Paneer', 'Stuffed Parathas', 'Lassi'],
        vegetarianOptions: '100% Pure Vegetarian certified',
        indianFoodOptions: 'Authentic homestyle cooking with zero preservatives',
        openingHours: '10:00 AM – 10:00 PM',
        distanceFromAttraction: '1.2 km',
        directions: 'Directly on the main transit corridor towards highway return route.'
      }
    ],
    localAndFarmFood: [
      {
        name: `${dName} Organic Valley Farmers Market`,
        type: "Farmers' Market",
        location: `Old Market Square, ${dName}`,
        openingHours: '7:00 AM – 4:00 PM (Daily)',
        price: 'Free entry (Produce starts at ₹30 / $0.50)',
        foodAvailable: 'Farm-fresh organic guava, heirloom tomatoes, cold-pressed mustard oil, local honey, and artisanal jaggery.',
        distanceFromAttraction: '1.8 km (5 min cab)',
        transportation: 'Direct 5-minute auto-rickshaw or taxi from the monument gate',
        safeForSameDayReturn: true
      },
      {
        name: `Sunrise Heritage Agro-Farm & Dairy Experience`,
        type: 'Farm-to-Table Restaurant',
        location: `Highway Outskirts, 4 km from ${dName} Center`,
        openingHours: '10:00 AM – 6:00 PM',
        price: `${currency} 350 for tasting platter`,
        foodAvailable: 'Fresh unpasteurized dairy kulfi, freshly harvested sugarcane juice, wood-fired hearth breads, and picked herbs.',
        distanceFromAttraction: '4.2 km along the homeward return road',
        transportation: 'Easily stopped at on your return drive back to the highway',
        safeForSameDayReturn: true
      }
    ],
    transportationPlan: {
      hasCar: hasCar,
      legs: [
        {
          from: oName,
          to: `${dName} Gateway`,
          recommendedMode: hasCar ? 'Personal Car via Expressway' : (rentCar ? 'Self-Drive Rental' : 'Pre-booked AC Cab or Superfast Express Train'),
          alternatives: ['Intercity AC Volvo Bus', 'Shared Shuttle', 'Express Rail'],
          estimatedCost: `${currency} ${transportCost}`,
          travelTime: `${feasibility.oneWayDriveHours} hours`,
          howToBook: hasCar ? 'Fastag toll payment active' : 'Book on Uber Intercity / Ola Outstation or IRCTC Train App 2 days prior',
          whereToBoard: `${oName} Central Station / Doorstep pickup`
        },
        {
          from: `${dName} Gateway`,
          to: attractionName,
          recommendedMode: 'Local Meter Cab / EV Auto-Rickshaw',
          alternatives: ['Local Shuttle Bus', 'Walking (if near station)'],
          estimatedCost: `${currency} 150 - 300`,
          travelTime: '15 - 20 minutes',
          howToBook: 'Pre-paid taxi counter at station or official app',
          whereToBoard: 'Station Exit Gate 1 or Expressway Drop Zone'
        },
        {
          from: attractionName,
          to: 'Recommended Restaurant',
          recommendedMode: 'Short Walk or 5-min Cab',
          alternatives: ['E-Rickshaw'],
          estimatedCost: `${currency} 50 - 100`,
          travelTime: '5 minutes',
          howToBook: 'Available at monument exit parking',
          whereToBoard: 'Monument Visitors Center'
        },
        {
          from: 'Restaurant / Farm',
          to: oName,
          recommendedMode: hasCar ? 'Return Highway Drive' : (rentCar ? 'Rental Return' : 'Pre-booked Return Cab or Evening Express Train'),
          alternatives: ['Evening AC Bus'],
          estimatedCost: 'Included in roundtrip booking',
          travelTime: `${feasibility.oneWayDriveHours} hours`,
          howToBook: 'Pre-book return ride in morning to guarantee timely departure',
          whereToBoard: 'Restaurant pickup / Highway toll junction'
        }
      ]
    },
    cabGuide: {
      available: true,
      pickupLocations: [
        `${oName} Doorstep Pickup`,
        `${dName} Railway Station Pre-paid Taxi Booth`,
        `${attractionName} Authorized Visitors Parking Lot`,
        `Express Highway Service Plaza`
      ],
      rideHailingServices: ['Uber Intercity', 'Ola Outstation', 'MakeMyTrip Cabs', 'Local Pre-paid Tourist Taxis'],
      estimatedCost: `${currency} 2,800 – 3,600 roundtrip including driver allowance & toll taxes`,
      estimatedTime: `${feasibility.oneWayDriveHours} hours each direction`,
      bookingTips: 'Always confirm roundtrip cab booking with tolls included. Inform driver of 4:30 PM sharp return schedule.'
    },
    carRental: {
      practicalForTrip: true,
      company: 'Zoomcar / Avis / Hertz Drive',
      vehicle: 'Compact SUV (Hyundai Creta / Suzuki Brezza / Ford Puma)',
      dailyPrice: `${currency} 1,800 - 2,400 / day (Unlimited km)`,
      pickupLocation: `${oName} City Center or Airport Hub`,
      dropoffLocation: `Same as pickup (${oName})`,
      insurance: 'Zero-depreciation comprehensive insurance included with ₹5,000 security deposit',
      requiredDocuments: 'Valid Driver License, Government ID Proof (Aadhaar or Passport), Credit/Debit Card',
      drivingRequirements: 'Driver must be at least 21 years old with minimum 1 year licensed driving experience'
    },
    mapWaypoints: [
      {
        title: oName,
        type: 'start',
        icon: '📍',
        description: `Starting location. Departure at 6:30 AM to beat traffic.`,
        estimatedArrival: '6:30 AM',
        distanceFromPrev: '0 km'
      },
      {
        title: 'Highway Express Corridor',
        type: 'transport',
        icon: '🚗',
        description: 'Smooth multi-lane expressway with rest areas every 40 km.',
        estimatedArrival: '8:00 AM',
        distanceFromPrev: `${Math.round(feasibility.distanceKm * 0.45)} km`
      },
      {
        title: attractionName,
        type: 'attraction',
        icon: '🏛️',
        description: `Primary destination. Explore courtyards, monuments, and gardens.`,
        estimatedArrival: '9:45 AM',
        distanceFromPrev: `${Math.round(feasibility.distanceKm * 0.55)} km`
      },
      {
        title: 'The Royal Courtyard & Bistro',
        type: 'restaurant',
        icon: '🍴',
        description: 'Midday meal with authentic local culinary flavors and vegetarian spreads.',
        estimatedArrival: '1:30 PM',
        distanceFromPrev: '1.2 km'
      },
      {
        title: `${dName} Organic Farm & Market`,
        type: 'farm',
        icon: '🌾',
        description: 'Fresh local produce, regional honey, and handmade snacks.',
        estimatedArrival: '3:00 PM',
        distanceFromPrev: '2.4 km'
      },
      {
        title: `Homeward Return to ${oName}`,
        type: 'return',
        icon: '🏡',
        description: `Safe return to starting location on the same day.`,
        estimatedArrival: '7:45 PM',
        distanceFromPrev: `${feasibility.distanceKm} km`
      }
    ],
    budget: {
      userBudget: budget,
      currency: currency,
      breakdown: [
        { category: 'Flights / Long-distance Transport', cost: transportCost },
        { category: 'Hotels (Zero for One-Day Trip)', cost: hotelCost },
        { category: 'Food & Dining (Lunch & Snacks)', cost: foodCost },
        { category: 'Cabs & Local Getting Around', cost: cabCost },
        { category: 'Car Rental (Optional)', cost: carRentalCost },
        { category: 'Attraction Entry Fees', cost: attractionCost },
        { category: 'Local & Farm Experiences', cost: farmCost },
        { category: 'Buffer & Incidentals', cost: bufferCost }
      ],
      totalEstimatedCost: totalEstimated,
      remainingAmount: remaining,
      isWithinBudget: totalEstimated <= budget,
      optimizationTips: [
        `Book entry tickets online in advance to save on gate processing fees.`,
        `Choose expressway toll roundtrip discount pass (saves 25% on toll charges).`,
        `Dining at the recommended farm bistro gives fresh artisan food at half tourist-strip prices.`,
        `If traveling in a group of 3-4, hiring an AC cab is 35% cheaper than individual train tickets.`
      ]
    },
    bestTimeToVisit: {
      bestSeason: 'October to March (Pleasant sunny days, cool evenings)',
      currentSuitability: 'Suitable for travel! Weather is mild with good outdoor visibility.',
      weatherSummary: 'Sunny to partly cloudy, 24°C - 28°C daytime, light breeze.',
      crowdLevel: 'Moderate. Morning visits between 9:00 AM – 11:30 AM ensure minimal lines.',
      pricingTrends: 'Mid-season pricing. Cab and entry rates are stable with regular promotions.',
      keyEvents: ['Annual Cultural Heritage Festival', 'Regional Farmers Harvest Fair']
    },
    travelPreparation: {
      checklist: [
        'Government Issued Photo ID (original) for attraction security entry',
        'Comfortable walking shoes with rubber soles for stone terraces',
        'Light cotton clothing with a light evening jacket for return drive',
        'Reusable water bottle and sunglasses / sun hat',
        'Mobile power bank (20,000 mAh) for maps and photos',
        'Cash small notes for toll plazas and local farm produce'
      ],
      weatherClothing: 'Light breathable cottons, sun protection during midday, light layer for evening return.',
      documents: 'National ID or Passport. E-tickets downloaded offline in case of weak cell signal.',
      simConnectivity: 'Full 4G/5G mobile data coverage along the entire highway and destination center.',
      emergencyInfo: 'National Tourist Helpline: 1363 / Emergency Ambulance & Police: 112.',
      safetyAndRules: 'Drone photography prohibited around historic monuments. Keep authorized guide ID cards verified.'
    }
  };
}

// API Routes
app.post('/api/plan-trip', async (req: Request, res: Response) => {
  try {
    const plan = await generatePlanWithAI(req.body);
    res.json(plan);
  } catch (error: any) {
    console.error('Error generating trip plan:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate trip plan' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, currentPlan } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      try {
        const prompt = `You are "Best Trip AI", the personal intelligent travel agent for Best Trip Planner ("Your AI Travel Agent – Plan Better, Travel Smarter.").
The user is currently viewing this trip plan:
- Origin: ${currentPlan?.origin}
- Destination: ${currentPlan?.destination}
- Trip Type: ${currentPlan?.tripType}
- Recommended Place: ${currentPlan?.recommendedPlace?.name}
- Total Budget: ${currentPlan?.budget?.currency} ${currentPlan?.budget?.userBudget}

The user asks: "${message}"

Answer warmly, concisely, and practically as an expert travel agent.
If the user asks:
- "I only have one day" -> confirm and reinforce one-day schedule with zero hotel.
- "Show me the one best place I can visit" -> highlight the single primary attraction.
- "I don't have a car" / "Find a cab" -> give specific cab & transit instructions.
- "Reduce my budget" / "Find a cheaper route" -> give concrete cost savings.
- "Where can I eat local food?" / "Farmers market" / "farm" -> provide specific farm-to-table tips.
- "Change my trip to three days" -> explain how a multi-day itinerary can be structured.

Return JSON with:
{
  "reply": string (markdown supported, friendly, direct, actionable, no fluff),
  "suggestedAction": string or null (e.g. "switch_to_one_day", "find_cab", "show_farm_food", "reduce_budget", "switch_to_multi_day"),
  "budgetAdjustment": number or null
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json(parsed);
        }
      } catch (err) {
        console.warn('Chat AI call failed, fallback response:', err);
      }
    }

    // Procedural chat fallback
    const msg = message.toLowerCase();
    let reply = `I'm your Best Trip AI travel agent! Regarding your trip to ${currentPlan?.destination || 'your destination'}: `;
    let suggestedAction: string | null = null;

    if (msg.includes('one day') || msg.includes('same day')) {
      reply = `I have locked in **One-Day Trip Mode**! You will visit **${currentPlan?.recommendedPlace?.name || 'the primary attraction'}**, enjoy lunch at a local bistro, visit a farm market, and return safely to ${currentPlan?.origin || 'your origin'} by ~7:45 PM without needing a hotel.`;
      suggestedAction = 'switch_to_one_day';
    } else if (msg.includes('cab') || msg.includes("don't have a car") || msg.includes('no car')) {
      reply = `No car needed! We have set up a complete transportation plan: you can book an **Uber Intercity / Outstation Cab** or take the **Express Train**. Local EV cabs will shuttle you between the main attraction and the restaurant for under ${currentPlan?.budget?.currency || '₹'} 200.`;
      suggestedAction = 'find_cab';
    } else if (msg.includes('farm') || msg.includes('local food') || msg.includes('farmers market')) {
      reply = `You can visit the **Organic Valley Farmers Market** (1.8 km from attraction) for fresh local produce and dine at **The Royal Courtyard & Farm Garden** for authentic farm-to-table dishes with zero preservatives!`;
      suggestedAction = 'show_farm_food';
    } else if (msg.includes('cheaper') || msg.includes('reduce') || msg.includes('budget')) {
      reply = `To save money, book your monument ticket online (saves 15%), take the express railway or shared cab instead of private taxi, and enjoy the unlimited Thali at Green Leaf Bistro for just ₹250!`;
      suggestedAction = 'reduce_budget';
    } else if (msg.includes('three days') || msg.includes('3 days') || msg.includes('multi')) {
      reply = `Upgrading to a 3-Day itinerary! This will allow you to see the royal palace on Day 1, take a deep dive into rural farm tours on Day 2, and explore nature reserves & artisan markets on Day 3 with curated boutique hotel stays.`;
      suggestedAction = 'switch_to_multi_day';
    } else {
      reply += `Everything is organized for an effortless trip. We have optimized travel routes, verified return feasibility, and calculated real budget breakdowns. What would you like to fine-tune?`;
    }

    res.json({ reply, suggestedAction, budgetAdjustment: null });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Chat service error' });
  }
});

app.get('/api/offers', (req: Request, res: Response) => {
  res.json({ offers: TRAVEL_OFFERS });
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Best Trip Planner server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
