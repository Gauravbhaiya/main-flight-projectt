import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { BoardingPass } from '../models/boarding-pass.model';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BoardingPassService {
  private apiUrl = 'http://localhost:8080/boarding-pass';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Generate boarding pass after successful payment with real flight data
  generateBoardingPass(booking: Booking, flightData?: any): Observable<BoardingPass[]> {
    console.log('Generating boarding pass for booking:', booking, 'with flight data:', flightData);
    
    // Create boarding passes with real flight data if available
    const boardingPasses: BoardingPass[] = booking.passengers.map((passenger, index) => {
      const seatNumber = this.generateSeatNumber(index);
      const gate = this.generateGate();
      const boardingTime = flightData ? this.calculateBoardingTimeFromFlight(flightData.departureTime) : this.calculateBoardingTime();
      const departureTime = flightData ? flightData.departureTime : this.calculateDepartureTime();
      const origin = flightData ? this.getCityCode(flightData.source) : 'DEL';
      const destination = flightData ? this.getCityCode(flightData.destination) : 'BOM';
      const flightNumber = flightData ? flightData.flightNumber : `AI-${Math.floor(Math.random() * 1000)}`;
      
      return {
        id: Math.floor(Math.random() * 10000),
        bookingId: booking.id!,
        passengerId: passenger.passengerId || index + 1,
        flightId: booking.flightId,
        passengerName: `${passenger.firstName} ${passenger.lastName}`.toUpperCase(),
        seatNumber: seatNumber,
        gate: gate,
        boardingTime: boardingTime,
        departureTime: departureTime,
        arrivalTime: this.calculateArrivalTime(departureTime),
        origin: origin,
        destination: destination,
        originCity: flightData ? flightData.source : 'Delhi',
        destinationCity: flightData ? flightData.destination : 'Mumbai',
        flightNumber: flightNumber,
        aircraft: this.generateAircraft(),
        terminal: this.generateTerminal(),
        class: booking.class || 'Economy',
        baggage: '20KG',
        checkinTime: this.calculateCheckinTime(boardingTime),
        qrCode: this.generateQRCode(booking.id!, passenger.passengerId || index + 1),
        barcode: this.generateBarcode(booking.id!, passenger.passengerId || index + 1),
        pnr: this.generatePNR(),
        ticketNumber: this.generateTicketNumber(),
        status: 'ACTIVE'
      };
    });

    // Store boarding passes locally
    this.storeBoardingPasses(boardingPasses);
    console.log('Generated boarding passes:', boardingPasses);

    return of(boardingPasses);
  }

  // Get boarding passes for a booking
  getBoardingPassesByBooking(bookingId: number): Observable<BoardingPass[]> {
    const storedPasses = this.getStoredBoardingPasses();
    const bookingPasses = storedPasses.filter(pass => pass.bookingId === bookingId);
    return of(bookingPasses);
  }

  // Get all boarding passes for a user
  getUserBoardingPasses(userId: number): Observable<BoardingPass[]> {
    const storedPasses = this.getStoredBoardingPasses();
    return of(storedPasses);
  }

  // Store boarding passes in localStorage
  private storeBoardingPasses(boardingPasses: BoardingPass[]): void {
    const existingPasses = this.getStoredBoardingPasses();
    const updatedPasses = [...existingPasses, ...boardingPasses];
    localStorage.setItem('boardingPasses', JSON.stringify(updatedPasses));
  }

  // Get stored boarding passes from localStorage
  private getStoredBoardingPasses(): BoardingPass[] {
    const stored = localStorage.getItem('boardingPasses');
    return stored ? JSON.parse(stored) : [];
  }

  // Generate seat number
  private generateSeatNumber(index: number): string {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatRow = Math.floor(Math.random() * 30) + 1;
    const seatLetter = rows[index % rows.length];
    return `${seatRow}${seatLetter}`;
  }

  // Generate gate number
  private generateGate(): string {
    const gates = ['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D7', 'D8'];
    return gates[Math.floor(Math.random() * gates.length)];
  }

  // Calculate boarding time (30 minutes before departure)
  private calculateBoardingTime(): string {
    const now = new Date();
    now.setHours(now.getHours() + 2); // 2 hours from now
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // Calculate boarding time from flight departure time
  private calculateBoardingTimeFromFlight(departureTime: string): string {
    const [hours, minutes] = departureTime.split(':').map(Number);
    let boardingHours = hours;
    let boardingMinutes = minutes - 30;
    
    if (boardingMinutes < 0) {
      boardingMinutes += 60;
      boardingHours -= 1;
    }
    
    if (boardingHours < 0) {
      boardingHours += 24;
    }
    
    return `${boardingHours.toString().padStart(2, '0')}:${boardingMinutes.toString().padStart(2, '0')}`;
  }

  // Calculate departure time
  private calculateDepartureTime(): string {
    const now = new Date();
    now.setHours(now.getHours() + 2.5); // 2.5 hours from now
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  // Generate QR code string
  private generateQRCode(bookingId: number, passengerId: number): string {
    return `BP${bookingId}${passengerId}${Date.now()}`;
  }

  // Generate barcode
  private generateBarcode(bookingId: number, passengerId: number): string {
    return `${bookingId}${passengerId}${Math.floor(Math.random() * 1000000)}`;
  }

  // Generate PNR
  private generatePNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Generate ticket number
  private generateTicketNumber(): string {
    return `${Math.floor(Math.random() * 900000000) + 100000000}`;
  }

  // Generate aircraft type
  private generateAircraft(): string {
    const aircraft = ['Boeing 737-800', 'Airbus A320', 'Boeing 777-300ER', 'Airbus A321', 'Boeing 787-8', 'Airbus A330'];
    return aircraft[Math.floor(Math.random() * aircraft.length)];
  }

  // Generate terminal
  private generateTerminal(): string {
    const terminals = ['T1', 'T2', 'T3'];
    return terminals[Math.floor(Math.random() * terminals.length)];
  }

  // Calculate arrival time (2 hours after departure)
  private calculateArrivalTime(departureTime: string): string {
    const [hours, minutes] = departureTime.split(':').map(Number);
    let arrivalHours = hours + 2;
    let arrivalMinutes = minutes;
    
    if (arrivalHours >= 24) {
      arrivalHours -= 24;
    }
    
    return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
  }

  // Calculate check-in time (2 hours before boarding)
  private calculateCheckinTime(boardingTime: string): string {
    const [hours, minutes] = boardingTime.split(':').map(Number);
    let checkinHours = hours - 2;
    let checkinMinutes = minutes;
    
    if (checkinHours < 0) {
      checkinHours += 24;
    }
    
    return `${checkinHours.toString().padStart(2, '0')}:${checkinMinutes.toString().padStart(2, '0')}`;
  }
  
  // Get proper airport codes for cities
  private getCityCode(city: string): string {
    const codes: {[key: string]: string} = {
      'Mumbai': 'BOM', 'Delhi': 'DEL', 'Bangalore': 'BLR', 'Chennai': 'MAA',
      'Kolkata': 'CCU', 'Hyderabad': 'HYD', 'Pune': 'PNQ', 'Ahmedabad': 'AMD',
      'Jaipur': 'JAI', 'Goa': 'GOI', 'Kochi': 'COK', 'Lucknow': 'LKO',
      'Dubai': 'DXB', 'Singapore': 'SIN', 'London': 'LHR', 'New York': 'JFK',
      'Paris': 'CDG', 'Tokyo': 'NRT', 'Bangkok': 'BKK', 'Kuala Lumpur': 'KUL'
    };
    return codes[city] || city.substring(0, 3).toUpperCase();
  }

  // Cancel boarding pass
  cancelBoardingPass(boardingPassId: number): Observable<string> {
    const storedPasses = this.getStoredBoardingPasses();
    const updatedPasses = storedPasses.map(pass => 
      pass.id === boardingPassId ? { ...pass, status: 'CANCELLED' as const } : pass
    );
    localStorage.setItem('boardingPasses', JSON.stringify(updatedPasses));
    return of('Boarding pass cancelled successfully');
  }
}