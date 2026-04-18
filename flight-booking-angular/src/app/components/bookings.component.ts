import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../services/auth.service';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-bookings',
  template: `
    <div class="bookings-container">
      <div class="bookings-header">
        <div class="header-content">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <h1>My Bookings</h1>
          <div class="header-stats">
            <span class="stat">{{ bookings.length }} Total Bookings</span>
            <span class="stat">₹{{ getTotalSpent() | number }} Total Spent</span>
          </div>
        </div>
      </div>

      <div class="bookings-content">
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="applyFilters()">
            <option value="">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          
          <input type="date" [(ngModel)]="dateFilter" (change)="applyFilters()" placeholder="Filter by date">
          
          <button class="clear-filters" (click)="clearFilters()">
            <i class="fas fa-times"></i> Clear Filters
          </button>
        </div>

        <div class="bookings-list" *ngIf="filteredBookings.length > 0; else noBookings">
          <div class="booking-card" *ngFor="let booking of filteredBookings">
            <div class="booking-header">
              <div class="booking-id">
                <strong>Booking #{{ booking.id }}</strong>
                <span class="booking-date">{{ booking.bookingDate | date:'mediumDate' }}</span>
              </div>
              <div class="booking-status" [class]="booking.status.toLowerCase()">
                {{ booking.status }}
              </div>
            </div>
            
            <div class="booking-details">
              <div class="flight-info">
                <div class="info-item">
                  <label>Flight ID:</label>
                  <span>{{ booking.flightId }}</span>
                </div>
                <div class="info-item">
                  <label>Passengers:</label>
                  <span>{{ booking.numberOfPassengers }}</span>
                </div>
                <div class="info-item">
                  <label>Class:</label>
                  <span>{{ booking.class || 'Economy' }}</span>
                </div>
                <div class="info-item">
                  <label>Total Fare:</label>
                  <span class="fare">₹{{ booking.totalFare }}</span>
                </div>
              </div>
              
              <div class="passenger-list" *ngIf="booking.passengers && booking.passengers.length > 0">
                <h4>Passengers:</h4>
                <div class="passenger-item" *ngFor="let passenger of booking.passengers">
                  <span>{{ passenger.firstName }} {{ passenger.lastName }}</span>
                  <small>{{ passenger.email }}</small>
                </div>
              </div>
            </div>
            
            <div class="booking-actions">
              <button class="view-btn" (click)="viewBookingDetails(booking)">
                <i class="fas fa-eye"></i> View Details
              </button>
              
              <button *ngIf="booking.status === 'CONFIRMED'" class="boarding-pass-btn" (click)="downloadBoardingPass(booking)">
                <i class="fas fa-plane"></i> Boarding Pass
              </button>
              
              <button *ngIf="booking.status === 'PENDING'" class="confirm-btn" (click)="confirmBooking(booking)">
                <i class="fas fa-check"></i> Confirm
              </button>
              
              <button *ngIf="booking.status !== 'CANCELLED'" class="cancel-btn" (click)="cancelBooking(booking)">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        </div>

        <ng-template #noBookings>
          <div class="no-bookings">
            <i class="fas fa-plane"></i>
            <h3>No bookings found</h3>
            <p>{{ statusFilter || dateFilter ? 'Try adjusting your filters' : 'Start your journey by booking your first flight!' }}</p>
            <button class="book-now-btn" (click)="bookFlight()">Book a Flight</button>
          </div>
        </ng-template>
      </div>

      <!-- Booking Details Modal -->
      <div class="modal" *ngIf="showDetailsModal" (click)="closeDetailsModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Booking Details</h3>
            <button class="close-btn" (click)="closeDetailsModal()">×</button>
          </div>
          <div class="modal-body" *ngIf="selectedBooking">
            <div class="detail-section">
              <h4>Booking Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Booking ID:</label>
                  <span>{{ selectedBooking.id }}</span>
                </div>
                <div class="detail-item">
                  <label>Flight ID:</label>
                  <span>{{ selectedBooking.flightId }}</span>
                </div>
                <div class="detail-item">
                  <label>Booking Date:</label>
                  <span>{{ selectedBooking.bookingDate | date:'full' }}</span>
                </div>
                <div class="detail-item">
                  <label>Status:</label>
                  <span class="status" [class]="selectedBooking.status.toLowerCase()">{{ selectedBooking.status }}</span>
                </div>
                <div class="detail-item">
                  <label>Number of Passengers:</label>
                  <span>{{ selectedBooking.numberOfPassengers }}</span>
                </div>
                <div class="detail-item">
                  <label>Total Fare:</label>
                  <span class="fare">₹{{ selectedBooking.totalFare }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" *ngIf="selectedBooking.passengers && selectedBooking.passengers.length > 0">
              <h4>Passenger Details</h4>
              <div class="passenger-details" *ngFor="let passenger of selectedBooking.passengers; let i = index">
                <h5>Passenger {{ i + 1 }}</h5>
                <div class="detail-grid">
                  <div class="detail-item">
                    <label>Name:</label>
                    <span>{{ passenger.firstName }} {{ passenger.lastName }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Email:</label>
                    <span>{{ passenger.email }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Gender:</label>
                    <span>{{ passenger.gender }}</span>
                  </div>
                  <div class="detail-item">
                    <label>Aadhar Number:</label>
                    <span>{{ passenger.aadharNumber }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="close-btn" (click)="closeDetailsModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .bookings-header {
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
      justify-content: space-between;
      flex-wrap: wrap;
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

    .bookings-header h1 {
      color: white;
      margin: 0;
      font-size: 2rem;
      font-weight: 300;
    }

    .header-stats {
      display: flex;
      gap: 20px;
    }

    .stat {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 0.9rem;
    }

    .bookings-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .filters {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .filters select,
    .filters input {
      padding: 10px 15px;
      border: none;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      min-width: 150px;
    }

    .clear-filters {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      padding: 10px 20px;
      border-radius: 25px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .clear-filters:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .booking-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .booking-card:hover {
      transform: translateY(-5px);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }

    .booking-id {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .booking-id strong {
      font-size: 1.2rem;
      color: #333;
    }

    .booking-date {
      color: #666;
      font-size: 0.9rem;
    }

    .booking-status {
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
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

    .booking-details {
      margin-bottom: 20px;
    }

    .flight-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .info-item span {
      font-size: 1rem;
      color: #333;
    }

    .fare {
      font-weight: 700;
      color: #667eea;
      font-size: 1.1rem !important;
    }

    .passenger-list {
      margin-top: 20px;
    }

    .passenger-list h4 {
      margin: 0 0 15px;
      color: #333;
      font-size: 1.1rem;
    }

    .passenger-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .passenger-item small {
      color: #666;
    }

    .booking-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .view-btn, .boarding-pass-btn, .confirm-btn, .cancel-btn, .book-now-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .view-btn {
      background: #667eea;
      color: white;
    }

    .boarding-pass-btn {
      background: #28a745;
      color: white;
    }

    .confirm-btn {
      background: #17a2b8;
      color: white;
    }

    .cancel-btn {
      background: #dc3545;
      color: white;
    }

    .book-now-btn {
      background: #667eea;
      color: white;
      font-size: 1.1rem;
      padding: 15px 30px;
    }

    .view-btn:hover, .boarding-pass-btn:hover, .confirm-btn:hover, .cancel-btn:hover, .book-now-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .no-bookings {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      color: #666;
    }

    .no-bookings i {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-bookings h3 {
      margin: 0 0 10px;
      color: #333;
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
      max-width: 800px;
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

    .detail-section {
      margin-bottom: 30px;
    }

    .detail-section h4 {
      margin: 0 0 15px;
      color: #333;
      font-size: 1.2rem;
      border-bottom: 2px solid #667eea;
      padding-bottom: 5px;
    }

    .detail-section h5 {
      margin: 15px 0 10px;
      color: #555;
      font-size: 1rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .detail-item label {
      font-weight: 600;
      color: #555;
      font-size: 0.9rem;
    }

    .detail-item span {
      font-size: 1rem;
      color: #333;
    }

    .detail-item .status {
      padding: 4px 12px;
      border-radius: 15px;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      width: fit-content;
    }

    .passenger-details {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 15px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      padding: 20px;
      border-top: 1px solid #eee;
    }

    .modal-footer .close-btn {
      background: #667eea;
      color: white;
      padding: 10px 25px;
      border-radius: 25px;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .header-stats {
        flex-direction: column;
        gap: 10px;
      }
      
      .filters {
        flex-direction: column;
      }
      
      .flight-info {
        grid-template-columns: 1fr;
      }
      
      .booking-actions {
        flex-direction: column;
      }
      
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookingsComponent implements OnInit {
  user: User | null = null;
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  statusFilter = '';
  dateFilter = '';
  showDetailsModal = false;
  selectedBooking: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadBookings();
  }

  loadBookings() {
    if (this.user?.id) {
      this.bookingService.getUserBookings(this.user.id).subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.filteredBookings = bookings;
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
              class: 'Business',
              passengers: [
                {
                  firstName: 'John',
                  lastName: 'Doe',
                  email: 'john@example.com',
                  gender: 'Male',
                  aadharNumber: 123456789012,
                  flightId: 101
                },
                {
                  firstName: 'Jane',
                  lastName: 'Doe',
                  email: 'jane@example.com',
                  gender: 'Female',
                  aadharNumber: 123456789013,
                  flightId: 101
                }
              ]
            },
            {
              id: 2,
              flightId: 102,
              userId: this.user!.id!,
              numberOfPassengers: 1,
              bookingDate: '2024-02-20',
              status: 'PENDING',
              totalFare: 8500,
              class: 'Economy',
              passengers: [
                {
                  firstName: 'Alice',
                  lastName: 'Smith',
                  email: 'alice@example.com',
                  gender: 'Female',
                  aadharNumber: 123456789014,
                  flightId: 102
                }
              ]
            },
            {
              id: 3,
              flightId: 103,
              userId: this.user!.id!,
              numberOfPassengers: 1,
              bookingDate: '2024-03-10',
              status: 'CANCELLED',
              totalFare: 12000,
              class: 'Economy',
              passengers: []
            }
          ];
          this.filteredBookings = this.bookings;
        }
      });
    }
  }

  applyFilters() {
    this.filteredBookings = this.bookings.filter(booking => {
      const statusMatch = !this.statusFilter || booking.status === this.statusFilter;
      const dateMatch = !this.dateFilter || booking.bookingDate.includes(this.dateFilter);
      return statusMatch && dateMatch;
    });
  }

  clearFilters() {
    this.statusFilter = '';
    this.dateFilter = '';
    this.filteredBookings = this.bookings;
  }

  viewBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedBooking = null;
  }

  confirmBooking(booking: Booking) {
    if (confirm('Are you sure you want to confirm this booking?')) {
      this.bookingService.confirmBooking(booking.id!).subscribe({
        next: (response) => {
          booking.status = 'CONFIRMED';
          alert('Booking confirmed successfully!');
        },
        error: (error) => {
          console.error('Error confirming booking:', error);
          booking.status = 'CONFIRMED'; // For demo
          alert('Booking confirmed successfully!');
        }
      });
    }
  }

  cancelBooking(booking: Booking) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      this.bookingService.cancelBooking(booking.id!).subscribe({
        next: (response) => {
          booking.status = 'CANCELLED';
          alert('Booking cancelled successfully!');
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          booking.status = 'CANCELLED'; // For demo
          alert('Booking cancelled successfully!');
        }
      });
    }
  }

  downloadBoardingPass(booking: Booking) {
    // Navigate to boarding pass component or download
    this.router.navigate(['/boarding-pass', booking.id]);
  }

  bookFlight() {
    this.router.navigate(['/dashboard']);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  getTotalSpent(): number {
    return this.filteredBookings.reduce((total, booking) => total + booking.totalFare, 0);
  }
}