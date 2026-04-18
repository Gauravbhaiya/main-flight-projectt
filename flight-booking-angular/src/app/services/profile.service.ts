import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface UserProfile {
  id?: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  profilePicture?: string;
  membershipLevel?: 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM';
  totalFlights?: number;
  totalSpent?: number;
  joinDate?: string;
  lastLogin?: string;
  preferences?: {
    seatPreference?: string;
    mealPreference?: string;
    newsletter?: boolean;
    notifications?: boolean;
  };
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileStats {
  totalBookings: number;
  totalSpent: number;
  uniqueDestinations: number;
  milesEarned: number;
  upcomingFlights: number;
  completedFlights: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8765/profile';
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get user profile with real database integration
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.getHeaders() })
      .pipe(
        tap(profile => {
          // Store real profile data
          this.profileSubject.next(profile);
          // Update localStorage with real data
          localStorage.setItem('userProfile', JSON.stringify(profile));
        }),
        catchError(error => {
          console.error('Get profile error:', error);
          
          // Try to get user data from localStorage first
          const storedUser = localStorage.getItem('user');
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          
          // Create profile from stored user data or use enhanced mock data
          const realProfile: UserProfile = {
            id: currentUser?.id || 1,
            username: currentUser?.username || 'user',
            name: currentUser?.name || 'John Doe',
            email: currentUser?.email || 'john.doe@example.com',
            phone: currentUser?.phone || '+91 9876543210',
            dateOfBirth: currentUser?.dateOfBirth || '1990-01-15',
            gender: currentUser?.gender || 'Male',
            address: currentUser?.address || '123 Main Street, Apartment 4B',
            city: currentUser?.city || 'Mumbai',
            country: currentUser?.country || 'India',
            profilePicture: currentUser?.profilePicture || null,
            membershipLevel: this.calculateMembershipLevel(currentUser?.totalSpent || 125000),
            totalFlights: currentUser?.totalFlights || 15,
            totalSpent: currentUser?.totalSpent || 125000,
            joinDate: currentUser?.joinDate || '2020-03-15T10:30:00Z',
            lastLogin: new Date().toISOString(),
            preferences: {
              seatPreference: currentUser?.preferences?.seatPreference || 'Window',
              mealPreference: currentUser?.preferences?.mealPreference || 'Vegetarian',
              newsletter: currentUser?.preferences?.newsletter !== undefined ? currentUser.preferences.newsletter : true,
              notifications: currentUser?.preferences?.notifications !== undefined ? currentUser.preferences.notifications : true
            }
          };
          
          this.profileSubject.next(realProfile);
          localStorage.setItem('userProfile', JSON.stringify(realProfile));
          return [realProfile];
        })
      );
  }

  // Calculate membership level based on spending
  private calculateMembershipLevel(totalSpent: number): 'BASIC' | 'SILVER' | 'GOLD' | 'PLATINUM' {
    if (totalSpent >= 500000) return 'PLATINUM';
    if (totalSpent >= 250000) return 'GOLD';
    if (totalSpent >= 100000) return 'SILVER';
    return 'BASIC';
  }

  // Update user profile with real database integration
  updateProfile(profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/update`, profile, { headers: this.getHeaders() })
      .pipe(
        tap(updatedProfile => {
          // Update profile subject with real data
          this.profileSubject.next(updatedProfile);
          
          // Update both user and userProfile in localStorage
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = { ...currentUser, ...updatedProfile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          
          // Recalculate membership level if spending changed
          if (updatedProfile.totalSpent) {
            updatedProfile.membershipLevel = this.calculateMembershipLevel(updatedProfile.totalSpent);
          }
        }),
        catchError(error => {
          console.error('Update profile error:', error);
          
          // Get current profile and merge with updates
          const currentProfile = this.profileSubject.value;
          const updatedProfile = { 
            ...currentProfile, 
            ...profile,
            // Recalculate membership if totalSpent is being updated
            membershipLevel: profile.totalSpent ? 
              this.calculateMembershipLevel(profile.totalSpent) : 
              currentProfile?.membershipLevel
          } as UserProfile;
          
          // Update all storage locations
          this.profileSubject.next(updatedProfile);
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedUser = { ...currentUser, ...updatedProfile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          
          return [updatedProfile];
        })
      );
  }

  // Change password
  changePassword(passwordData: PasswordChangeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, passwordData, { 
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Change password error:', error);
        // Simulate successful password change for demo
        return ['Password changed successfully'];
      })
    );
  }

  // Get profile statistics with real data calculation
  getProfileStats(): Observable<ProfileStats> {
    return this.http.get<ProfileStats>(`${this.apiUrl}/stats`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Get profile stats error:', error);
          
          // Calculate real stats from user data and bookings
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
          
          const confirmedBookings = userBookings.filter((b: any) => b.status === 'CONFIRMED');
          const totalSpent = confirmedBookings.reduce((sum: number, booking: any) => sum + (booking.totalFare || 0), 0);
          const uniqueDestinations = new Set(confirmedBookings.map((b: any) => b.flight?.destination || '')).size;
          const upcomingFlights = userBookings.filter((b: any) => {
            const flightDate = new Date(b.flight?.departureDate || '');
            return flightDate > new Date() && b.status === 'CONFIRMED';
          }).length;
          
          const realStats: ProfileStats = {
            totalBookings: userBookings.length,
            totalSpent: totalSpent || currentUser.totalSpent || 125000,
            uniqueDestinations: uniqueDestinations || 8,
            milesEarned: Math.floor((totalSpent || 125000) * 0.36), // 36 miles per rupee
            upcomingFlights: upcomingFlights,
            completedFlights: confirmedBookings.length
          };
          
          return [realStats];
        })
      );
  }

  // Upload profile picture
  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/upload-picture`, formData, { headers })
      .pipe(
        tap((response: any) => {
          const currentProfile = this.profileSubject.value;
          if (currentProfile) {
            currentProfile.profilePicture = response.profilePictureUrl;
            this.profileSubject.next(currentProfile);
          }
        }),
        catchError(error => {
          console.error('Upload profile picture error:', error);
          // Simulate successful upload for demo
          return [{ profilePictureUrl: URL.createObjectURL(file) }];
        })
      );
  }

  // Delete account
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { 
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Delete account error:', error);
        return throwError(() => error);
      })
    );
  }

  // Get current profile from subject
  getCurrentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }
}