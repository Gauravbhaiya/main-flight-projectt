import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Booking, BookingDTO } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8765/booking';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createBooking(bookingData: BookingDTO): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/create`, bookingData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Create booking error:', error);
        return throwError(() => error);
      })
    );
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/get/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Get booking error:', error);
        return throwError(() => error);
      })
    );
  }

  getUserBookings(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/get/user/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Get user bookings error:', error);
        return throwError(() => error);
      })
    );
  }

  cancelBooking(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Cancel booking error:', error);
        return throwError(() => error);
      })
    );
  }

  confirmBooking(bookingId: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/confirm/${bookingId}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Confirm booking error:', error);
        return throwError(() => error);
      })
    );
  }
}