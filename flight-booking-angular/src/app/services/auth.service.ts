import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User, LoginDTO, RegisterDTO, ResponseDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8765/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      // In real app, decode JWT token to get user info
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.currentUserSubject.next(user);
    }
  }

  login(credentials: LoginDTO): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          // Create user object from credentials since backend doesn't return user details
          const user: User = {
            username: credentials.username,
            name: credentials.username,
            email: '',
            role: response.role as any
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error.error || 'Login failed');
        })
      );
  }

  register(userData: RegisterDTO): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, userData, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error.error || 'Registration failed');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsers`, { headers })
      .pipe(
        catchError(error => {
          console.error('Get users error:', error);
          return throwError(() => error);
        })
      );
  }
}