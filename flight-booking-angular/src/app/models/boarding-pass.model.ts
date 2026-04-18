export interface BoardingPass {
  id?: number;
  bookingId: number;
  passengerId: number;
  flightId: number;
  passengerName: string;
  seatNumber: string;
  gate: string;
  boardingTime: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  flightNumber: string;
  aircraft: string;
  terminal: string;
  class: string;
  baggage: string;
  checkinTime: string;
  qrCode: string;
  barcode: string;
  pnr: string;
  ticketNumber: string;
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
}