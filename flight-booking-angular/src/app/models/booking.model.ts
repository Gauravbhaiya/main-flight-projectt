export interface Booking {
  id?: number;
  flightId: number;
  userId: number;
  numberOfPassengers: number;
  bookingDate: string;
  status: string;
  totalFare: number;
  class?: string;
  passengers: Passenger[];
}

export interface Passenger {
  passengerId?: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  aadharNumber: number;
  flightId: number;
}

export interface BookingDTO {
  flightId: number;
  userId: number;
  numberOfPassengers: number;
  bookingDate: string;
  status: string;
  totalFare: number;
  passengers: Passenger[];
}