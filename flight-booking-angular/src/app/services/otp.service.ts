import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtpRequest {
  email: string;
  name: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  private apiUrl = 'http://localhost:8090/api/otp'; // Profile management service port

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  sendOtp(otpRequest: OtpRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/send`, otpRequest, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  verifyOtp(verification: OtpVerification): Observable<string> {
    return this.http.post(`${this.apiUrl}/verify`, verification, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}