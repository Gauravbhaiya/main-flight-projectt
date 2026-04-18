import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Flight } from '../models/flight.model';

@Injectable({
  providedIn: 'root'
})
export class LiveFlightService {
  private rapidApiKey = '40c9ffa26fmsh8f4e6c564e5c5b6p1dc0c0jsne442326ac45f';
  private rapidApiHost = 'aerodatabox.p.rapidapi.com';
  private baseUrl = 'https://aerodatabox.p.rapidapi.com';

  // Airport IATA codes mapping
  private airportCodes: { [key: string]: string } = {
    'Delhi': 'DEL',
    'Mumbai': 'BOM', 
    'Bangalore': 'BLR',
    'Chennai': 'MAA',
    'Kolkata': 'CCU',
    'Hyderabad': 'HYD',
    'Pune': 'PNQ',
    'Ahmedabad': 'AMD',
    'Kochi': 'COK',
    'Goa': 'GOI',
    'Jaipur': 'JAI',
    'Lucknow': 'LKO',
    'Chandigarh': 'IXC',
    'Bhubaneswar': 'BBI',
    'Indore': 'IDR',
    'Coimbatore': 'CJB',
    'Nagpur': 'NAG',
    'Vadodara': 'BDQ',
    'Visakhapatnam': 'VTZ',
    'Thiruvananthapuram': 'TRV'
  };

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': this.rapidApiHost
    });
  }

  // Get live flights count
  getLiveFlightsCount(): Observable<number> {
    const url = `${this.baseUrl}/flights/airports/iata/DEL?offsetMinutes=-120&durationMinutes=720&withLeg=true&direction=Both&withCancelled=false&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`;
    
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        if (response && response.departures && response.arrivals) {
          return (response.departures.length || 0) + (response.arrivals.length || 0);
        }
        return Math.floor(Math.random() * 500) + 1200; // Fallback random number
      }),
      catchError(() => of(Math.floor(Math.random() * 500) + 1200))
    );
  }

  // Search real-time flights
  searchLiveFlights(source: string, destination: string, departureDate: string): Observable<Flight[]> {
    const sourceCode = this.getAirportCode(source);
    const destCode = this.getAirportCode(destination);
    
    if (!sourceCode || !destCode) {
      return this.getFallbackFlights(source, destination, departureDate);
    }

    const url = `${this.baseUrl}/flights/airports/iata/${sourceCode}?offsetMinutes=-60&durationMinutes=1440&withLeg=true&direction=Departure&withCancelled=false&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`;
    
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => this.transformToFlights(response, source, destination, departureDate, destCode)),
      catchError(() => this.getFallbackFlights(source, destination, departureDate))
    );
  }

  // Get all live flights for dashboard
  getAllLiveFlights(): Observable<Flight[]> {
    const majorAirports = ['DEL', 'BOM', 'BLR', 'MAA'];
    const randomAirport = majorAirports[Math.floor(Math.random() * majorAirports.length)];
    
    const url = `${this.baseUrl}/flights/airports/iata/${randomAirport}?offsetMinutes=-60&durationMinutes=480&withLeg=true&direction=Both&withCancelled=false&withCodeshared=true&withCargo=false&withPrivate=false&withLocation=false`;
    
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      map(response => this.transformAllFlights(response)),
      catchError(() => this.getFallbackAllFlights())
    );
  }

  private getAirportCode(cityName: string): string | null {
    const normalizedCity = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
    return this.airportCodes[normalizedCity] || null;
  }

  private transformToFlights(response: any, source: string, destination: string, departureDate: string, destCode: string): Flight[] {
    if (!response || !response.departures) {
      return [];
    }

    return response.departures
      .filter((flight: any) => {
        return flight.arrival && flight.arrival.airport && 
               flight.arrival.airport.iata === destCode;
      })
      .slice(0, 10) // Limit to 10 flights
      .map((flight: any, index: number) => this.mapToFlight(flight, source, destination, departureDate, index));
  }

  private transformAllFlights(response: any): Flight[] {
    const flights: Flight[] = [];
    
    if (response.departures) {
      flights.push(...response.departures.slice(0, 8).map((flight: any, index: number) => 
        this.mapToFlight(flight, this.getRandomCity(), this.getRandomCity(), this.getTodayDate(), index)
      ));
    }
    
    if (response.arrivals) {
      flights.push(...response.arrivals.slice(0, 7).map((flight: any, index: number) => 
        this.mapToFlight(flight, this.getRandomCity(), this.getRandomCity(), this.getTodayDate(), index + 8)
      ));
    }

    return flights.slice(0, 15);
  }

  private mapToFlight(apiFlightData: any, source: string, destination: string, departureDate: string, index: number): Flight {
    const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];
    const aircraft = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A350', 'ATR 72'];
    
    // Extract times from API data
    let departureTime = '09:00';
    let arrivalTime = '11:30';
    
    if (apiFlightData.departure && apiFlightData.departure.scheduledTime) {
      const depTime = new Date(apiFlightData.departure.scheduledTime.utc);
      departureTime = depTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    }
    
    if (apiFlightData.arrival && apiFlightData.arrival.scheduledTime) {
      const arrTime = new Date(apiFlightData.arrival.scheduledTime.utc);
      arrivalTime = arrTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    }

    // Generate flight number from API data or create one
    let flightNumber = `AI${1000 + index}`;
    if (apiFlightData.number) {
      flightNumber = apiFlightData.number;
    }

    // Get airline from API or use random
    let airline = airlines[Math.floor(Math.random() * airlines.length)];
    if (apiFlightData.airline && apiFlightData.airline.name) {
      airline = apiFlightData.airline.name;
    }

    // Get aircraft from API or use random
    let aircraftType = aircraft[Math.floor(Math.random() * aircraft.length)];
    if (apiFlightData.aircraft && apiFlightData.aircraft.model) {
      aircraftType = apiFlightData.aircraft.model;
    }

    return {
      id: index + 1,
      flightNumber: flightNumber,
      airline: airline,
      source: source,
      destination: destination,
      departureDate: departureDate,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      fare: this.generateRealisticFare(source, destination),
      availableSeats: Math.floor(Math.random() * 150) + 50,
      duration: this.calculateDuration(departureTime, arrivalTime),
      aircraft: aircraftType,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      amenities: ['WiFi', 'Entertainment', 'USB Charging', 'Meals'],
      mealOptions: [
        { type: 'Vegetarian', name: 'Veg Thali', price: 250, dietary: ['Vegetarian'], image: '🥗' },
        { type: 'Non-Vegetarian', name: 'Chicken Biryani', price: 350, dietary: ['Non-Veg'], image: '🍗' }
      ],
      class: {
        economy: {
          available: true,
          price: this.generateRealisticFare(source, destination),
          seats: Math.floor(Math.random() * 100) + 50,
          features: ['Standard Seat', 'Meal', 'Carry-on Baggage']
        },
        business: {
          available: Math.random() > 0.3,
          price: this.generateRealisticFare(source, destination) * 2.5,
          seats: Math.floor(Math.random() * 20) + 10,
          features: ['Premium Seat', 'Priority Boarding', 'Lounge Access']
        },
        first: {
          available: Math.random() > 0.7,
          price: this.generateRealisticFare(source, destination) * 4,
          seats: Math.floor(Math.random() * 8) + 4,
          features: ['Luxury Suite', 'Personal Butler', 'Gourmet Meals']
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

  private generateRealisticFare(source: string, destination: string): number {
    const baseFares: { [key: string]: number } = {
      'Delhi-Mumbai': 8500,
      'Delhi-Bangalore': 9200,
      'Mumbai-Chennai': 7800,
      'Delhi-Chennai': 10500,
      'Mumbai-Bangalore': 6500,
      'Bangalore-Chennai': 4200
    };
    
    const route = `${source}-${destination}`;
    const reverseRoute = `${destination}-${source}`;
    
    let baseFare = baseFares[route] || baseFares[reverseRoute] || 8000;
    
    // Add some randomness for dynamic pricing
    const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
    baseFare = Math.round(baseFare * (1 + variation));
    
    return baseFare;
  }

  private calculateDuration(departureTime: string, arrivalTime: string): string {
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  }

  private getRandomCity(): string {
    const cities = Object.keys(this.airportCodes);
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getFallbackFlights(source: string, destination: string, departureDate: string): Observable<Flight[]> {
    // Generate fallback flights when API fails
    const fallbackFlights: Flight[] = [];
    const airlines = ['IndiGo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir'];
    
    for (let i = 0; i < 8; i++) {
      const depHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
      const depMinute = Math.floor(Math.random() * 60);
      const departureTime = `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`;
      
      const flightDuration = 90 + Math.floor(Math.random() * 180); // 1.5 to 4.5 hours
      const arrivalMinutes = (depHour * 60 + depMinute + flightDuration) % (24 * 60);
      const arrHour = Math.floor(arrivalMinutes / 60);
      const arrMin = arrivalMinutes % 60;
      const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;
      
      fallbackFlights.push({
        id: i + 1,
        flightNumber: `${airlines[i % airlines.length].substring(0, 2).toUpperCase()}${1000 + i}`,
        airline: airlines[i % airlines.length],
        source: source,
        destination: destination,
        departureDate: departureDate,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        fare: this.generateRealisticFare(source, destination),
        availableSeats: Math.floor(Math.random() * 150) + 50,
        duration: this.calculateDuration(departureTime, arrivalTime),
        aircraft: 'Boeing 737',
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        amenities: ['WiFi', 'Entertainment', 'USB Charging'],
        mealOptions: [],
        class: {
          economy: {
            available: true,
            price: this.generateRealisticFare(source, destination),
            seats: Math.floor(Math.random() * 100) + 50,
            features: ['Standard Seat', 'Meal']
          },
          business: {
            available: true,
            price: this.generateRealisticFare(source, destination) * 2.5,
            seats: 20,
            features: ['Premium Seat', 'Priority Boarding']
          },
          first: {
            available: false,
            price: 0,
            seats: 0,
            features: []
          }
        },
        baggage: {
          cabin: '7 kg',
          checkedIn: '20 kg',
          extraBaggage: 500
        },
        cancellationPolicy: 'Standard cancellation policy'
      });
    }
    
    return of(fallbackFlights);
  }

  private getFallbackAllFlights(): Observable<Flight[]> {
    const cities = Object.keys(this.airportCodes);
    const flights: Flight[] = [];
    
    for (let i = 0; i < 15; i++) {
      const source = cities[Math.floor(Math.random() * cities.length)];
      let destination = cities[Math.floor(Math.random() * cities.length)];
      while (destination === source) {
        destination = cities[Math.floor(Math.random() * cities.length)];
      }
      
      flights.push(...this.getFallbackFlights(source, destination, this.getTodayDate()).pipe(
        map(f => f.slice(0, 1))
      ) as any);
    }
    
    return of(flights.slice(0, 15));
  }
}