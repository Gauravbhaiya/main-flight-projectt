import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-search',
  template: `
    <div class="mobile-search-widget">
      <div class="mobile-search-header">
        <h2 class="mobile-search-title">✈️ Find Your Flight</h2>
        <p class="mobile-search-subtitle">Search flights to your destination</p>
      </div>
      
      <div class="mobile-search-form">
        <div class="mobile-search-field">
          <label class="mobile-field-label">From</label>
          <div class="mobile-input-wrapper">
            <span class="mobile-field-icon">🛫</span>
            <input type="text" [(ngModel)]="searchData.source" 
                   (input)="onSourceInput($event)"
                   placeholder="Departure city" 
                   class="mobile-field-input">
          </div>
          <div class="mobile-city-dropdown" *ngIf="showSourceDropdown">
            <div *ngFor="let city of sourceCities" 
                 class="mobile-city-option" 
                 (click)="selectSource(city)">
              <span class="mobile-city-icon">📍</span>
              <span class="mobile-city-name">{{city}}</span>
            </div>
          </div>
        </div>
        
        <div class="mobile-search-field">
          <label class="mobile-field-label">To</label>
          <div class="mobile-input-wrapper">
            <span class="mobile-field-icon">🛬</span>
            <input type="text" [(ngModel)]="searchData.destination" 
                   (input)="onDestInput($event)"
                   placeholder="Destination city" 
                   class="mobile-field-input">
          </div>
          <div class="mobile-city-dropdown" *ngIf="showDestDropdown">
            <div *ngFor="let city of destCities" 
                 class="mobile-city-option" 
                 (click)="selectDest(city)">
              <span class="mobile-city-icon">📍</span>
              <span class="mobile-city-name">{{city}}</span>
            </div>
          </div>
        </div>
        
        <div class="mobile-search-field">
          <label class="mobile-field-label">Date</label>
          <div class="mobile-input-wrapper">
            <span class="mobile-field-icon">📅</span>
            <input type="date" [(ngModel)]="searchData.date" 
                   class="mobile-field-input">
          </div>
        </div>
        
        <button class="mobile-search-btn" 
                [disabled]="isSearching || !isFormValid()" 
                (click)="onSearch()">
          <span *ngIf="!isSearching" class="mobile-btn-content">
            <span class="mobile-btn-icon">🔍</span>
            <span class="mobile-btn-text">Search Flights</span>
          </span>
          <span *ngIf="isSearching" class="mobile-btn-loading">
            <span class="mobile-spinner"></span>
            <span>Searching...</span>
          </span>
        </button>
      </div>
      
      <div class="mobile-quick-options" *ngIf="!isSearching">
        <div class="mobile-quick-header">
          <span class="mobile-quick-icon">🔥</span>
          <span class="mobile-quick-title">Popular Routes</span>
        </div>
        <div class="mobile-quick-routes">
          <button *ngFor="let route of popularRoutes" 
                  class="mobile-quick-route" 
                  (click)="selectQuickRoute(route)">
            <span class="mobile-route-from">{{route.from}}</span>
            <span class="mobile-route-arrow">→</span>
            <span class="mobile-route-to">{{route.to}}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-search-widget {
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.5rem;
      margin: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .mobile-search-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .mobile-search-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .mobile-search-subtitle {
      color: #4a5568;
      font-size: 0.9rem;
      margin: 0;
      opacity: 0.8;
    }
    
    .mobile-search-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .mobile-search-field {
      position: relative;
    }
    
    .mobile-field-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .mobile-input-wrapper {
      position: relative;
    }
    
    .mobile-field-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.1rem;
      z-index: 2;
    }
    
    .mobile-field-input {
      width: 100%;
      padding: 12px 12px 12px 45px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      color: #2d3748;
      transition: all 0.3s ease;
    }
    
    .mobile-field-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }
    
    .mobile-city-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
    }
    
    .mobile-city-option {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .mobile-city-option:last-child {
      border-bottom: none;
    }
    
    .mobile-city-option:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateX(4px);
    }
    
    .mobile-city-icon {
      font-size: 1rem;
    }
    
    .mobile-city-name {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .mobile-search-btn {
      width: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 14px 20px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      margin-top: 0.5rem;
      min-height: 50px;
    }
    
    .mobile-search-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
    }
    
    .mobile-search-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .mobile-btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }
    
    .mobile-btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
    }
    
    .mobile-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .mobile-btn-icon {
      font-size: 1.1rem;
    }
    
    .mobile-btn-text {
      font-size: 1rem;
    }
    
    .mobile-quick-options {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
    
    .mobile-quick-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .mobile-quick-icon {
      font-size: 1.1rem;
    }
    
    .mobile-quick-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #2d3748;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .mobile-quick-routes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem;
    }
    
    .mobile-quick-route {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      border-radius: 10px;
      color: #667eea;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .mobile-quick-route:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .mobile-route-from, .mobile-route-to {
      font-size: 0.75rem;
      font-weight: 700;
    }
    
    .mobile-route-arrow {
      font-size: 0.9rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 480px) {
      .mobile-search-widget {
        margin: 0.5rem;
        padding: 1rem;
      }
      
      .mobile-quick-routes {
        grid-template-columns: 1fr;
      }
      
      .mobile-field-input {
        padding: 10px 10px 10px 40px;
        font-size: 0.9rem;
      }
      
      .mobile-field-icon {
        left: 10px;
        font-size: 1rem;
      }
    }
  `]
})
export class MobileSearchComponent {
  @Input() searchData = { source: '', destination: '', date: '' };
  @Input() isSearching = false;
  @Output() search = new EventEmitter<any>();
  @Output() sourceInput = new EventEmitter<any>();
  @Output() destInput = new EventEmitter<any>();

  showSourceDropdown = false;
  showDestDropdown = false;
  
  sourceCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  destCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];
  
  popularRoutes = [
    { from: 'Mumbai', to: 'Delhi' },
    { from: 'Delhi', to: 'Bangalore' },
    { from: 'Chennai', to: 'Mumbai' },
    { from: 'Kolkata', to: 'Delhi' }
  ];

  onSourceInput(event: any) {
    this.showSourceDropdown = true;
    this.showDestDropdown = false;
    this.sourceInput.emit(event);
  }

  onDestInput(event: any) {
    this.showDestDropdown = true;
    this.showSourceDropdown = false;
    this.destInput.emit(event);
  }

  selectSource(city: string) {
    this.searchData.source = city;
    this.showSourceDropdown = false;
  }

  selectDest(city: string) {
    this.searchData.destination = city;
    this.showDestDropdown = false;
  }

  selectQuickRoute(route: any) {
    this.searchData.source = route.from;
    this.searchData.destination = route.to;
    this.showSourceDropdown = false;
    this.showDestDropdown = false;
  }

  onSearch() {
    if (this.isFormValid()) {
      this.search.emit(this.searchData);
    }
  }

  isFormValid(): boolean {
    return !!(this.searchData.source && this.searchData.destination && this.searchData.date);
  }
}