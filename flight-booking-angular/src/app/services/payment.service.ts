import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { getPaymentConfig } from '../config/payment.config';

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl?: string;
}

export interface PaymentRequest {
  bookingId: number;
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8095/api/payment';
  private paymentConfig = getPaymentConfig();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Create payment order with your backend
  createPaymentOrder(paymentRequest: PaymentRequest): Observable<PaymentOrder> {
    const params = `bookingId=${paymentRequest.bookingId}&amount=${paymentRequest.amount}`;
    return this.http.post<PaymentOrder>(`${this.apiUrl}/create-order?${params}`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Create payment order error:', error);
        return throwError(() => error);
      })
    );
  }

  // Verify payment with your backend
  verifyPayment(paymentData: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/verify-payment`, paymentData, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Verify payment error:', error);
        return throwError(() => error);
      })
    );
  }

  // Handle successful payment
  handlePaymentSuccess(bookingId: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/payment-success?bookingId=${bookingId}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Payment success error:', error);
        return throwError(() => error);
      })
    );
  }

  // Handle failed payment
  handlePaymentFailure(paymentId: string, orderId: string, bookingId: number, reason: string): Observable<any> {
    const data = { paymentId, orderId, bookingId, reason };
    return this.http.post(`${this.apiUrl}/payment-failure`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Payment failure error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get payment status
  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${paymentId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Get payment status error:', error);
        return throwError(() => error);
      })
    );
  }

  // Refund payment
  refundPayment(paymentId: string, amount: number, reason: string): Observable<any> {
    const data = { paymentId, amount, reason };
    return this.http.post(`${this.apiUrl}/refund`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Refund payment error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get Razorpay key (for frontend)
  getRazorpayKey(): string {
    return this.paymentConfig.razorpay.keyId;
  }

  // Get Stripe key (for frontend)
  getStripeKey(): string {
    return this.paymentConfig.stripe.publishableKey;
  }

  // Get UPI details
  getUPIDetails() {
    return this.paymentConfig.upi;
  }

  // Get Paytm merchant ID
  getPaytmMerchantId(): string {
    return this.paymentConfig.paytm.merchantId;
  }
}