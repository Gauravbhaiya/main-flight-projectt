import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-nav',
  template: `
    <div class="mobile-nav" [class.open]="isOpen">
      <div class="mobile-nav-overlay" (click)="closeNav()"></div>
      <div class="mobile-nav-content">
        <div class="mobile-nav-header">
          <div class="mobile-brand">
            <span class="mobile-brand-icon">✈️</span>
            <span class="mobile-brand-text">Bhartiye Airlines</span>
          </div>
          <button class="mobile-nav-close" (click)="closeNav()">×</button>
        </div>
        
        <nav class="mobile-nav-links">
          <button class="mobile-nav-link" [class.active]="activeSection === 'dashboard'" (click)="selectSection('dashboard')">
            <span class="mobile-nav-icon">🏠</span>
            <span class="mobile-nav-text">Dashboard</span>
          </button>
          <button class="mobile-nav-link" [class.active]="activeSection === 'flights'" (click)="selectSection('flights')">
            <span class="mobile-nav-icon">✈️</span>
            <span class="mobile-nav-text">Flights</span>
          </button>
          <button class="mobile-nav-link" [class.active]="activeSection === 'bookings'" (click)="selectSection('bookings')">
            <span class="mobile-nav-icon">📅</span>
            <span class="mobile-nav-text">Bookings</span>
          </button>
          <button class="mobile-nav-link" [class.active]="activeSection === 'payments'" (click)="selectSection('payments')">
            <span class="mobile-nav-icon">💳</span>
            <span class="mobile-nav-text">Payments</span>
          </button>
          <button class="mobile-nav-link" [class.active]="activeSection === 'profile'" (click)="selectSection('profile')">
            <span class="mobile-nav-icon">👤</span>
            <span class="mobile-nav-text">Profile</span>
          </button>
        </nav>
        
        <div class="mobile-nav-footer">
          <div class="mobile-user-info">
            <div class="mobile-user-avatar">{{userName?.charAt(0)?.toUpperCase() || 'U'}}</div>
            <div class="mobile-user-details">
              <div class="mobile-user-name">{{userName}}</div>
              <div class="mobile-user-role">Premium Traveler</div>
            </div>
          </div>
          <button class="mobile-logout-btn" (click)="logout()">
            <span class="mobile-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-nav {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      visibility: hidden;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    .mobile-nav.open {
      visibility: visible;
      opacity: 1;
    }
    
    .mobile-nav-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
    
    .mobile-nav-content {
      position: absolute;
      top: 0;
      right: 0;
      width: 280px;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
    }
    
    .mobile-nav.open .mobile-nav-content {
      transform: translateX(0);
    }
    
    .mobile-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .mobile-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .mobile-brand-icon {
      font-size: 1.5rem;
    }
    
    .mobile-brand-text {
      font-size: 1.2rem;
      font-weight: 700;
      color: white;
    }
    
    .mobile-nav-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .mobile-nav-close:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }
    
    .mobile-nav-links {
      flex: 1;
      padding: 1rem 0;
    }
    
    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }
    
    .mobile-nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-left-color: rgba(255, 255, 255, 0.5);
    }
    
    .mobile-nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-left-color: white;
    }
    
    .mobile-nav-icon {
      font-size: 1.3rem;
      width: 24px;
      text-align: center;
    }
    
    .mobile-nav-text {
      font-weight: 600;
    }
    
    .mobile-nav-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .mobile-user-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
    }
    
    .mobile-user-details {
      flex: 1;
    }
    
    .mobile-user-name {
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }
    
    .mobile-user-role {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
    }
    
    .mobile-logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.8rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .mobile-logout-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .mobile-logout-icon {
      font-size: 1.1rem;
    }
    
    @media (min-width: 769px) {
      .mobile-nav {
        display: none;
      }
    }
  `]
})
export class MobileNavComponent {
  @Input() isOpen = false;
  @Input() activeSection = 'dashboard';
  @Input() userName = '';
  @Output() close = new EventEmitter<void>();
  @Output() sectionChange = new EventEmitter<string>();
  @Output() logoutClick = new EventEmitter<void>();

  closeNav() {
    this.close.emit();
  }

  selectSection(section: string) {
    this.sectionChange.emit(section);
    this.closeNav();
  }

  logout() {
    this.logoutClick.emit();
    this.closeNav();
  }
}