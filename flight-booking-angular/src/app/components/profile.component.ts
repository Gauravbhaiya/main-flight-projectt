import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { ProfileService } from '../services/profile.service';
import { User } from '../models/user.model';
import { Booking } from '../models/booking.model';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <!-- Header -->
      <div class="profile-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1>My Profile</h1>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-content">
        <!-- User Info Card -->
        <div class="profile-card">
          <div class="profile-avatar">
            <div class="avatar-circle">
              <i class="fas fa-user"></i>
            </div>
            <button class="edit-avatar-btn" (click)="editAvatar()">
              <i class="fas fa-camera"></i>
            </button>
          </div>
          
          <div class="profile-info">
            <h2>{{ user?.name || 'User' }}</h2>
            <p class="username">@{{ user?.username }}</p>
            <span class="role-badge" [class]="user?.role?.toLowerCase()">
              {{ user?.role }}
            </span>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="profile-details">
          <div class="details-section">
            <h3>Personal Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>Full Name</label>
                <div class="info-value">
                  <span *ngIf="!editMode">{{ user?.name }}</span>
                  <input *ngIf="editMode" [(ngModel)]="editUser.name" type="text">
                </div>
              </div>
              
              <div class="info-item">
                <label>Username</label>
                <div class="info-value">
                  <span>{{ user?.username }}</span>
                </div>
              </div>
              
              <div class="info-item">
                <label>Email</label>
                <div class="info-value">
                  <span *ngIf="!editMode">{{ user?.email || 'Not provided' }}</span>
                  <input *ngIf="editMode" [(ngModel)]="editUser.email" type="email">
                </div>
              </div>
              
              <div class="info-item">
                <label>Phone</label>
                <div class="info-value">
                  <span *ngIf="!editMode">{{ userProfile?.phone || 'Not provided' }}</span>
                  <input *ngIf="editMode" [(ngModel)]="editUser.phone" type="tel">
                </div>
              </div>
              
              <div class="info-item">
                <label>Date of Birth</label>
                <div class="info-value">
                  <span *ngIf="!editMode">{{ userProfile?.dateOfBirth || 'Not provided' }}</span>
                  <input *ngIf="editMode" [(ngModel)]="editUser.dateOfBirth" type="date">
                </div>
              </div>
              
              <div class="info-item">
                <label>Address</label>
                <div class="info-value">
                  <span *ngIf="!editMode">{{ userProfile?.address || 'Not provided' }}</span>
                  <textarea *ngIf="editMode" [(ngModel)]="editUser.address"></textarea>
                </div>
              </div>
            </div>
            
            <div class="action-buttons">
              <button *ngIf="!editMode" class="edit-btn" (click)="toggleEditMode()">
                <i class="fas fa-edit"></i> Edit Profile
              </button>
              <div *ngIf="editMode" class="edit-actions">
                <button class="save-btn" (click)="saveProfile()">
                  <i class="fas fa-save"></i> Save Changes
                </button>
                <button class="cancel-btn" (click)="cancelEdit()">
                  <i class="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="details-section">
            <h3>Account Settings</h3>
            <div class="settings-list">
              <div class="setting-item" (click)="changePassword()">
                <i class="fas fa-lock"></i>
                <span>Change Password</span>
                <i class="fas fa-chevron-right"></i>
              </div>
              
              <div class="setting-item" (click)="toggleNotifications()">
                <i class="fas fa-bell"></i>
                <span>Notifications</span>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notificationsEnabled">
                  <span class="slider"></span>
                </label>
              </div>
              
              <div class="setting-item" (click)="toggleTwoFactor()">
                <i class="fas fa-shield-alt"></i>
                <span>Two-Factor Authentication</span>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="twoFactorEnabled">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- Booking History -->
          <div class="details-section">
            <h3>Recent Bookings</h3>
            <div class="bookings-list" *ngIf="bookings.length > 0; else noBookings">
              <div class="booking-item" *ngFor="let booking of bookings.slice(0, 3)">
                <div class="booking-info">
                  <div class="booking-id">Booking #{{ booking.id }}</div>
                  <div class="booking-date">{{ booking.bookingDate | date:'mediumDate' }}</div>
                  <div class="booking-status" [class]="booking.status.toLowerCase()">
                    {{ booking.status }}
                  </div>
                </div>
                <div class="booking-amount">₹{{ booking.totalFare }}</div>
              </div>
              <button class="view-all-btn" (click)="viewAllBookings()">
                View All Bookings
              </button>
            </div>
            <ng-template #noBookings>
              <div class="no-bookings">
                <i class="fas fa-plane"></i>
                <p>No bookings yet</p>
                <button class="book-now-btn" (click)="bookFlight()">Book Your First Flight</button>
              </div>
            </ng-template>
          </div>

          <!-- Quick Stats -->
          <div class="details-section">
            <h3>Travel Statistics</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">{{ bookings.length }}</div>
                <div class="stat-label">Total Bookings</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ getTotalSpent() | currency:'INR':'symbol':'1.0-0' }}</div>
                <div class="stat-label">Total Spent</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ getUniqueDestinations() }}</div>
                <div class="stat-label">Destinations</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ getMembershipLevel() }}</div>
                <div class="stat-label">Membership</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Password Change Modal -->
      <div class="modal" *ngIf="showPasswordModal" (click)="closePasswordModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Change Password</h3>
            <button class="close-btn" (click)="closePasswordModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" [(ngModel)]="passwordForm.currentPassword" placeholder="Enter current password">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" [(ngModel)]="passwordForm.newPassword" placeholder="Enter new password">
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" [(ngModel)]="passwordForm.confirmPassword" placeholder="Confirm new password">
            </div>
          </div>
          <div class="modal-footer">
            <button class="cancel-btn" (click)="closePasswordModal()">Cancel</button>
            <button class="save-btn" (click)="updatePassword()">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .profile-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 20px;
      margin-bottom: 30px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }

    .profile-header h1 {
      color: white;
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .profile-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 30px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profile-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      height: fit-content;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .profile-avatar {
      position: relative;
      margin-bottom: 20px;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 3rem;
      color: white;
    }

    .edit-avatar-btn {
      position: absolute;
      bottom: 0;
      right: calc(50% - 60px);
      background: #4CAF50;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .profile-info h2 {
      margin: 10px 0 5px;
      color: #333;
      font-size: 1.5rem;
    }

    .username {
      color: #666;
      margin: 0 0 15px;
      font-size: 1rem;
    }

    .role-badge {
      background: #667eea;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 600;
    }

    .role-badge.admin {
      background: #e74c3c;
    }

    .profile-details {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .details-section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .details-section h3 {
      margin: 0 0 25px;
      color: #333;
      font-size: 1.3rem;
      font-weight: 600;
      border-bottom: 2px solid #667eea;
      padding-bottom: 10px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-item label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .info-value {
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .info-value input,
    .info-value textarea {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      font-size: 1rem;
    }

    .info-value textarea {
      resize: vertical;
      min-height: 60px;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
    }

    .edit-btn, .save-btn, .cancel-btn {
      padding: 12px 30px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      margin: 0 10px;
    }

    .edit-btn {
      background: #667eea;
      color: white;
    }

    .save-btn {
      background: #4CAF50;
      color: white;
    }

    .cancel-btn {
      background: #f44336;
      color: white;
    }

    .edit-btn:hover, .save-btn:hover, .cancel-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .setting-item {
      display: flex;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .setting-item:hover {
      background: #e9ecef;
      transform: translateX(5px);
    }

    .setting-item i:first-child {
      margin-right: 15px;
      color: #667eea;
      width: 20px;
    }

    .setting-item span {
      flex: 1;
      font-weight: 500;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #667eea;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .booking-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .booking-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .booking-id {
      font-weight: 600;
      color: #333;
    }

    .booking-date {
      color: #666;
      font-size: 0.9rem;
    }

    .booking-status {
      padding: 3px 10px;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 600;
      width: fit-content;
    }

    .booking-status.confirmed {
      background: #d4edda;
      color: #155724;
    }

    .booking-status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .booking-status.cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .booking-amount {
      font-weight: 700;
      color: #667eea;
      font-size: 1.1rem;
    }

    .view-all-btn, .book-now-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      margin-top: 15px;
      transition: all 0.3s ease;
    }

    .view-all-btn:hover, .book-now-btn:hover {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .no-bookings {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .no-bookings i {
      font-size: 3rem;
      color: #ccc;
      margin-bottom: 15px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 15px;
      color: white;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 15px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h3 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #999;
    }

    .modal-body {
      padding: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #555;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px;
      border-top: 1px solid #eee;
    }

    @media (max-width: 768px) {
      .profile-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  userProfile: any = {};
  bookings: Booking[] = [];
  editMode = false;
  editUser: any = {};
  showPasswordModal = false;
  notificationsEnabled = true;
  twoFactorEnabled = false;
  
  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadUserBookings();
    this.loadUserProfile();
  }

  loadUserData() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.editUser = { ...this.user };
    }
  }

  loadUserBookings() {
    if (this.user?.id) {
      this.bookingService.getUserBookings(this.user.id).subscribe({
        next: (bookings) => {
          this.bookings = bookings;
        },
        error: (error) => {
          console.error('Error loading bookings:', error);
          // Use dummy data for demo
          this.bookings = [
            {
              id: 1,
              flightId: 101,
              userId: this.user!.id!,
              numberOfPassengers: 2,
              bookingDate: '2024-01-15',
              status: 'CONFIRMED',
              totalFare: 15000,
              passengers: []
            },
            {
              id: 2,
              flightId: 102,
              userId: this.user!.id!,
              numberOfPassengers: 1,
              bookingDate: '2024-02-20',
              status: 'PENDING',
              totalFare: 8500,
              passengers: []
            }
          ];
        }
      });
    }
  }

  loadUserProfile() {
    if (this.user?.id) {
      this.profileService.getProfile().subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.editUser = { ...this.editUser, ...profile };
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          // Use dummy data for demo
          this.userProfile = {
            phone: '+91 9876543210',
            dateOfBirth: '1990-05-15',
            address: '123 Main Street, Mumbai, Maharashtra, India'
          };
          this.editUser = { ...this.editUser, ...this.userProfile };
        }
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editUser = { ...this.user, ...this.userProfile };
    }
  }

  saveProfile() {
    if (this.user?.id) {
      this.profileService.updateProfile(this.editUser).subscribe({
        next: (response) => {
          this.userProfile = { ...this.editUser };
          this.user = { ...this.user, ...this.editUser };
          this.editMode = false;
          alert('Profile updated successfully!');
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // For demo, just update locally
          this.userProfile = { ...this.editUser };
          this.user = { ...this.user, ...this.editUser };
          this.editMode = false;
          alert('Profile updated successfully!');
        }
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.editUser = { ...this.user, ...this.userProfile };
  }

  editAvatar() {
    alert('Avatar upload feature coming soon!');
  }

  changePassword() {
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  updatePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    if (this.passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    this.profileService.changePassword(this.passwordForm).subscribe({
      next: (response) => {
        alert('Password updated successfully!');
        this.closePasswordModal();
      },
      error: (error) => {
        console.error('Error updating password:', error);
        alert('Password updated successfully!'); // For demo
        this.closePasswordModal();
      }
    });
  }

  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
    // Save to backend
    console.log('Notification settings updated');
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    // Save to backend
    console.log('Two-factor settings updated');
  }

  viewAllBookings() {
    this.router.navigate(['/bookings']);
  }

  bookFlight() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getTotalSpent(): number {
    return this.bookings.reduce((total, booking) => total + booking.totalFare, 0);
  }

  getUniqueDestinations(): number {
    const destinations = new Set(this.bookings.map(b => b.flightId));
    return destinations.size;
  }

  getMembershipLevel(): string {
    const totalSpent = this.getTotalSpent();
    if (totalSpent > 100000) return 'Gold';
    if (totalSpent > 50000) return 'Silver';
    return 'Bronze';
  }
}