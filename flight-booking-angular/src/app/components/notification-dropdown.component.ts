import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notification-dropdown',
  template: `
    <div class="notification-dropdown" *ngIf="show">
      <div class="notification-header">
        <h3>🔔 Notifications</h3>
        <button class="mark-all-read" (click)="markAllRead()" *ngIf="unreadCount > 0">
          Mark all read
        </button>
      </div>
      
      <div class="notification-list">
        <div class="notification-item" 
             *ngFor="let notification of notifications" 
             [class.unread]="!notification.read"
             (click)="markAsRead(notification)">
          <div class="notification-icon">{{notification.icon}}</div>
          <div class="notification-content">
            <div class="notification-title">{{notification.title}}</div>
            <div class="notification-message">{{notification.message}}</div>
            <div class="notification-time">{{notification.time}}</div>
          </div>
          <div class="notification-dot" *ngIf="!notification.read"></div>
        </div>
      </div>
      
      <div class="notification-footer" *ngIf="notifications.length === 0">
        <div class="empty-state">
          <div class="empty-icon">🔕</div>
          <p>No notifications yet</p>
        </div>
      </div>
      
      <div class="notification-footer" *ngIf="notifications.length > 0">
        <button class="view-all-btn" (click)="viewAll()">View All Notifications</button>
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 350px;
      max-height: 400px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border: 1px solid #e2e8f0;
      z-index: 1000;
      overflow: hidden;
      animation: dropdownSlide 0.3s ease-out;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .mark-all-read {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mark-all-read:hover {
      background: rgba(255,255,255,0.3);
    }

    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .notification-item:hover {
      background: #f8fafc;
    }

    .notification-item.unread {
      background: rgba(102,126,234,0.05);
      border-left: 3px solid #667eea;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      margin-top: 0.25rem;
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }

    .notification-message {
      color: #4a5568;
      font-size: 0.85rem;
      line-height: 1.4;
      margin-bottom: 0.5rem;
    }

    .notification-time {
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .notification-dot {
      width: 8px;
      height: 8px;
      background: #667eea;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 0.5rem;
    }

    .notification-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .empty-state {
      text-align: center;
      padding: 1rem 0;
    }

    .empty-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
      font-size: 0.9rem;
    }

    .view-all-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-all-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Dark Mode */
    body.theme-dark .notification-dropdown {
      background: #2d3748;
      border-color: #4a5568;
    }

    body.theme-dark .notification-header {
      border-color: #4a5568;
    }

    body.theme-dark .notification-item {
      border-color: #4a5568;
    }

    body.theme-dark .notification-item:hover {
      background: #374151;
    }

    body.theme-dark .notification-title {
      color: #f7fafc;
    }

    body.theme-dark .notification-message {
      color: #e2e8f0;
    }

    body.theme-dark .notification-time {
      color: #a0aec0;
    }

    body.theme-dark .notification-footer {
      background: #374151;
      border-color: #4a5568;
    }

    body.theme-dark .empty-state p {
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .notification-dropdown {
        width: 300px;
        right: -50px;
      }
    }
  `]
})
export class NotificationDropdownComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  notifications = [
    {
      id: 1,
      icon: '✈️',
      title: 'Flight Booking Confirmed',
      message: 'Your flight AI-101 from Delhi to Mumbai has been confirmed.',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      icon: '🎫',
      title: 'Boarding Pass Ready',
      message: 'Your boarding pass is ready for download.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      icon: '💰',
      title: 'Payment Successful',
      message: 'Payment of ₹15,999 has been processed successfully.',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      icon: '🔔',
      title: 'Flight Reminder',
      message: 'Your flight departs in 24 hours. Check-in now available.',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      icon: '🎉',
      title: 'Welcome to Premium',
      message: 'Congratulations! You are now a Premium member.',
      time: '2 days ago',
      read: true
    }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notification: any) {
    notification.read = true;
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
  }

  viewAll() {
    console.log('View all notifications');
    this.close.emit();
  }
}