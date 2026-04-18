import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, catchError, throwError, tap } from 'rxjs';
import { Flight, FlightDTO } from '../models/flight.model';
import { Booking, BookingDTO } from '../models/booking.model';
import { BoardingPass } from '../models/boarding-pass.model';
import { BookingService } from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'http://localhost:8765/flight';
  private flights: Flight[] = [];
  
  constructor(private http: HttpClient, private bookingService: BookingService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, using default headers');
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  searchFlights(source: string, destination: string, departureDate: string): Observable<Flight[]> {
    const params = new HttpParams()
      .set('source', source)
      .set('destination', destination)
      .set('departureDate', departureDate);
    
    return this.http.get<Flight[]>(`${this.apiUrl}/search`, { 
      headers: this.getHeaders(), 
      params 
    }).pipe(
      catchError(error => {
        console.error('Search flights error:', error);
        return throwError(() => error);
      })
    );
  }

  getAllFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/getAll`, {
      headers: this.getHeaders()
    }).pipe(
      tap(flights => {
        // Enhance flights with dummy data for demo
        this.flights = flights.map(flight => this.enhanceFlightData(flight));
      }),
      catchError(error => {
        console.error('Get all flights error:', error);
        return throwError(() => error);
      })
    );
  }
  
  private enhanceFlightData(flight: Flight): Flight {
    const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir'];
    const aircrafts = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A350'];
    const amenities = [
      ['WiFi', 'Entertainment', 'USB Charging'],
      ['WiFi', 'Meals', 'Extra Legroom', 'Priority Boarding'],
      ['Entertainment', 'Refreshments', 'USB Charging'],
      ['WiFi', 'Premium Meals', 'Lounge Access', 'Priority Check-in']
    ];
    
    const mealOptions = [
      { type: 'Vegetarian', name: 'Veg Thali', price: 250, dietary: ['Vegetarian'], image: '🥗' },
      { type: 'Non-Vegetarian', name: 'Chicken Biryani', price: 350, dietary: ['Non-Veg'], image: '🍗' },
      { type: 'Vegan', name: 'Quinoa Bowl', price: 300, dietary: ['Vegan', 'Gluten-Free'], image: '🥙' },
      { type: 'Continental', name: 'Pasta', price: 280, dietary: ['Vegetarian'], image: '🍝' }
    ];
    
    return {
      ...flight,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 to 5.0
      duration: this.calculateDuration(flight.departureTime, flight.arrivalTime),
      aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
      amenities: amenities[Math.floor(Math.random() * amenities.length)],
      mealOptions: mealOptions.slice(0, Math.floor(Math.random() * 3) + 2),
      class: {
        economy: {
          available: true,
          price: flight.fare,
          seats: flight.availableSeats,
          features: ['Standard Seat', 'Meal', 'Carry-on Baggage']
        },
        business: {
          available: Math.random() > 0.3,
          price: flight.fare * 2.5,
          seats: Math.floor(flight.availableSeats * 0.2),
          features: ['Premium Seat', 'Priority Boarding', 'Lounge Access', 'Extra Baggage']
        },
        first: {
          available: Math.random() > 0.7,
          price: flight.fare * 4,
          seats: Math.floor(flight.availableSeats * 0.1),
          features: ['Luxury Suite', 'Personal Butler', 'Gourmet Meals', 'Spa Access']
        }
      },
      baggage: {
        cabin: '7 kg',
        checkedIn: '20 kg',
        extraBaggage: 500
      },
      cancellationPolicy: 'Free cancellation up to 24 hours before departure'
    };
  }
  
  private calculateDuration(departureTime: string, arrivalTime: string): string {
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle next day arrival
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  bookFlight(flightId: number, passengerData: any): Observable<Booking> {
    // Create dummy booking for demo
    const booking: Booking = {
      id: Math.floor(Math.random() * 1000),
      flightId: flightId,
      userId: 1,
      numberOfPassengers: 1,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      totalFare: 15000,
      passengers: [{
        passengerId: 1,
        firstName: passengerData.firstName,
        lastName: passengerData.lastName,
        email: passengerData.email,
        gender: passengerData.gender,
        aadharNumber: parseInt(passengerData.aadharNumber) || 123456789012,
        flightId: flightId
      }]
    };
    
    // Add to demo bookings immediately
    this.addDemoBooking(booking);
    console.log('Demo booking created:', booking);
    return of(booking);
  }

  processPayment(bookingId: number, amount: number): Observable<any> {
    return this.bookingService.confirmBooking(bookingId).pipe(
      tap(() => {
        // Auto-generate boarding pass after successful payment
        this.generateBoardingPass(bookingId).subscribe();
      })
    );
  }

  private getStoredBookings(): Booking[] {
    const stored = localStorage.getItem('userBookings');
    return stored ? JSON.parse(stored) : [];
  }

  private saveBookings(bookings: Booking[]): void {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return of(this.getStoredBookings());
  }

  addDemoBooking(booking: Booking): void {
    const bookings = this.getStoredBookings();
    bookings.push(booking);
    this.saveBookings(bookings);
  }

  updateBookingStatus(bookingId: number, status: string): void {
    const bookings = this.getStoredBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      this.saveBookings(bookings);
    }
  }

  createFlight(flightData: FlightDTO): Observable<Flight> {
    return this.http.post<Flight>(`${this.apiUrl}/create`, flightData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Create flight error:', error);
        return throwError(() => error);
      })
    );
  }

  updateFlight(id: number, flightData: FlightDTO): Observable<Flight> {
    return this.http.put<Flight>(`${this.apiUrl}/update/${id}`, flightData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Update flight error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Delete flight error:', error);
        return throwError(() => error);
      })
    );
  }

  generateBoardingPass(bookingId: number): Observable<BoardingPass[]> {
    return this.http.post<BoardingPass[]>(`${this.apiUrl}/boarding-pass/${bookingId}`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Generate boarding pass error:', error);
        // Return dummy boarding pass for demo
        return of(this.createDummyBoardingPass(bookingId));
      })
    );
  }

  private createDummyBoardingPass(bookingId: number): BoardingPass[] {
    const gates = ['A1', 'A2', 'B3', 'C4', 'D5'];
    const seats = ['12A', '15B', '8C', '22D', '5F'];
    const aircraft = ['Boeing 737-800', 'Airbus A320', 'Boeing 777-300ER'];
    
    return [{
      id: Math.floor(Math.random() * 1000),
      bookingId: bookingId,
      passengerId: 1,
      flightId: 1,
      passengerName: 'John Doe',
      seatNumber: seats[Math.floor(Math.random() * seats.length)],
      gate: gates[Math.floor(Math.random() * gates.length)],
      boardingTime: '14:30',
      departureTime: '15:00',
      arrivalTime: '17:00',
      origin: 'DEL',
      destination: 'BOM',
      originCity: 'Delhi',
      destinationCity: 'Mumbai',
      flightNumber: 'AI101',
      aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
      terminal: 'T3',
      class: 'Economy',
      baggage: '20KG',
      checkinTime: '12:30',
      qrCode: this.generateQRCode(),
      barcode: Math.floor(Math.random() * 1000000000).toString(),
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ticketNumber: Math.floor(Math.random() * 1000000000).toString(),
      status: 'ACTIVE'
    }];
  }

  private generateQRCode(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}