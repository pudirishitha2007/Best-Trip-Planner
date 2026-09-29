export type TripType = 'one-day' | 'multi-day';

export interface TripSearchParams {
  destination: string;
  origin: string;
  tripType: TripType;
  days: number;
  startDate: string;
  returnDate: string;
  travelers: number;
  budget: number;
  currency: string;
  hasCar: boolean;
  needsCab: boolean;
  rentCar: boolean;
  hotelPreference: string;
  foodPreference: string;
  travelStyle: string;
  onlyOneBestPlace: boolean;
}

export interface ReturnGuarantee {
  isFeasibleSameDay: boolean;
  totalTravelTimeMinutes: number;
  recommendedDepartureTime: string;
  expectedArrivalTimeHome: string;
  bufferTimeMinutes: number;
  feasibilityExplanation: string;
  warningMessage: string | null;
  closerAlternative: string | null;
}

export interface RecommendedPlace {
  name: string;
  imageType: string;
  shortDescription: string;
  whyFitsOneDay: string;
  distanceFromOriginKm: number;
  estimatedTravelTime: string;
  openingHours: string;
  entryFee: string;
  recommendedDuration: string;
  nearbyFoodSummary: string;
  practicalTransportation: string;
  guidedRouteSummary: string;
}

export interface AlternativePlace {
  name: string;
  shortDescription: string;
  whyAlternative: string;
}

export interface TimelineItem {
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Return';
  activity: string;
  details: string;
  location: string;
  icon: string;
}

export interface MultiDayItineraryDay {
  day: number;
  title: string;
  theme: string;
  morning: string;
  afternoon: string;
  evening: string;
  highlightAttractions: string[];
}

export interface FlightOption {
  isFlightPractical: boolean;
  analysisMessage: string;
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: string;
  price: string;
  baggage: string;
  returnFlight: string;
  bookingUrl: string;
}

export interface HotelItem {
  name: string;
  location: string;
  rating: number;
  pricePerNight: string;
  roomType: string;
  facilities: string[];
  distanceFromAttraction: string;
}

export interface HotelSection {
  required: boolean;
  noticeMessage: string;
  items: HotelItem[];
}

export interface RestaurantItem {
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  popularDishes: string[];
  vegetarianOptions: string;
  indianFoodOptions: string;
  openingHours: string;
  distanceFromAttraction: string;
  directions: string;
}

export interface LocalFarmFoodItem {
  name: string;
  type: string;
  location: string;
  openingHours: string;
  price: string;
  foodAvailable: string;
  distanceFromAttraction: string;
  transportation: string;
  safeForSameDayReturn: boolean;
}

export interface TransportationLeg {
  from: string;
  to: string;
  recommendedMode: string;
  alternatives: string[];
  estimatedCost: string;
  travelTime: string;
  howToBook: string;
  whereToBoard: string;
}

export interface TransportationPlan {
  hasCar: boolean;
  legs: TransportationLeg[];
}

export interface CabGuide {
  available: boolean;
  pickupLocations: string[];
  rideHailingServices: string[];
  estimatedCost: string;
  estimatedTime: string;
  bookingTips: string;
}

export interface CarRental {
  practicalForTrip: boolean;
  company: string;
  vehicle: string;
  dailyPrice: string;
  pickupLocation: string;
  dropoffLocation: string;
  insurance: string;
  requiredDocuments: string;
  drivingRequirements: string;
}

export interface MapWaypoint {
  title: string;
  type: 'start' | 'transport' | 'attraction' | 'restaurant' | 'farm' | 'return';
  icon: string;
  description: string;
  estimatedArrival: string;
  distanceFromPrev: string;
}

export interface BudgetBreakdownItem {
  category: string;
  cost: number;
}

export interface BudgetPlan {
  userBudget: number;
  currency: string;
  breakdown: BudgetBreakdownItem[];
  totalEstimatedCost: number;
  remainingAmount: number;
  isWithinBudget: boolean;
  optimizationTips: string[];
}

export interface BestTimeToVisit {
  bestSeason: string;
  currentSuitability: string;
  weatherSummary: string;
  crowdLevel: string;
  pricingTrends: string;
  keyEvents: string[];
}

export interface TravelPreparation {
  checklist: string[];
  weatherClothing: string;
  documents: string;
  simConnectivity: string;
  emergencyInfo: string;
  safetyAndRules: string;
}

export interface TripPlan {
  destination: string;
  origin: string;
  tripType: TripType;
  dataStatus: 'LIVE' | 'ESTIMATED' | 'LAST UPDATED';
  lastUpdated: string;
  returnGuarantee: ReturnGuarantee;
  recommendedPlace: RecommendedPlace;
  alternativePlaces: AlternativePlace[];
  timeline: TimelineItem[];
  multiDayItinerary: MultiDayItineraryDay[];
  flights: FlightOption;
  hotels: HotelSection;
  restaurants: RestaurantItem[];
  localAndFarmFood: LocalFarmFoodItem[];
  transportationPlan: TransportationPlan;
  cabGuide: CabGuide;
  carRental: CarRental;
  mapWaypoints: MapWaypoint[];
  budget: BudgetPlan;
  bestTimeToVisit: BestTimeToVisit;
  travelPreparation: TravelPreparation;
}

export interface TravelOffer {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  expires: string;
  category: string;
}
