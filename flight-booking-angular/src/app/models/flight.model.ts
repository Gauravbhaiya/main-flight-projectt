export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  availableSeats: number;
  // Enhanced features
  class?: FlightClass;
  rating?: number;
  duration?: string;
  aircraft?: string;
  amenities?: string[];
  mealOptions?: MealOption[];
  baggage?: BaggageInfo;
  cancellationPolicy?: string;
}

export interface FlightClass {
  economy: ClassDetails;
  business?: ClassDetails;
  first?: ClassDetails;
}

export interface ClassDetails {
  available: boolean;
  price: number;
  seats: number;
  features: string[];
}

export interface MealOption {
  type: string;
  name: string;
  price: number;
  dietary: string[];
  image?: string;
}

export interface BaggageInfo {
  cabin: string;
  checkedIn: string;
  extraBaggage: number;
}



export interface FlightDTO {
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  fare: number;
  class?: FlightClass;
  rating?: number;
  duration?: string;
  aircraft?: string;
  amenities?: string[];
  mealOptions?: MealOption[];
  baggage?: BaggageInfo;
}