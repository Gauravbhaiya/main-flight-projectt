import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FlightService } from '../services/flight.service';
import { PaymentService, PaymentRequest } from '../services/payment.service';
import { BoardingPassService } from '../services/boarding-pass.service';
import { BookingService } from '../services/booking.service';
import { ProfileService, UserProfile, PasswordChangeRequest, ProfileStats } from '../services/profile.service';
import { SettingsModalComponent } from './settings-modal.component';
import { UpgradeModalComponent } from './upgrade-modal.component';


import { Flight } from '../models/flight.model';
import { Booking } from '../models/booking.model';
import { User } from '../models/user.model';
import { BoardingPass } from '../models/boarding-pass.model';

declare var Razorpay: any;

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="modern-dashboard" [class.modal-open]="showBookingModal" [class.search-loading]="isSearching">
      <!-- Hero Header -->
      <header class="hero-header" [class.compact]="activeSection !== 'dashboard'">
        <!-- Modern Geometric Background -->
        <div class="geometric-background">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
          </div>
          
          <div class="gradient-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
          </div>
          
          <div class="mesh-gradient"></div>
        </div>
        
        <div class="header-overlay"></div>
        <nav class="navbar">
          <div class="brand">
            <div class="brand-logo">
              <span class="logo-icon">🛫</span>
              <div class="logo-shine"></div>
            </div>
            <div class="brand-text">
              <span class="brand-name">Bhartiye Airlines</span>
              <span class="brand-tagline">Connecting India to the World</span>
            </div>
          </div>
          
          <div class="nav-links">
            <button type="button" class="nav-link" [class.active]="activeSection === 'dashboard'" (click)="setActiveSection('dashboard')">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Dashboard</span>
            </button>
            <button type="button" class="nav-link" [class.active]="activeSection === 'flights'" (click)="setActiveSection('flights')">
              <span class="nav-icon">✈️</span>
              <span class="nav-text">Flights</span>
            </button>
            <button type="button" class="nav-link" [class.active]="activeSection === 'bookings'" (click)="setActiveSection('bookings')">
              <span class="nav-icon">📅</span>
              <span class="nav-text">Bookings</span>
            </button>
            <button type="button" class="nav-link" [class.active]="activeSection === 'payments'" (click)="setActiveSection('payments')">
              <span class="nav-icon">💳</span>
              <span class="nav-text">Payments</span>
            </button>
            <button type="button" class="nav-link" [class.active]="activeSection === 'profile'" (click)="goToProfile()">
              <span class="nav-icon">👤</span>
              <span class="nav-text">Profile</span>
            </button>
            <div class="nav-theme-toggle">
              <app-simple-dark-light-toggle></app-simple-dark-light-toggle>
            </div>
          </div>
          
          <div class="user-section">
            <div class="notifications" (clickOutside)="showNotifications = false">
              <button class="notification-btn" (click)="toggleNotifications()">
                <span class="notification-icon">🔔</span>
                <span class="notification-badge" *ngIf="unreadNotifications > 0">{{unreadNotifications}}</span>
              </button>
              <app-notification-dropdown 
                [show]="showNotifications" 
                (close)="showNotifications = false">
              </app-notification-dropdown>
            </div>
            <div class="user-profile">
              <div class="user-avatar">
                <span>{{currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}}</span>
                <div class="avatar-status"></div>
              </div>
              <div class="user-info">
                <span class="user-name">{{currentUser?.name}}</span>
                <span class="user-role">Premium Traveler</span>
              </div>
              <div class="user-dropdown">
                <button class="dropdown-toggle">
                  <span class="dropdown-arrow">▼</span>
                </button>
                <div class="dropdown-menu">
                  <button (click)="goToProfile()" class="dropdown-item">
                    <span class="item-icon">👤</span>
                    <span>Profile</span>
                  </button>
                  <button (click)="showSettings()" class="dropdown-item">
                    <span class="item-icon">⚙️</span>
                    <span>Settings</span>
                  </button>
                  <button (click)="showUpgrade()" class="dropdown-item">
                    <span class="item-icon">💎</span>
                    <span>Upgrade</span>
                  </button>
                  <div class="dropdown-divider"></div>
                  <button (click)="logout()" class="dropdown-item logout-item">
                    <span class="item-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
        

        
        <div class="hero-section" *ngIf="activeSection === 'dashboard'">
          <h1 class="main-title">
            <span class="title-word">Discover</span>
            <span class="title-word">Your</span>
            <span class="title-word">Next</span>
            <span class="title-word">Adventure</span>
          </h1>
          <p class="main-subtitle">Book premium flights with exclusive deals and world-class service</p>
          
          <!-- Live Flight Counter -->
          <div class="live-stats">
            <div class="live-counter">
              <div class="counter-icon">✈️</div>
              <div class="counter-content">
                <div class="counter-number" *ngIf="!isLoadingLiveData">{{liveFlightsCount | number}}</div>
                <div class="counter-loading" *ngIf="isLoadingLiveData">
                  <div class="loading-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
                <div class="counter-label">Flights in Air Right Now</div>
              </div>
              <div class="pulse-indicator"></div>
            </div>
          </div>
          
          <!-- Premium Search -->
          <div class="search-widget" (click)="onClickOutside($event)">
            <!-- Premium Loading Animation -->
            <div class="flight-search-loader" *ngIf="isSearching">
              <div class="loader-container">
                <div class="loader-header">
                  <h3 class="loader-title">✈️ Searching Flights</h3>
                  <p class="loader-subtitle">Finding the best deals for you...</p>
                </div>
                
                <div class="flight-animation">
                  <div class="flight-path">
                    <div class="departure-city">{{searchCriteria.source}}</div>
                    <div class="flight-route">
                      <div class="route-line"></div>
                      <div class="flying-plane">✈️</div>
                      <div class="route-dots">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                      </div>
                    </div>
                    <div class="arrival-city">{{searchCriteria.destination}}</div>
                  </div>
                </div>
                
                <div class="search-progress">
                  <div class="progress-bar">
                    <div class="progress-fill"></div>
                  </div>
                  <div class="search-steps">
                    <div class="step active">
                      <span class="step-icon">🔍</span>
                      <span class="step-text">Searching</span>
                    </div>
                    <div class="step">
                      <span class="step-icon">💰</span>
                      <span class="step-text">Comparing Prices</span>
                    </div>
                    <div class="step">
                      <span class="step-icon">✨</span>
                      <span class="step-text">Finding Best Deals</span>
                    </div>
                  </div>
                </div>
                
                <div class="loader-stats">
                  <div class="stat-item">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">Airlines</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">1000+</span>
                    <span class="stat-label">Routes</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">24/7</span>
                    <span class="stat-label">Support</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="search-grid">
              <div class="search-field">
                <span class="field-icon">🛫</span>
                <input type="text" [(ngModel)]="searchCriteria.source" 
                       (input)="onSourceInput($event)" 
                       (focus)="onSourceInput($event)"
                       (keydown)="onKeyDown($event, 'source')"
                       placeholder="From" class="field-input" autocomplete="off">
                <button *ngIf="searchCriteria.source" (click)="clearSource()" class="clear-btn">×</button>
                <label class="field-label">Departure</label>
                <div class="city-dropdown" *ngIf="showSourceDropdown">
                  <div class="dropdown-header" *ngIf="searchCriteria.source.length === 0 && recentSearches.length > 0">
                    <span class="header-text">🕒 Recent Searches</span>
                  </div>
                  <div class="dropdown-header" *ngIf="searchCriteria.source.length === 0 && recentSearches.length === 0">
                    <span class="header-text">🔥 Popular Destinations</span>
                  </div>
                  <div *ngFor="let city of getDropdownCities('source'); trackBy: trackByCity" 
                       class="city-option" 
                       [class.recent]="recentSearches.includes(city)"
                       [class.popular]="popularDestinations.includes(city)"
                       (click)="selectSourceCity(city)">
                    <span class="city-name">{{city}}</span>
                  </div>
                </div>
              </div>
              
              <div class="search-field">
                <span class="field-icon">🛬</span>
                <input type="text" [(ngModel)]="searchCriteria.destination" 
                       (input)="onDestInput($event)" 
                       (focus)="onDestInput($event)"
                       (keydown)="onKeyDown($event, 'dest')"
                       placeholder="To" class="field-input" autocomplete="off">
                <button *ngIf="searchCriteria.destination" (click)="clearDest()" class="clear-btn">×</button>
                <label class="field-label">Destination</label>
                <div class="city-dropdown" *ngIf="showDestDropdown">
                  <div class="dropdown-header" *ngIf="searchCriteria.destination.length === 0 && recentSearches.length > 0">
                    <span class="header-text">🕒 Recent Searches</span>
                  </div>
                  <div class="dropdown-header" *ngIf="searchCriteria.destination.length === 0 && recentSearches.length === 0">
                    <span class="header-text">🔥 Popular Destinations</span>
                  </div>
                  <div *ngFor="let city of getDropdownCities('dest'); trackBy: trackByCity" 
                       class="city-option" 
                       [class.recent]="recentSearches.includes(city)"
                       [class.popular]="popularDestinations.includes(city)"
                       (click)="selectDestCity(city)">
                    <span class="city-name">{{city}}</span>
                  </div>
                </div>
              </div>
              
              <div class="search-field">
                <span class="field-icon">📅</span>
                <input type="date" [(ngModel)]="searchCriteria.departureDate" class="field-input">
                <label class="field-label">Date</label>
              </div>
              
              <button (click)="searchFlights()" class="search-button" [disabled]="isSearching">
                <span class="search-icon" *ngIf="!isSearching">🔍</span>
                <div class="search-loading" *ngIf="isSearching">
                  <div class="loading-spinner"></div>
                </div>
                <span class="search-text">{{isSearching ? 'Searching...' : 'Find Flights'}}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content" [ngSwitch]="activeSection">
        <!-- Advanced Background Effects -->
        <div class="content-background-effects">
          <!-- SVG Animated Background -->
          <svg class="animated-svg-bg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="rgba(102,126,234,0.3)" stop-opacity="1">
                  <animate attributeName="stop-color" values="rgba(102,126,234,0.3);rgba(118,75,162,0.3);rgba(255,107,107,0.3);rgba(102,126,234,0.3)" dur="8s" repeatCount="indefinite"/>
                </stop>
                <stop offset="100%" stop-color="rgba(118,75,162,0.3)" stop-opacity="1">
                  <animate attributeName="stop-color" values="rgba(118,75,162,0.3);rgba(255,107,107,0.3);rgba(102,126,234,0.3);rgba(118,75,162,0.3)" dur="8s" repeatCount="indefinite"/>
                </stop>
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Animated Circles -->
            <circle cx="200" cy="150" r="80" fill="url(#grad1)" opacity="0.4" filter="url(#glow)">
              <animateTransform attributeName="transform" type="translate" values="0,0; 50,-30; 0,0" dur="12s" repeatCount="indefinite"/>
              <animate attributeName="r" values="80;120;80" dur="8s" repeatCount="indefinite"/>
            </circle>
            
            <circle cx="800" cy="300" r="60" fill="rgba(255,107,107,0.4)" opacity="0.5" filter="url(#glow)">
              <animateTransform attributeName="transform" type="translate" values="0,0; -40,60; 0,0" dur="15s" repeatCount="indefinite"/>
              <animate attributeName="r" values="60;100;60" dur="10s" repeatCount="indefinite"/>
            </circle>
            
            <circle cx="1000" cy="100" r="45" fill="rgba(72,187,120,0.4)" opacity="0.6" filter="url(#glow)">
              <animateTransform attributeName="transform" type="translate" values="0,0; 30,40; 0,0" dur="18s" repeatCount="indefinite"/>
              <animate attributeName="r" values="45;75;45" dur="6s" repeatCount="indefinite"/>
            </circle>
            
            <!-- Animated Paths -->
            <path d="M0,400 Q300,200 600,400 T1200,400" stroke="rgba(102,126,234,0.3)" stroke-width="3" fill="none" opacity="0.7">
              <animate attributeName="d" values="M0,400 Q300,200 600,400 T1200,400;M0,400 Q300,600 600,400 T1200,400;M0,400 Q300,200 600,400 T1200,400" dur="20s" repeatCount="indefinite"/>
              <animate attributeName="stroke-width" values="3;6;3" dur="8s" repeatCount="indefinite"/>
            </path>
            
            <path d="M0,200 Q400,100 800,200 T1200,200" stroke="rgba(255,107,107,0.3)" stroke-width="2" fill="none" opacity="0.6">
              <animate attributeName="d" values="M0,200 Q400,100 800,200 T1200,200;M0,200 Q400,300 800,200 T1200,200;M0,200 Q400,100 800,200 T1200,200" dur="16s" repeatCount="indefinite"/>
            </path>
            
            <!-- Animated Polygons -->
            <polygon points="100,500 150,450 200,500 150,550" fill="rgba(108,92,231,0.3)" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" values="0 150 500;360 150 500" dur="25s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0.8;0.5" dur="6s" repeatCount="indefinite"/>
            </polygon>
            
            <polygon points="900,600 950,550 1000,600 950,650" fill="rgba(254,202,87,0.4)" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" values="360 950 600;0 950 600" dur="20s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.6;0.9;0.6" dur="8s" repeatCount="indefinite"/>
            </polygon>
          </svg>
          
          <div class="floating-particles">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
            <div class="particle particle-6"></div>
          </div>
          
          <div class="light-rays">
            <div class="ray ray-1"></div>
            <div class="ray ray-2"></div>
            <div class="ray ray-3"></div>
          </div>
        </div>
        

        
        <!-- Dashboard Section -->
        <div *ngSwitchCase="'dashboard'">
          <!-- Search Message -->
          <div class="search-message" *ngIf="searchMessage && !isSearching">
            <span class="message-icon">ℹ️</span>
            <span>{{searchMessage}}</span>
          </div>
        
        <!-- Premium Flight Results -->
        <section class="flight-results" *ngIf="flights.length > 0 && hasSearched">
          <div class="results-header">
            <h2 class="results-title">Available Flights</h2>
            <div class="results-controls">
              <div class="results-badge">
                <span class="badge-count">{{flights.length}}</span>
                <span class="badge-label">flights available</span>
              </div>
              <div class="flight-controls">
                <select [(ngModel)]="sortBy" (change)="sortFlights()" class="sort-select">
                  <option value="price">Sort by Price</option>
                  <option value="time">Sort by Time</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="airline">Sort by Airline</option>
                </select>
                <button (click)="searchFlights()" class="refresh-btn" title="Search again">
                  <span class="refresh-icon">🔄</span>
                  <span>Search Again</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="flight-cards">
            <div *ngFor="let flight of flights; let i = index" 
                 class="premium-flight-card" 
                 [style.animation-delay.ms]="i * 150">

              
              <div class="card-header">
                <div class="airline-section">
                  <div class="airline-badge">{{flight.airline.charAt(0)}}</div>
                  <div class="airline-info">
                    <h3 class="flight-code">{{flight.flightNumber}}</h3>
                    <p class="airline-title">{{flight.airline}}</p>

                  </div>
                </div>
                <div class="price-section">
                  <div class="price-badge">
                    <span class="currency">₹</span>
                    <span class="price">{{flight.fare | number}}</span>
                  </div>
                  <div class="price-label">per person</div>
                </div>
              </div>
              
              <div class="route-display">
                <div class="departure-info">
                  <div class="city-code">{{flight.source.substring(0,3).toUpperCase()}}</div>
                  <div class="city-name">{{flight.source}}</div>
                  <div class="departure-time">{{flight.departureTime}}</div>
                </div>
                
                <div class="flight-path">
                  <div class="aircraft-icon">✈️</div>
                  <div class="flight-line"></div>
                  <div class="duration-badge">{{flight.duration || '2h 30m'}}</div>
                </div>
                
                <div class="arrival-info">
                  <div class="city-code">{{flight.destination.substring(0,3).toUpperCase()}}</div>
                  <div class="city-name">{{flight.destination}}</div>
                  <div class="arrival-time">{{flight.arrivalTime}}</div>
                </div>
              </div>
              
              <div class="flight-features">
                <div class="feature-tags">
                  <span class="feature-tag">📶 WiFi</span>
                  <span class="feature-tag">🍽️ Meals</span>
                  <span class="feature-tag">📺 Entertainment</span>
                  <span class="feature-tag">🔌 USB Charging</span>
                </div>
                <div class="flight-info">
                  <div class="info-item">
                    <span class="info-icon">📅</span>
                    <span class="info-text">{{flight.departureDate}}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-icon">💺</span>
                    <span class="info-text">{{flight.availableSeats}} seats available</span>
                  </div>
                  <div class="info-item">
                    <span class="info-icon">✈️</span>
                    <span class="info-text">{{flight.aircraft || 'Boeing 737'}}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-actions">
                <button (click)="bookFlight(flight)" 
                        [disabled]="flight.availableSeats === 0"
                        class="book-flight-btn"
                        [class.unavailable]="flight.availableSeats === 0">
                  <span *ngIf="flight.availableSeats > 0">✈️ Book Flight</span>
                  <span *ngIf="flight.availableSeats === 0">❌ Sold Out</span>
                </button>
              </div>
            </div>
          </div>
        </section>



        <!-- Premium Flight Slider -->
        <section class="flight-slider" *ngIf="!hasSearched && flights.length === 0">
          <div class="slider-container">
            <div class="slider-track" [style.transform]="'translateX(-' + (currentSlide * 25) + '%)'">
              
              <div class="slide-panel">
                <div class="slide-image">
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop" alt="Premium Flights">
                </div>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                  <div class="slide-badge">✈️ Premium Experience</div>
                  <h2 class="slide-title">Luxury Flight Booking</h2>
                  <p class="slide-desc">Experience world-class comfort with premium airlines and exceptional service</p>
                  <div class="slide-stats">
                    <div class="stat-item">500+ Airlines</div>
                    <div class="stat-item">1000+ Destinations</div>
                    <div class="stat-item">Premium Service</div>
                  </div>
                </div>
              </div>
              
              <div class="slide-panel">
                <div class="slide-image">
                  <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop" alt="Business Class">
                </div>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                  <div class="slide-badge">🎆 Business Class</div>
                  <h2 class="slide-title">Elite Business Travel</h2>
                  <p class="slide-desc">Elevate your journey with spacious seating, priority boarding, and exclusive lounges</p>
                  <div class="slide-stats">
                    <div class="stat-item">Priority Boarding</div>
                    <div class="stat-item">Gourmet Meals</div>
                    <div class="stat-item">Lounge Access</div>
                  </div>
                </div>
              </div>
              
              <div class="slide-panel">
                <div class="slide-image">
                  <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop" alt="Global Travel">
                </div>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                  <div class="slide-badge">🌍 Global Travel</div>
                  <h2 class="slide-title">Worldwide Destinations</h2>
                  <p class="slide-desc">Explore breathtaking destinations across the globe with our extensive flight network</p>
                  <div class="slide-stats">
                    <div class="stat-item">195 Countries</div>
                    <div class="stat-item">Beach Resorts</div>
                    <div class="stat-item">City Breaks</div>
                  </div>
                </div>
              </div>
              
              <div class="slide-panel">
                <div class="slide-image">
                  <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=600&fit=crop" alt="Smart Booking">
                </div>
                <div class="slide-overlay"></div>
                <div class="slide-content">
                  <div class="slide-badge">🤖 Smart Booking</div>
                  <h2 class="slide-title">AI-Powered Platform</h2>
                  <p class="slide-desc">Get the best deals with our intelligent price prediction and seamless booking experience</p>
                  <div class="slide-stats">
                    <div class="stat-item">AI Powered</div>
                    <div class="stat-item">Best Prices</div>
                    <div class="stat-item">Instant Booking</div>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div class="slider-dots">
              <button class="dot" [class.active]="currentSlide === 0" (click)="goToSlide(0)"></button>
              <button class="dot" [class.active]="currentSlide === 1" (click)="goToSlide(1)"></button>
              <button class="dot" [class.active]="currentSlide === 2" (click)="goToSlide(2)"></button>
              <button class="dot" [class.active]="currentSlide === 3" (click)="goToSlide(3)"></button>
            </div>
            
            <button class="slider-arrow prev" (click)="prevSlide()">‹</button>
            <button class="slider-arrow next" (click)="nextSlide()">›</button>
          </div>
        </section>

        <!-- Premium Airlines Showcase -->
        <section class="airlines-showcase" *ngIf="!hasSearched && flights.length === 0">
          <div class="showcase-header">
            <div class="header-content">
              <span class="header-badge">✈️ TRUSTED PARTNERS</span>
              <h2 class="showcase-title">World-Class Airlines</h2>
              <p class="showcase-subtitle">Experience excellence with our premium airline partners</p>
            </div>
          </div>
          
          <div class="airlines-container">
            <div class="airlines-slider">
              <div class="speed-indicator">
                <div class="speed-line"></div>
                <div class="speed-dots">
                  <span class="speed-dot"></span>
                  <span class="speed-dot"></span>
                  <span class="speed-dot"></span>
                </div>
              </div>
              
              <div class="airlines-track">
                <div class="airline-card" *ngFor="let airline of extendedAirlines">
                  <div class="card-glow"></div>
                  <div class="pulse-ring"></div>
                  
                  <div class="card-header">
                    <div class="airline-logo">
                      <span class="logo-icon">{{airline.icon}}</span>
                      <div class="logo-shine"></div>
                    </div>
                    <div class="rating-badge">
                      <span class="rating-star">⭐</span>
                      <span class="rating-value">{{airline.rating}}</span>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <h3 class="airline-name">{{airline.name}}</h3>
                    <p class="airline-type">{{airline.type}}</p>
                    
                    <div class="airline-metrics">
                      <div class="metric">
                        <span class="metric-value">{{airline.destinations}}+</span>
                        <span class="metric-label">Destinations</span>
                      </div>
                      <div class="metric">
                        <span class="metric-value">{{airline.fleet}}</span>
                        <span class="metric-label">Aircraft</span>
                      </div>
                      <div class="metric">
                        <span class="metric-value">{{airline.onTime}}%</span>
                        <span class="metric-label">On-Time</span>
                      </div>
                    </div>
                    
                    <div class="airline-features">
                      <span class="feature-tag" *ngFor="let feature of airline.topFeatures.slice(0, 2)">{{feature}}</span>
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <button class="explore-btn">
                      <span>Explore Flights</span>
                      <span class="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        </div>
        
        <!-- Flights Section -->
        <div *ngSwitchCase="'flights'" class="section-content">
          <div class="section-header-main">
            <h1 class="section-main-title">✈️ Flight Search</h1>
            <p class="section-main-subtitle">Find and book the perfect flight for your journey</p>
          </div>
          
          <!-- Enhanced Search Widget -->
          <div class="enhanced-search-widget">
            <div class="search-grid">
              <div class="search-field">
                <span class="field-icon">🛫</span>
                <input type="text" [(ngModel)]="searchCriteria.source" 
                       (input)="onSourceInput($event)" 
                       (focus)="onSourceInput($event)"
                       (keydown)="onKeyDown($event, 'source')"
                       placeholder="From" class="field-input" autocomplete="off">
                <button *ngIf="searchCriteria.source" (click)="clearSource()" class="clear-btn">×</button>
                <label class="field-label">Departure</label>
                <div class="city-dropdown" *ngIf="showSourceDropdown">
                  <div class="dropdown-header" *ngIf="searchCriteria.source.length === 0 && recentSearches.length > 0">
                    <span class="header-text">🕒 Recent Searches</span>
                  </div>
                  <div class="dropdown-header" *ngIf="searchCriteria.source.length === 0 && recentSearches.length === 0">
                    <span class="header-text">🔥 Popular Destinations</span>
                  </div>
                  <div *ngFor="let city of getDropdownCities('source'); trackBy: trackByCity" 
                       class="city-option" 
                       [class.recent]="recentSearches.includes(city)"
                       [class.popular]="popularDestinations.includes(city)"
                       (click)="selectSourceCity(city)">
                    <span class="city-name">{{city}}</span>
                  </div>
                </div>
              </div>
              
              <div class="search-field">
                <span class="field-icon">🛬</span>
                <input type="text" [(ngModel)]="searchCriteria.destination" 
                       (input)="onDestInput($event)" 
                       (focus)="onDestInput($event)"
                       (keydown)="onKeyDown($event, 'dest')"
                       placeholder="To" class="field-input" autocomplete="off">
                <button *ngIf="searchCriteria.destination" (click)="clearDest()" class="clear-btn">×</button>
                <label class="field-label">Destination</label>
                <div class="city-dropdown" *ngIf="showDestDropdown">
                  <div class="dropdown-header" *ngIf="searchCriteria.destination.length === 0 && recentSearches.length > 0">
                    <span class="header-text">🕒 Recent Searches</span>
                  </div>
                  <div class="dropdown-header" *ngIf="searchCriteria.destination.length === 0 && recentSearches.length === 0">
                    <span class="header-text">🔥 Popular Destinations</span>
                  </div>
                  <div *ngFor="let city of getDropdownCities('dest'); trackBy: trackByCity" 
                       class="city-option" 
                       [class.recent]="recentSearches.includes(city)"
                       [class.popular]="popularDestinations.includes(city)"
                       (click)="selectDestCity(city)">
                    <span class="city-name">{{city}}</span>
                  </div>
                </div>
              </div>
              
              <div class="search-field">
                <span class="field-icon">📅</span>
                <input type="date" [(ngModel)]="searchCriteria.departureDate" class="field-input">
                <label class="field-label">Date</label>
              </div>
              
              <button (click)="searchFlights()" class="search-button" [disabled]="isSearching">
                <span class="search-icon" *ngIf="!isSearching">🔍</span>
                <div class="search-loading" *ngIf="isSearching">
                  <div class="loading-spinner"></div>
                </div>
                <span class="search-text">{{isSearching ? 'Searching...' : 'Find Flights'}}</span>
              </button>
            </div>
          </div>
          
          <!-- Flight Results -->
          <section class="flight-results" *ngIf="flights.length > 0 && hasSearched">
            <div class="results-header">
              <h2 class="results-title">Available Flights</h2>
              <div class="results-controls">
                <div class="results-badge">
                  <span class="badge-count">{{flights.length}}</span>
                  <span class="badge-label">flights available</span>
                </div>
                <div class="flight-controls">
                  <select [(ngModel)]="sortBy" (change)="sortFlights()" class="sort-select">
                    <option value="price">Sort by Price</option>
                    <option value="time">Sort by Time</option>
                    <option value="duration">Sort by Duration</option>
                    <option value="airline">Sort by Airline</option>
                  </select>
                  <button (click)="searchFlights()" class="refresh-btn" title="Search again">
                    <span class="refresh-icon">🔄</span>
                    <span>Search Again</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="flight-cards">
              <div *ngFor="let flight of flights; let i = index" 
                   class="premium-flight-card" 
                   [style.animation-delay.ms]="i * 150">
                <div class="card-header">
                  <div class="airline-section">
                    <div class="airline-badge">{{flight.airline.charAt(0)}}</div>
                    <div class="airline-info">
                      <h3 class="flight-code">{{flight.flightNumber}}</h3>
                      <p class="airline-title">{{flight.airline}}</p>
                    </div>
                  </div>
                  <div class="price-section">
                    <div class="price-badge">
                      <span class="currency">₹</span>
                      <span class="price">{{flight.fare | number}}</span>
                    </div>
                    <div class="price-label">per person</div>
                  </div>
                </div>
                
                <div class="route-display">
                  <div class="departure-info">
                    <div class="city-code">{{flight.source.substring(0,3).toUpperCase()}}</div>
                    <div class="city-name">{{flight.source}}</div>
                    <div class="departure-time">{{flight.departureTime}}</div>
                  </div>
                  
                  <div class="flight-path">
                    <div class="aircraft-icon">✈️</div>
                    <div class="flight-line"></div>
                    <div class="duration-badge">{{flight.duration || '2h 30m'}}</div>
                  </div>
                  
                  <div class="arrival-info">
                    <div class="city-code">{{flight.destination.substring(0,3).toUpperCase()}}</div>
                    <div class="city-name">{{flight.destination}}</div>
                    <div class="arrival-time">{{flight.arrivalTime}}</div>
                  </div>
                </div>
                
                <div class="flight-features">
                  <div class="feature-tags">
                    <span class="feature-tag">📶 WiFi</span>
                    <span class="feature-tag">🍽️ Meals</span>
                    <span class="feature-tag">📺 Entertainment</span>
                    <span class="feature-tag">🔌 USB Charging</span>
                  </div>
                  <div class="flight-info">
                    <div class="info-item">
                      <span class="info-icon">📅</span>
                      <span class="info-text">{{flight.departureDate}}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-icon">💺</span>
                      <span class="info-text">{{flight.availableSeats}} seats available</span>
                    </div>
                    <div class="info-item">
                      <span class="info-icon">✈️</span>
                      <span class="info-text">{{flight.aircraft || 'Boeing 737'}}</span>
                    </div>
                  </div>
                </div>
                
                <div class="card-actions">
                  <button (click)="bookFlight(flight)" 
                          [disabled]="flight.availableSeats === 0"
                          class="book-flight-btn"
                          [class.unavailable]="flight.availableSeats === 0">
                    <span *ngIf="flight.availableSeats > 0">✈️ Book Flight</span>
                    <span *ngIf="flight.availableSeats === 0">❌ Sold Out</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <!-- Bookings Section -->
        <div *ngSwitchCase="'bookings'" class="section-content">
          <div class="section-header-main">
            <h1 class="section-main-title">📅 My Bookings</h1>
            <p class="section-main-subtitle">Manage your flight reservations and travel history</p>
          </div>
          
          <div class="bookings-grid" *ngIf="userBookings.length > 0">
            <div *ngFor="let booking of userBookings; let i = index" 
                 class="booking-card"
                 [style.animation-delay.ms]="i * 150">
              <div class="booking-header">
                <div class="booking-id">
                  <span class="id-label">Booking</span>
                  <span class="id-number">#{{booking.id}}</span>
                </div>
                <div class="booking-status" [class]="booking.status.toLowerCase()">
                  <span class="status-dot"></span>
                  <span class="status-text">{{booking.status}}</span>
                </div>
              </div>
              
              <div class="booking-details">
                <div class="passenger-info">
                  <span class="passenger-icon">👤</span>
                  <span class="passenger-name">{{booking.passengers[0].firstName}} {{booking.passengers[0].lastName}}</span>
                </div>
                <div class="seat-info">
                  <span class="seat-icon">💺</span>
                  <span class="seat-number">{{booking.numberOfPassengers}} Passenger(s)</span>
                </div>
                <div class="amount-info">
                  <span class="amount-icon">💰</span>
                  <span class="amount-text">₹{{booking.totalFare | number}}</span>
                </div>
              </div>
              
              <div class="booking-actions" *ngIf="booking.status === 'PENDING'">
                <button (click)="makePayment(booking)" class="pay-btn">
                  <span class="pay-icon">💳</span>
                  <span class="pay-text">Pay Now</span>
                </button>
              </div>
              <div class="booking-actions" *ngIf="booking.status === 'CONFIRMED'">
                <button (click)="showBoardingPass(booking)" class="boarding-pass-btn">
                  🎫 View Boarding Pass
                </button>
              </div>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="userBookings.length === 0">
            <div class="empty-icon">📅</div>
            <h3 class="empty-title">No Bookings Yet</h3>
            <p class="empty-description">Start your journey by booking your first flight!</p>
            <button (click)="setActiveSection('flights')" class="empty-action-btn">
              ✈️ Search Flights
            </button>
          </div>
        </div>
        
        <!-- Payments Section -->
        <div *ngSwitchCase="'payments'" class="section-content">
          <div class="section-header-main">
            <h1 class="section-main-title">💳 Payment History</h1>
            <p class="section-main-subtitle">Track your payment transactions and receipts</p>
          </div>
          
          <div class="payments-grid">
            <div class="payment-card" *ngFor="let booking of userBookings; let i = index" [style.animation-delay.ms]="i * 150">
              <div class="payment-header">
                <div class="payment-status" [class]="booking.status.toLowerCase()">
                  <span class="status-icon" *ngIf="booking.status === 'CONFIRMED'">✅</span>
                  <span class="status-icon" *ngIf="booking.status === 'PENDING'">⏳</span>
                  <span class="status-text">{{booking.status === 'CONFIRMED' ? 'Paid' : 'Pending'}}</span>
                </div>
                <div class="payment-amount">₹{{booking.totalFare | number}}</div>
              </div>
              
              <div class="payment-details">
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#{{booking.id}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Passenger:</span>
                  <span class="detail-value">{{booking.passengers[0].firstName}} {{booking.passengers[0].lastName}}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">{{booking.bookingDate || 'Today'}}</span>
                </div>
              </div>
              
              <div class="payment-actions" *ngIf="booking.status === 'PENDING'">
                <button (click)="makePayment(booking)" class="pay-now-btn">
                  💳 Complete Payment
                </button>
              </div>
            </div>
          </div>
          
          <div class="empty-state" *ngIf="userBookings.length === 0">
            <div class="empty-icon">💳</div>
            <h3 class="empty-title">No Payment History</h3>
            <p class="empty-description">Your payment transactions will appear here</p>
          </div>
        </div>
        
        <!-- Profile Section -->
        <div *ngSwitchCase="'profile'" class="section-content">
          <div class="section-header-main">
            <h1 class="section-main-title">👤 My Profile</h1>
            <p class="section-main-subtitle">Manage your account information and preferences</p>
          </div>
          
          <!-- Enhanced Profile Message -->
          <div *ngIf="profileMessage" class="profile-message" [class]="profileMessageType">
            <span class="message-icon">
              {{profileMessageType === 'success' ? '✅' : profileMessageType === 'error' ? '❌' : 'ℹ️'}}
            </span>
            <span>{{profileMessage}}</span>
          </div>
          
          <div class="profile-container" *ngIf="!isLoadingProfile">
            <!-- Profile Header Card -->
            <div class="profile-header-card">
              <div class="profile-avatar-section">
                <div class="profile-avatar-container">
                  <div class="avatar-circle" [style.background-image]="userProfile?.profilePicture ? 'url(' + userProfile?.profilePicture + ')' : 'none'">
                    <span *ngIf="!userProfile?.profilePicture" class="avatar-text">{{userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}}</span>
                  </div>
                  <div class="avatar-upload">
                    <input type="file" #fileInput (change)="onProfilePictureSelected($event)" accept="image/*" style="display: none">
                    <button (click)="fileInput.click()" class="upload-btn">
                      <span class="upload-icon">📷</span>
                    </button>
                  </div>
                  <div class="membership-badge" [style.background-color]="getMembershipColor()">
                    {{getMembershipLevel()}}
                  </div>
                </div>
              </div>
              
              <div class="profile-info-section">
                <h2 class="profile-name">{{userProfile?.name || 'User'}}</h2>
                <p class="profile-email">{{userProfile?.email || 'user@example.com'}}</p>
                <p class="profile-phone" *ngIf="userProfile?.phone">📞 {{userProfile?.phone}}</p>
                <p class="profile-location" *ngIf="userProfile?.city">
                  📍 {{userProfile?.city}}{{userProfile?.country ? ', ' + userProfile?.country : ''}}
                </p>
                <p class="profile-member-since" *ngIf="userProfile?.joinDate">
                  🗓️ Member since {{userProfile?.joinDate | date:'MMM yyyy'}}
                </p>
              </div>
            </div>
            
            <!-- Enhanced Profile Stats -->
            <div class="profile-stats-grid">
              <div class="stat-card">
                <div class="stat-icon">✈️</div>
                <div class="stat-content">
                  <div class="stat-number">{{profileStats?.totalBookings || userBookings.length}}</div>
                  <div class="stat-label">Total Bookings</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">🌍</div>
                <div class="stat-content">
                  <div class="stat-number">{{getUniqueDestinations()}}</div>
                  <div class="stat-label">Destinations</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">💰</div>
                <div class="stat-content">
                  <div class="stat-number">₹{{getTotalSpent() | number}}</div>
                  <div class="stat-label">Total Spent</div>
                </div>
              </div>
              
              <div class="stat-card" *ngIf="profileStats?.milesEarned">
                <div class="stat-icon">🏆</div>
                <div class="stat-content">
                  <div class="stat-number">{{profileStats?.milesEarned | number}}</div>
                  <div class="stat-label">Miles Earned</div>
                </div>
              </div>
              
              <div class="stat-card" *ngIf="profileStats?.upcomingFlights">
                <div class="stat-icon">🛫</div>
                <div class="stat-content">
                  <div class="stat-number">{{profileStats?.upcomingFlights}}</div>
                  <div class="stat-label">Upcoming Flights</div>
                </div>
              </div>
              
              <div class="stat-card" *ngIf="profileStats?.completedFlights">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                  <div class="stat-number">{{profileStats?.completedFlights}}</div>
                  <div class="stat-label">Completed Flights</div>
                </div>
              </div>
            </div>
            
            <!-- Profile Actions -->
            <div class="profile-actions">
              <button (click)="showEditProfile = true" class="profile-btn primary">
                <span class="btn-icon">✏️</span>
                <span>Edit Profile</span>
              </button>
              <button (click)="showChangePasswordModal()" class="profile-btn secondary">
                <span class="btn-icon">🔒</span>
                <span>Change Password</span>
              </button>
              <button (click)="showDeleteAccountModal()" class="profile-btn danger">
                <span class="btn-icon">🗑️</span>
                <span>Delete Account</span>
              </button>
            </div>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="isLoadingProfile" class="profile-loading">
            <div class="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </main>
      
      <!-- Animated Footer -->
      <footer class="animated-footer">
        <!-- SVG Wave Animation -->
        <div class="wave-container">
          <svg class="wave-svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" class="wave-path wave-1"/>
            <path d="M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z" class="wave-path wave-2"/>
            <path d="M0,100 C300,40 900,80 1200,20 L1200,120 L0,120 Z" class="wave-path wave-3"/>
          </svg>
        </div>
        
        <!-- Floating Elements -->
        <div class="floating-elements">
          <div class="float-element plane-element">
            <svg viewBox="0 0 60 20" class="floating-plane">
              <path d="M10,10 L20,8 L45,9 L55,10 L45,11 L20,12 Z" fill="rgba(255,255,255,0.6)"/>
              <path d="M18,10 L25,5 L32,10 L25,15 Z" fill="rgba(255,255,255,0.6)"/>
            </svg>
          </div>
          <div class="float-element cloud-element">
            <svg viewBox="0 0 80 30" class="floating-cloud">
              <ellipse cx="20" cy="20" rx="15" ry="8" fill="rgba(255,255,255,0.4)"/>
              <ellipse cx="35" cy="15" rx="20" ry="10" fill="rgba(255,255,255,0.4)"/>
              <ellipse cx="50" cy="20" rx="15" ry="8" fill="rgba(255,255,255,0.4)"/>
            </svg>
          </div>
          <div class="float-element star-element">
            <svg viewBox="0 0 20 20" class="floating-star">
              <path d="M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8 Z" fill="rgba(255,255,255,0.5)"/>
            </svg>
          </div>
        </div>
        
        <div class="footer-content">
          <div class="footer-grid">
            <!-- Company Info -->
            <div class="footer-section company-info">
              <div class="footer-logo">
                <span class="logo-icon">✈️</span>
                <span class="logo-text">FlightHub</span>
              </div>
              <p class="company-desc">Your trusted partner for seamless flight bookings and unforgettable travel experiences worldwide.</p>
              <div class="social-links">
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">🐦</a>
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">💼</a>
              </div>
            </div>
            
            <!-- Quick Links -->
            <div class="footer-section">
              <h3 class="section-title">Quick Links</h3>
              <ul class="footer-links">
                <li><a href="#">🏠 Home</a></li>
                <li><a href="#">✈️ Flights</a></li>
                <li><a href="#">🏨 Hotels</a></li>
                <li><a href="#">🚗 Car Rentals</a></li>
                <li><a href="#">🎫 Deals</a></li>
              </ul>
            </div>
            
            <!-- Support -->
            <div class="footer-section">
              <h3 class="section-title">Support</h3>
              <ul class="footer-links">
                <li><a href="#">❓ Help Center</a></li>
                <li><a href="#">📞 Contact Us</a></li>
                <li><a href="#">💬 Live Chat</a></li>
                <li><a href="#">📧 Email Support</a></li>
                <li><a href="#">🔄 Refunds</a></li>
              </ul>
            </div>
            
            <!-- Newsletter -->
            <div class="footer-section newsletter">
              <h3 class="section-title">Stay Updated</h3>
              <p class="newsletter-desc">Get the latest deals and travel tips delivered to your inbox!</p>
              <div class="newsletter-form">
                <input type="email" placeholder="Enter your email" class="newsletter-input">
                <button class="newsletter-btn">🚀</button>
              </div>
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <span>+91 1800-123-4567</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span>support@flighthub.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer Bottom -->
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <div class="copyright">
                <span>© 2024 FlightHub. All rights reserved.</span>
              </div>
              <div class="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Innovative Flight Booking Modal -->
    <div *ngIf="showBookingModal" class="booking-modal-overlay">
      <!-- Animated Background SVG -->
      <div class="modal-bg-animation">
        <svg class="floating-clouds" viewBox="0 0 1200 400">
          <g class="cloud-group">
            <ellipse cx="200" cy="100" rx="60" ry="30" fill="rgba(255,255,255,0.1)" class="cloud-1"/>
            <ellipse cx="250" cy="90" rx="80" ry="40" fill="rgba(255,255,255,0.1)" class="cloud-1"/>
            <ellipse cx="300" cy="100" rx="60" ry="30" fill="rgba(255,255,255,0.1)" class="cloud-1"/>
          </g>
          <g class="cloud-group">
            <ellipse cx="800" cy="200" rx="70" ry="35" fill="rgba(255,255,255,0.08)" class="cloud-2"/>
            <ellipse cx="850" cy="190" rx="90" ry="45" fill="rgba(255,255,255,0.08)" class="cloud-2"/>
            <ellipse cx="900" cy="200" rx="70" ry="35" fill="rgba(255,255,255,0.08)" class="cloud-2"/>
          </g>
          <path d="M0,300 Q300,250 600,300 T1200,300 L1200,400 L0,400 Z" fill="rgba(255,255,255,0.05)" class="wave"/>
        </svg>
      </div>
      
      <div class="innovative-booking-modal">
        <!-- Animated Header -->
        <div class="modal-header">
          <div class="header-animation">
            <svg class="plane-animation" viewBox="0 0 100 40">
              <path d="M10,20 L30,15 L70,18 L90,20 L70,22 L30,25 Z" fill="white" class="plane-body"/>
              <path d="M25,20 L35,10 L45,20 L35,30 Z" fill="white" class="plane-wing"/>
              <circle cx="20" cy="20" r="2" fill="#ff4444" class="plane-light"/>
              <circle cx="80" cy="20" r="2" fill="#44ff44" class="plane-light"/>
            </svg>
          </div>
          <div class="header-content">
            <h2 class="modal-title">✈️ Flight Booking</h2>
            <p class="modal-subtitle">Complete your journey in just a few steps</p>
          </div>
          <button (click)="closeModal()" class="close-button">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Enhanced Flight Summary -->
        <div class="flight-summary">
          <div class="summary-card">
            <div class="card-header">
              <h3 class="card-title">Flight Details</h3>
              <div class="flight-number">{{selectedFlight?.flightNumber}}</div>
            </div>
            <div class="route-visualization">
              <div class="departure">
                <div class="airport-code">{{(selectedFlight?.source || '').substring(0,3).toUpperCase()}}</div>
                <div class="city-name">{{selectedFlight?.source}}</div>
                <div class="time">{{selectedFlight?.departureTime}}</div>
              </div>
              <div class="flight-path">
                <svg class="route-svg" viewBox="0 0 200 60">
                  <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3"/>
                      <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="1"/>
                    </linearGradient>
                  </defs>
                  <path d="M20,30 Q100,15 180,30" stroke="url(#pathGradient)" stroke-width="3" fill="none" class="flight-route"/>
                  <circle cx="100" cy="22" r="8" fill="var(--primary-color)" class="plane-dot">
                    <animate attributeName="cx" values="20;180;20" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <text x="100" y="50" text-anchor="middle" fill="var(--text-secondary)" class="duration-text">{{selectedFlight?.duration || '2h 30m'}}</text>
                </svg>
              </div>
              <div class="arrival">
                <div class="airport-code">{{(selectedFlight?.destination || '').substring(0,3).toUpperCase()}}</div>
                <div class="city-name">{{selectedFlight?.destination}}</div>
                <div class="time">{{selectedFlight?.arrivalTime}}</div>
              </div>
            </div>
            <div class="flight-meta">
              <span class="airline">{{selectedFlight?.airline}}</span>
              <span class="date">{{selectedFlight?.departureDate}}</span>
            </div>
          </div>
        </div>
        
        <!-- Class Selection -->
        <div class="section">
          <div class="section-title">
            <h3>🎆 Choose Your Experience</h3>
            <p>Select the perfect class for your journey</p>
          </div>
          <div class="class-grid">
            <div class="class-option" [class.active]="selectedClass === 'economy'" (click)="selectClass('economy')">
              <div class="class-header">
                <div class="class-icon">🪑</div>
                <h4>Economy</h4>
              </div>
              <div class="class-features">
                <span>✓ Standard seat</span>
                <span>✓ Meal included</span>
                <span>✓ 20kg baggage</span>
              </div>
              <div class="class-price">₹{{selectedFlight?.fare | number}}</div>
            </div>
            
            <div class="class-option" [class.active]="selectedClass === 'business'" (click)="selectClass('business')">
              <div class="class-header">
                <div class="class-icon">🛋️</div>
                <h4>Business</h4>
              </div>
              <div class="class-features">
                <span>✓ Premium seat</span>
                <span>✓ Priority boarding</span>
                <span>✓ Lounge access</span>
              </div>
              <div class="class-price">₹{{((selectedFlight?.fare || 0) * 2.5) | number}}</div>
            </div>
            
            <div class="class-option" [class.active]="selectedClass === 'first'" (click)="selectClass('first')">
              <div class="class-header">
                <div class="class-icon">👑</div>
                <h4>First Class</h4>
              </div>
              <div class="class-features">
                <span>✓ Luxury suite</span>
                <span>✓ Gourmet meals</span>
                <span>✓ Personal butler</span>
              </div>
              <div class="class-price">₹{{((selectedFlight?.fare || 0) * 4) | number}}</div>
            </div>
          </div>
        </div>
        
        <!-- Food Selection -->
        <div class="section">
          <div class="section-title">
            <h3>🍽️ Delicious Meals</h3>
            <p>Add tasty meals to enhance your flight experience</p>
          </div>
          <div class="food-grid">
            <div *ngFor="let food of foodItems" 
                 class="food-item" 
                 [class.selected]="selectedFoods.includes(food.id)"
                 (click)="toggleFood(food.id)">
              <div class="food-icon">{{food.icon}}</div>
              <div class="food-info">
                <h4>{{food.name}}</h4>
                <p>{{food.description}}</p>
                <span class="food-price">+₹{{food.price}}</span>
              </div>
              <div class="check-mark" *ngIf="selectedFoods.includes(food.id)">✓</div>
            </div>
          </div>
        </div>
        
        <!-- Passenger Details -->
        <div class="section">
          <div class="section-title">
            <h3>👤 Passenger Details</h3>
            <p>Enter passenger information as per government ID</p>
          </div>
          <div class="form-grid">
            <div class="input-field">
              <label>First Name *</label>
              <input type="text" [(ngModel)]="passengerData.firstName" placeholder="Enter first name" required>
            </div>
            <div class="input-field">
              <label>Last Name *</label>
              <input type="text" [(ngModel)]="passengerData.lastName" placeholder="Enter last name" required>
            </div>
            <div class="input-field">
              <label>Email *</label>
              <input type="email" [(ngModel)]="passengerData.email" placeholder="Enter email" required>
            </div>
            <div class="input-field">
              <label>Gender *</label>
              <select [(ngModel)]="passengerData.gender" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="input-field full-width">
              <label>Aadhar Number (12 digits) *</label>
              <input type="text" [(ngModel)]="passengerData.aadharNumber" 
                     pattern="[0-9]{12}" maxlength="12" 
                     placeholder="123456789012" required>
            </div>
          </div>
        </div>
        
        <!-- Price Summary & Actions -->
        <div class="modal-footer">
          <div class="price-summary">
            <div class="price-card">
              <h4>💰 Price Breakdown</h4>
              <div class="price-items">
                <div class="price-row">
                  <span>Base Fare ({{selectedClass}})</span>
                  <span>₹{{getBaseFare() | number}}</span>
                </div>
                <div class="price-row" *ngIf="selectedFoods.length > 0">
                  <span>Meals ({{selectedFoods.length}} items)</span>
                  <span>₹{{getFoodTotal() | number}}</span>
                </div>
                <div class="price-row">
                  <span>Taxes & Fees</span>
                  <span>₹{{getTaxes() | number}}</span>
                </div>
                <div class="price-total">
                  <span>Total Amount</span>
                  <span>₹{{getTotalPrice() | number}}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button (click)="closeModal()" class="cancel-btn">
              <svg viewBox="0 0 24 24" class="btn-icon">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
              Cancel
            </button>
            <button (click)="confirmBooking()" class="confirm-btn">
              <svg viewBox="0 0 24 24" class="btn-icon">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              <span>Confirm Booking</span>
              <div class="price-tag">₹{{getTotalPrice() | number}}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Payment Modal -->
    <div *ngIf="showPaymentModal" class="payment-modal-overlay">
      <div class="payment-modal">
        <div class="payment-header">
          <h2 class="payment-title">💳 Secure Payment</h2>
          <p class="payment-subtitle">Complete your flight booking payment</p>
        </div>
        
        <div class="payment-content">
          <div class="payment-summary">
            <h4>📋 Booking Summary</h4>
            <div class="summary-row">
              <span>Booking ID:</span>
              <span>#{{selectedBooking?.id}}</span>
            </div>
            <div class="summary-row">
              <span>Total Amount:</span>
              <span class="amount">₹{{selectedBooking?.totalFare | number}}</span>
            </div>
          </div>
          
          <div class="payment-methods">
            <div class="payment-method" 
                 [class.selected]="paymentMethod === 'RAZORPAY'"
                 (click)="paymentMethod = 'RAZORPAY'">
              <div class="payment-icon">💳</div>
              <div class="method-name">Razorpay</div>
            </div>
            <div class="payment-method" 
                 [class.selected]="paymentMethod === 'UPI'"
                 (click)="paymentMethod = 'UPI'">
              <div class="payment-icon">📱</div>
              <div class="method-name">UPI</div>
            </div>
            <div class="payment-method" 
                 [class.selected]="paymentMethod === 'CARD'"
                 (click)="paymentMethod = 'CARD'">
              <div class="payment-icon">💰</div>
              <div class="method-name">Card</div>
            </div>
            <div class="payment-method" 
                 [class.selected]="paymentMethod === 'WALLET'"
                 (click)="paymentMethod = 'WALLET'">
              <div class="payment-icon">👛</div>
              <div class="method-name">Wallet</div>
            </div>
          </div>
          
          <div class="payment-actions">
            <button (click)="closePaymentModal()" class="payment-btn cancel-payment-btn">
              ❌ Cancel
            </button>
            <button (click)="processPayment()" class="payment-btn pay-now-btn">
              🚀 Pay ₹{{selectedBooking?.totalFare | number}}
            </button>
            <button (click)="testRazorpay()" class="payment-btn" style="background: #ff6b6b; margin-top: 10px;">
              🧪 Test Razorpay
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chatbox Component -->
    <app-chatbox></app-chatbox>
    
    <!-- Settings Modal -->
    <app-settings-modal 
      [show]="showSettingsModal" 
      (close)="showSettingsModal = false"
      (themeChange)="onThemeChange($event)">
    </app-settings-modal>
    
    <!-- Upgrade Modal -->
    <app-upgrade-modal 
      [show]="showUpgradeModal" 
      (close)="showUpgradeModal = false">
    </app-upgrade-modal>
    
    <!-- Boarding Pass Modal -->
    <app-boarding-pass-modal 
      [show]="showBoardingPassModal" 
      [boardingPasses]="generatedBoardingPasses"
      (close)="closeBoardingPassModal()">
    </app-boarding-pass-modal>

    <!-- Edit Profile Modal -->
    <div *ngIf="showEditProfile" class="modal-overlay">
      <div class="profile-modal">
        <div class="modal-header">
          <h2 class="modal-title">✏️ Edit Profile</h2>
          <button (click)="cancelEditProfile()" class="close-btn">×</button>
        </div>
        
        <div class="modal-content">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" [(ngModel)]="editProfileForm.name" placeholder="Enter your full name" required>
            </div>
            
            <div class="form-group">
              <label>Email *</label>
              <input type="email" [(ngModel)]="editProfileForm.email" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" [(ngModel)]="editProfileForm.phone" placeholder="Enter your phone number">
            </div>
            
            <div class="form-group">
              <label>Date of Birth</label>
              <input type="date" [(ngModel)]="editProfileForm.dateOfBirth">
            </div>
            
            <div class="form-group">
              <label>Gender</label>
              <select [(ngModel)]="editProfileForm.gender">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>City</label>
              <input type="text" [(ngModel)]="editProfileForm.city" placeholder="Enter your city">
            </div>
            
            <div class="form-group full-width">
              <label>Address</label>
              <textarea [(ngModel)]="editProfileForm.address" placeholder="Enter your address" rows="3"></textarea>
            </div>
          </div>
          
          <div class="preferences-section">
            <h3>Travel Preferences</h3>
            <div class="preferences-grid">
              <div class="form-group">
                <label>Seat Preference</label>
                <select [(ngModel)]="editProfileForm.preferences!.seatPreference">
                  <option value="">No Preference</option>
                  <option value="Window">Window</option>
                  <option value="Aisle">Aisle</option>
                  <option value="Middle">Middle</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Meal Preference</label>
                <select [(ngModel)]="editProfileForm.preferences!.mealPreference">
                  <option value="">No Preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Jain">Jain</option>
                </select>
              </div>
            </div>
            
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="editProfileForm.preferences!.newsletter">
                <span class="checkmark"></span>
                Subscribe to newsletter
              </label>
              
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="editProfileForm.preferences!.notifications">
                <span class="checkmark"></span>
                Enable notifications
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button (click)="cancelEditProfile()" class="btn-cancel">Cancel</button>
          <button (click)="saveProfile()" class="btn-save" [disabled]="isLoadingProfile">
            <span *ngIf="!isLoadingProfile">Save Changes</span>
            <span *ngIf="isLoadingProfile">Saving...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div *ngIf="showChangePassword" class="modal-overlay">
      <div class="profile-modal">
        <div class="modal-header">
          <h2 class="modal-title">🔒 Change Password</h2>
          <button (click)="cancelChangePassword()" class="close-btn">×</button>
        </div>
        
        <div class="modal-content">
          <div class="form-group">
            <label>Current Password *</label>
            <input type="password" [(ngModel)]="passwordForm.currentPassword" placeholder="Enter current password" required>
          </div>
          
          <div class="form-group">
            <label>New Password *</label>
            <input type="password" [(ngModel)]="passwordForm.newPassword" placeholder="Enter new password" required>
          </div>
          
          <div class="form-group">
            <label>Confirm New Password *</label>
            <input type="password" [(ngModel)]="passwordForm.confirmPassword" placeholder="Confirm new password" required>
          </div>
          
          <div class="password-requirements">
            <p>Password must be at least 6 characters long</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button (click)="cancelChangePassword()" class="btn-cancel">Cancel</button>
          <button (click)="changePassword()" class="btn-save" [disabled]="isLoadingProfile">
            <span *ngIf="!isLoadingProfile">Change Password</span>
            <span *ngIf="isLoadingProfile">Changing...</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div *ngIf="showDeleteAccount" class="modal-overlay">
      <div class="profile-modal danger-modal">
        <div class="modal-header">
          <h2 class="modal-title">🗑️ Delete Account</h2>
          <button (click)="cancelDeleteAccount()" class="close-btn">×</button>
        </div>
        
        <div class="modal-content">
          <div class="warning-message">
            <div class="warning-icon">⚠️</div>
            <h3>Are you sure you want to delete your account?</h3>
            <p>This action cannot be undone. All your data, bookings, and preferences will be permanently deleted.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button (click)="cancelDeleteAccount()" class="btn-cancel">Cancel</button>
          <button (click)="confirmDeleteAccount()" class="btn-danger" [disabled]="isLoadingProfile">
            <span *ngIf="!isLoadingProfile">Delete Account</span>
            <span *ngIf="isLoadingProfile">Deleting...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Theme Variables */
    .modern-dashboard[data-theme="light"] {
      --primary-color: #667eea;
      --secondary-color: #764ba2;
      --accent-color: #4facfe;
      --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --card-bg: #ffffff;
      --modal-bg: #ffffff;
      --modal-card-bg: #f8fafc;
      --text-primary: #2d3748;
      --text-secondary: #4a5568;
      --border-color: #e2e8f0;
      --input-bg: #ffffff;
      --surface-color: #ffffff;
    }
    
    .modern-dashboard[data-theme="dark"] {
      --primary-color: #667eea;
      --secondary-color: #764ba2;
      --accent-color: #63b3ed;
      --bg-gradient: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
      --card-bg: #2d3748;
      --modal-bg: #2d3748;
      --modal-card-bg: #1a202c;
      --text-primary: #f7fafc;
      --text-secondary: #e2e8f0;
      --border-color: #4a5568;
      --input-bg: #2d3748;
      --surface-color: #2d3748;
    }
    
    .modern-dashboard {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      background: var(--bg-gradient);
      color: var(--text-primary);
      transition: all 0.3s ease;
    }
    
    /* Default to light theme */
    .modern-dashboard:not([data-theme]) {
      --primary-color: #667eea;
      --secondary-color: #764ba2;
      --accent-color: #4facfe;
      --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --card-bg: #ffffff;
      --modal-bg: #ffffff;
      --modal-card-bg: #f8fafc;
      --text-primary: #2d3748;
      --text-secondary: #4a5568;
      --border-color: #e2e8f0;
      --input-bg: #ffffff;
      --surface-color: #ffffff;
    }
    
    .modern-dashboard.modal-open {
      filter: blur(8px);
      transform: scale(0.95);
      pointer-events: none;
      transition: all 0.3s ease;
    }
    
    .modern-dashboard.search-loading .geometric-background,
    .modern-dashboard.search-loading .header-overlay,
    .modern-dashboard.search-loading .navbar,
    .modern-dashboard.search-loading .hero-section > *:not(.search-widget),
    .modern-dashboard.search-loading .main-content {
      filter: blur(4px);
      pointer-events: none;
      transition: all 0.3s ease;
    }
    
    .modern-dashboard.search-loading .flight-search-loader {
      filter: none !important;
      pointer-events: auto;
      z-index: 100001 !important;
    }
    
    /* Hero Header */
    .hero-header {
      position: relative;
      min-height: 60vh;
      background: var(--bg-gradient);
      overflow: visible;
      z-index: 1000;
      transition: all 0.3s ease;
    }
    
    .hero-header.compact {
      min-height: 120px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    }
    
    /* Simple Theme Toggle */
    .nav-theme-toggle {
      margin-left: auto;
      z-index: 1001;
      position: relative;
    }
    
    .header-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.1);
    }
    
    .navbar {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      backdrop-filter: blur(30px);
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3);
      margin: 1rem 2rem 0;
      border-radius: 20px;
    }
    
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .brand-logo {
      position: relative;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(102,126,234,0.3);
      overflow: hidden;
      border: 2px solid rgba(255,255,255,0.2);
    }
    
    .brand-logo .logo-icon {
      font-size: 1.5rem;
      color: white;
      z-index: 2;
      animation: float 4s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    
    .brand-logo .logo-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: logoShine 3s ease-in-out infinite;
    }
    
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    
    .brand-name {
      font-size: 1.5rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      line-height: 1;
      background: linear-gradient(135deg, #ffffff, #f1f5f9);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.5px;
    }
    
    .brand-tagline {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.75);
      font-weight: 500;
      margin-top: 0.1rem;
      letter-spacing: 0.3px;
      opacity: 0.9;
    }
    
    .hero-section {
      position: relative;
      z-index: 5;
      text-align: center;
      padding: 4rem 2rem 2rem;
      color: white;
    }
    
    .main-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      animation: slideInUp 1s ease-out;
    }
    
    .main-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      opacity: 0.9;
      animation: slideInUp 1s ease-out 0.2s both;
    }
    
    .search-widget {
      max-width: 900px;
      margin: 0 auto;
      animation: slideInUp 1s ease-out 0.4s both;
      position: relative;
      z-index: 99999;
    }
    
    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      background: rgba(255,255,255,0.95);
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 99999;
    }
    
    .search-field {
      position: relative;
      z-index: 999999;
    }
    
    .city-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1);
      z-index: 999999;
      max-height: 280px;
      overflow: hidden;
      border: none;
      animation: dropdownSlide 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(20px);
    }
    
    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-15px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    .city-option {
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
    }
    
    .city-option::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    }
    
    .city-option:last-child::after {
      display: none;
    }
    
    .city-option::before {
      font-size: 1.1rem;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
      transition: all 0.3s ease;
    }
    
    .city-option:hover {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      transform: translateX(8px) scale(1.02);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }
    
    .city-option:hover::before {
      background: rgba(255,255,255,0.2);
      transform: scale(1.1);
    }
    
    .city-name {
      font-weight: 600;
      font-size: 1rem;
      flex: 1;
    }
    
    .city-option:hover .city-name {
      font-weight: 700;
    }
    
    .city-dropdown {
      overflow-y: auto;
    }
    
    .city-dropdown::-webkit-scrollbar {
      width: 8px;
    }
    
    .city-dropdown::-webkit-scrollbar-track {
      background: rgba(102, 126, 234, 0.05);
      border-radius: 4px;
      margin: 8px 0;
    }
    
    .city-dropdown::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }
    
    .city-dropdown::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
      background-clip: content-box;
    }
    
    .dropdown-header {
      padding: 12px 20px 8px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      border-bottom: 1px solid rgba(102, 126, 234, 0.1);
      position: sticky;
      top: 0;
      z-index: 1;
      backdrop-filter: blur(10px);
    }
    
    .header-text {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .city-option.recent {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
    }
    
    .city-option.recent::before {
      content: '🕒';
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
    }
    
    .city-option.popular:not(.recent)::before {
      content: '🔥';
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(254, 202, 87, 0.15) 100%);
    }
    
    .city-option:not(.recent):not(.popular)::before {
      content: '📍';
      background: rgba(148, 163, 184, 0.15);
    }
    
    .clear-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      transition: all 0.2s ease;
      z-index: 10;
    }
    
    .clear-btn:hover {
      background: #f1f5f9;
      color: #64748b;
      transform: translateY(-50%) scale(1.1);
    }
    
    .field-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      z-index: 2;
      color: var(--primary-color);
    }
    
    .field-input {
      width: 100%;
      padding: 15px 15px 15px 50px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .field-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .search-field:focus-within .city-dropdown {
      display: block;
    }
    
    .field-label {
      position: absolute;
      left: 50px;
      top: -8px;
      background: white;
      padding: 0 8px;
      color: var(--primary-color);
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .search-button {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .search-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .search-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .search-loading {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Premium Flight Search Loader */
    .flight-search-loader {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 450px;
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
      z-index: 100000;
      animation: loaderDropDown 0.4s ease-out;
      border-radius: 20px;
      box-shadow: 
        0 20px 40px rgba(0,0,0,0.15),
        0 0 0 1px rgba(102,126,234,0.2),
        inset 0 1px 0 rgba(255,255,255,0.9);
      backdrop-filter: blur(20px);
      overflow: hidden;
    }
    
    .flight-search-loader::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2, #ff6b6b);
      animation: shimmerEffect 1.5s ease-in-out infinite;
    }
    
    .loader-container {
      padding: 1.8rem 1.5rem;
      width: 100%;
      text-align: center;
      animation: loaderBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }
    
    .loader-header {
      margin-bottom: 1.5rem;
    }
    
    .loader-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.3rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .loader-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0.8;
    }
    
    .flight-animation {
      margin: 1.2rem 0;
    }
    
    .flight-path {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1.2rem 0;
    }
    
    .departure-city, .arrival-city {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-color);
      padding: 0.6rem 1rem;
      background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08));
      border-radius: 12px;
      border: 1px solid rgba(102,126,234,0.15);
      min-width: 80px;
      font-size: 0.85rem;
    }
    
    .flight-route {
      flex: 1;
      position: relative;
      margin: 0 2rem;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .route-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
      transform: translateY(-50%);
    }
    
    .flying-plane {
      position: absolute;
      font-size: 2rem;
      z-index: 2;
      animation: flyAcross 2s ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    
    .route-dots {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      transform: translateY(-50%);
      padding: 0 20px;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: dotPulse 1.5s ease-in-out infinite;
    }
    
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }
    .dot:nth-child(4) { animation-delay: 0.9s; }
    .dot:nth-child(5) { animation-delay: 1.2s; }
    
    .search-progress {
      margin: 1.2rem 0;
    }
    
    .progress-bar {
      width: 100%;
      height: 4px;
      background: rgba(102,126,234,0.1);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 1rem;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
      animation: progressFill 2s ease-in-out;
    }
    
    .search-steps {
      display: flex;
      justify-content: space-between;
      gap: 0.8rem;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      opacity: 0.5;
      transition: all 0.3s ease;
    }
    
    .step.active {
      opacity: 1;
      transform: scale(1.05);
    }
    
    .step-icon {
      font-size: 1.2rem;
      animation: stepPulse 1s ease-in-out infinite;
    }
    
    .step-text {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .loader-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 1.2rem;
      padding-top: 1.2rem;
      border-top: 1px solid rgba(102,126,234,0.15);
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-number {
      display: block;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-bottom: 0.2rem;
    }
    
    .stat-label {
      font-size: 0.65rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      opacity: 0.8;
    }
    
    .search-message {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border: 1px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      margin: 2rem auto;
      max-width: 600px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-primary);
      font-weight: 500;
      animation: slideInUp 0.3s ease-out;
    }
    
    .message-icon {
      font-size: 1.2rem;
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex: 1;
      justify-content: center;
      background: rgba(255,255,255,0.1);
      padding: 0.75rem 1rem;
      border-radius: 16px;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
      position: relative;
    }
    
    .nav-theme-toggle {
      margin-left: 1rem;
      z-index: 1001;
      position: relative;
    }
    
    .nav-link {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.75rem 0.8rem;
      border-radius: 12px;
      text-decoration: none;
      color: rgba(255,255,255,0.75);
      font-weight: 600;
      font-size: 0.75rem;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
      min-width: 65px;
      cursor: pointer;
      border: none;
      background: transparent;
      font-family: inherit;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08));
      opacity: 0;
      transition: all 0.3s ease;
      border-radius: 10px;
    }
    
    .nav-link:hover::before {
      opacity: 1;
    }
    
    .nav-link:hover {
      color: white;
      transform: translateY(-2px) scale(1.05);
      background: rgba(255,255,255,0.15);
      box-shadow: 0 8px 25px rgba(255,255,255,0.2);
    }
    
    .nav-link.active {
      background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.2));
      color: white;
      box-shadow: 0 6px 20px rgba(255,255,255,0.25), inset 0 1px 0 rgba(255,255,255,0.4);
      border: 1px solid rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }
    
    /* Dynamic Active State */
    .nav-links .nav-link {
      position: relative;
    }
    
    .nav-links .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
      animation: activeIndicator 0.3s ease-out;
    }
    
    @keyframes activeIndicator {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        width: 20px;
        opacity: 1;
      }
    }
    
    .nav-icon {
      font-size: 1.25rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      margin-bottom: 0.1rem;
    }
    
    .nav-text {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .notifications {
      position: relative;
    }

    .notifications.open .notification-btn {
      background: rgba(255,255,255,0.3);
      transform: scale(1.05);
    }
    
    .notification-btn {
      position: relative;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 0.75rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(15px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }
    
    .notification-btn:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
    }
    
    .notification-icon {
      font-size: 1.2rem;
      color: white;
    }
    
    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      min-width: 18px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(255,107,107,0.4);
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }
    
    .user-avatar {
      position: relative;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
      border: 2px solid rgba(255,255,255,0.25);
    }
    
    .avatar-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #48bb78;
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse 2s infinite;
    }
    

    
    .user-info {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      color: white;
      font-weight: 700;
      font-size: 0.9rem;
      line-height: 1.2;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }
    
    .user-role {
      color: rgba(255,255,255,0.75);
      font-size: 0.7rem;
      font-weight: 500;
      opacity: 0.9;
    }
    
    .user-dropdown {
      position: relative;
    }
    
    .dropdown-toggle {
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 0.6rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(15px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }
    
    .dropdown-toggle:hover {
      background: rgba(255,255,255,0.2);
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
    }
    
    .dropdown-arrow {
      color: white;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }
    
    .dropdown-toggle:hover .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.98));
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 0.75rem;
      min-width: 200px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }
    
    .user-dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
    }
    
    .dropdown-item:hover {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      transform: translateX(4px);
    }
    
    .dropdown-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(102,126,234,0.2), transparent);
      margin: 0.5rem 0;
    }
    
    .logout-item {
      color: #e53e3e;
    }
    
    .logout-item:hover {
      background: linear-gradient(135deg, #e53e3e, #c53030);
      color: white;
    }
    
    .item-icon {
      font-size: 1rem;
    }
    

    
    .hero-content {
      position: relative;
      z-index: 5;
      text-align: center;
      padding: 3rem 2rem;
      color: white;
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      animation: slideInUp 1s ease-out;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 3rem;
      opacity: 0.9;
      animation: slideInUp 1s ease-out 0.2s both;
    }
    
    .search-container {
      max-width: 900px;
      margin: 0 auto;
      animation: slideInUp 1s ease-out 0.4s both;
    }
    
    .search-form {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      background: rgba(255,255,255,0.95);
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
    }
    
    .input-group {
      position: relative;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .input-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      z-index: 2;
    }
    
    .search-input {
      width: 100%;
      padding: 15px 15px 15px 50px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .floating-label {
      position: absolute;
      left: 50px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 0.875rem;
      pointer-events: none;
      transition: all 0.3s ease;
    }
    
    .search-input:focus + .floating-label,
    .search-input:not(:placeholder-shown) + .floating-label {
      top: 8px;
      font-size: 0.75rem;
      color: #667eea;
    }
    
    .search-btn {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .search-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    /* Enhanced Main Content Background */
    .main-content {
      padding: 3rem 2rem;
      background: var(--bg-color) !important;
      color: var(--text-color) !important;
      min-height: 50vh;
      position: relative;
      z-index: 1;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .main-content::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 107, 107, 0.03) 0%, transparent 50%);
      z-index: -1;
      animation: backgroundShift 20s ease-in-out infinite;
    }
    
    .main-content::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23e2e8f0" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.4;
      z-index: -1;
    }
    
    .flight-results {
      margin-bottom: 3rem;
    }
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .results-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .flight-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .sort-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 25px;
      background: white;
      color: var(--text-primary);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;
    }
    
    .sort-select:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .refresh-btn {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      white-space: nowrap;
    }
    
    .refresh-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .refresh-icon {
      animation: rotate 2s linear infinite paused;
    }
    
    .refresh-btn:active .refresh-icon {
      animation-play-state: running;
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .results-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .results-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--card-bg);
      padding: 10px 20px;
      border-radius: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 2px solid var(--primary-color);
    }
    
    .badge-count {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .badge-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
    }
    
    .results-count {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      padding: 10px 20px;
      border-radius: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .count-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #667eea;
    }
    
    .count-text {
      color: #666;
      font-size: 0.875rem;
    }
    
    /* Enhanced Flight Cards */
    .flight-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 1.5rem;
    }
    
    .premium-flight-card {
      background: var(--surface-color) !important;
      color: var(--text-color) !important;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 6px 25px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
      animation: slideInUp 0.6s ease-out both;
      border: 1px solid var(--border-color) !important;
      position: relative;
      overflow: hidden;
    }
    
    .premium-flight-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .premium-flight-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .airline-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .airline-badge {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      background: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.2rem;
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
    }
    
    .flight-code {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.25rem 0;
    }
    
    .airline-title {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin: 0 0 0.5rem 0;
    }
    

    
    .price-section {
      text-align: right;
    }
    
    .price-badge {
      background: var(--primary-color);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
    }
    
    .currency {
      font-size: 1rem;
      font-weight: 600;
    }
    
    .price {
      font-size: 1.5rem;
      font-weight: 700;
      margin-left: 0.25rem;
    }
    
    .price-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }
    
    .route-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1rem 0;
      padding: 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    
    .departure-info, .arrival-info {
      text-align: center;
      flex: 1;
    }
    
    .city-code {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .city-name {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0.25rem 0;
    }
    
    .departure-time, .arrival-time {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .flight-path {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 0 1rem;
    }
    
    .flight-line {
      height: 2px;
      background: var(--primary-color);
      flex: 1;
      position: relative;
    }
    
    .aircraft-icon {
      position: absolute;
      background: white;
      padding: 5px;
      border-radius: 50%;
      animation: fly 2s ease-in-out infinite;
    }
    
    .duration-badge {
      position: absolute;
      top: -25px;
      background: var(--primary-color);
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 500;
    }
    
    .flight-features {
      margin: 1rem 0;
    }
    
    .feature-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-tag {
      background: rgba(255,255,255,0.1);
      color: var(--text-secondary);
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .flight-info {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .info-icon {
      font-size: 1rem;
    }
    
    .class-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .class-card {
      border: 2px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--card-bg);
      position: relative;
      overflow: hidden;
    }
    
    .class-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-color);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .class-card:hover {
      border-color: var(--primary-color);
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .class-card:hover::before {
      transform: scaleX(1);
    }
    
    .class-card.selected {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.05);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
    }
    
    .class-card.selected::before {
      transform: scaleX(1);
    }
    
    .class-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .class-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .class-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 1rem 0;
    }
    
    .class-features {
      list-style: none;
      padding: 0;
      margin: 0 0 1rem 0;
    }
    
    .class-features li {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }
    
    .class-pricing {
      text-align: center;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
    
    .class-price {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
    }
    
    .food-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .food-card {
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--card-bg);
      position: relative;
      text-align: center;
    }
    
    .food-card:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .food-card.selected {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.05);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
    }
    
    .food-image {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
    
    .food-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .food-description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0 0 0.75rem 0;
    }
    
    .food-pricing {
      margin-bottom: 0.5rem;
    }
    
    .food-price {
      font-size: 1rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .selection-indicator {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--primary-color);
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 700;
    }
    
    .book-flight-btn {
      width: 100%;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 15px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .book-flight-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
    }
    
    .book-flight-btn.unavailable {
      background: #e2e8f0;
      color: #a0aec0;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    
    /* My Bookings Section */
    .bookings-section {
      margin-top: 3rem;
    }
    
    .bookings-count {
      background: var(--card-bg);
      color: var(--primary-color);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 600;
      border: 2px solid var(--primary-color);
    }
    
    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .booking-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      animation: slideInUp 0.6s ease-out both;
      border-left: 4px solid var(--primary-color);
    }
    
    .booking-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .booking-id {
      display: flex;
      flex-direction: column;
    }
    
    .id-label {
      font-size: 0.75rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .id-number {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    
    .booking-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .booking-status.pending {
      background: #fef5e7;
      color: #d69e2e;
    }
    
    .booking-status.confirmed {
      background: #f0fff4;
      color: #38a169;
    }
    
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    
    .booking-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1rem 0;
    }
    
    .passenger-info, .seat-info, .amount-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-secondary);
    }
    
    .pay-btn {
      width: 100%;
      background: linear-gradient(45deg, #48bb78, #38a169);
      color: white;
      border: none;
      padding: 12px;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .pay-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
    }
    
    .boarding-pass-btn {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .boarding-pass-btn:hover {
      background: linear-gradient(135deg, #38a169, #2f855a);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
    }
    
    /* Animations */
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes fly {
      0%, 100% { transform: translateX(-10px); }
      50% { transform: translateX(10px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .search-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.5rem;
      }
      
      .slider-wrapper {
        height: 400px;
      }
      
      .slide-title {
        font-size: 2.5rem;
      }
      
      .slide-description {
        font-size: 1.1rem;
      }
      
      .content-wrapper {
        margin-right: 2rem;
      }
      
      .slide-stats {
        gap: 1rem;
      }
      
      .stat-number {
        font-size: 2rem;
      }
      
      .destination-grid {
        grid-template-columns: 1fr;
      }
      
      .premium-perks {
        flex-direction: column;
        gap: 1rem;
      }
      
      .advanced-controls {
        bottom: 2rem;
        padding: 1rem 2rem;
        gap: 1rem;
      }
      
      .progress-bar {
        width: 100px;
      }
      
      .slide-counter {
        top: 2rem;
        right: 2rem;
        padding: 0.75rem 1rem;
      }
      
      .main-title {
        font-size: 2.5rem;
      }
      
      .flight-cards, .bookings-grid {
        grid-template-columns: 1fr;
      }
      
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .nav-links {
        order: 2;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      }
      
      .nav-text {
        display: none;
      }
      
      .user-section {
        order: 3;
        gap: 1rem;
      }
      
      .brand {
        order: 1;
      }
      
      .brand-name {
        font-size: 1.4rem;
      }
      
      .brand-tagline {
        font-size: 0.7rem;
      }
      
      .theme-controls {
        position: relative;
        top: auto;
        right: auto;
        margin-bottom: 1rem;
      }
      
      .hero-section {
        padding: 2rem 1rem;
      }
      
      .results-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .premium-flight-card {
        padding: 1rem;
      }
      
      .route-display {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .flight-path {
        order: 2;
        margin: 1rem 0;
      }
      
      .class-tabs {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }
      
      .footer-content {
        padding: 6rem 1rem 2rem;
      }
      
      .footer-bottom-content {
        flex-direction: column;
        text-align: center;
      }
      
      .social-links {
        justify-content: center;
      }
      
      .newsletter-form {
        flex-direction: column;
      }
    }
    
    @media (max-width: 480px) {
      .main-title {
        font-size: 2rem;
      }
      
      .main-subtitle {
        font-size: 1rem;
      }
      
      .search-grid {
        padding: 1rem;
      }
      
      .premium-flight-card {
        margin: 0 0.5rem;
      }
      
      .food-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-header {
        padding: 1.5rem;
      }
      
      .modal-title {
        font-size: 1.5rem;
      }
      
      .section {
        padding: 1.5rem;
      }
      
      .footer-content {
        padding: 4rem 1rem 1rem;
      }
      
      .logo-text {
        font-size: 1.5rem;
      }
      
      .footer-bottom-links {
        flex-direction: column;
        gap: 1rem;
      }
    }
    
    /* Modern Booking Modal */
    .booking-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 2rem;
    }
    
    .modal-bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }
    
    .floating-clouds {
      width: 100%;
      height: 100%;
      opacity: 0.3;
    }
    
    .cloud-1 {
      animation: floatSlow 30s linear infinite;
    }
    
    .cloud-2 {
      animation: floatReverse 35s linear infinite;
    }
    
    .wave {
      animation: gentleWave 20s ease-in-out infinite;
    }
    
    .innovative-booking-modal {
      background: #ffffff;
      border-radius: 24px;
      width: 100%;
      max-width: 900px;
      max-height: 85vh;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1);
      animation: modalAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 10;
      overflow-y: auto;
    }
    
    .modal-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 3rem 2rem 2rem;
      position: relative;
      overflow: hidden;
    }
    
    .modal-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="20" fill="url(%23grain)"/></svg>');
    }
    
    .header-animation {
      position: absolute;
      top: 1rem;
      right: 2rem;
      width: 80px;
      height: 40px;
      z-index: 3;
    }
    
    .plane-animation {
      width: 100%;
      height: 100%;
      animation: smoothFly 4s ease-in-out infinite;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }
    
    .header-content {
      position: relative;
      z-index: 2;
      text-align: center;
    }
    
    .modal-title {
      font-size: 2.2rem;
      font-weight: 900;
      color: white;
      margin: 0 0 0.75rem 0;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      letter-spacing: -0.5px;
    }
    
    .modal-subtitle {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.95);
      margin: 0;
      font-weight: 400;
      opacity: 0.9;
    }
    
    .close-button {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      color: white;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
      backdrop-filter: blur(10px);
    }
    
    .close-button:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.4);
      transform: scale(1.05) rotate(90deg);
    }
    
    .close-icon {
      width: 18px;
      height: 18px;
      stroke-width: 2.5;
    }
    
    .flight-summary {
      padding: 2.5rem 2rem;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      position: relative;
    }
    
    .flight-summary::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
    }
    
    .summary-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      border: none;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      position: relative;
      overflow: hidden;
    }
    
    .summary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    
    .card-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0;
      position: relative;
    }
    
    .card-title::after {
      content: '✈️';
      margin-left: 0.5rem;
      font-size: 1.2rem;
    }
    
    .flight-number {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      letter-spacing: 0.5px;
    }
    
    .route-visualization {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;
    }
    
    .departure, .arrival {
      text-align: center;
      flex: 1;
      position: relative;
    }
    
    .departure::before {
      content: '🛫';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
    }
    
    .arrival::before {
      content: '🛬';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
    }
    
    .airport-code {
      font-size: 1.8rem;
      font-weight: 900;
      color: #2d3748;
      margin-top: 1rem;
      letter-spacing: -1px;
    }
    
    .city-name {
      font-size: 0.9rem;
      color: #4a5568;
      margin: 0.5rem 0;
      font-weight: 500;
    }
    
    .time {
      font-size: 1.1rem;
      font-weight: 700;
      color: #667eea;
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      display: inline-block;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .flight-path {
      flex: 2;
      margin: 0 2rem;
      position: relative;
    }
    
    .route-svg {
      width: 100%;
      height: 80px;
    }
    
    .flight-route {
      stroke-dasharray: 400;
      stroke-dashoffset: 400;
      animation: drawRoute 3s ease-in-out forwards;
      filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2));
    }
    
    .plane-dot {
      filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
    }
    
    .duration-text {
      font-size: 0.8rem;
      font-weight: 700;
      fill: #667eea;
    }
    
    .flight-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 12px;
      font-size: 0.9rem;
      color: #4a5568;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .airline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .airline::before {
      content: '🏢';
      font-size: 1rem;
    }
    
    .date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .date::before {
      content: '📅';
      font-size: 1rem;
    }
    
    .section {
      padding: 2.5rem 2rem;
      background: white;
      position: relative;
    }
    
    .section:not(:last-child)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 2rem;
      right: 2rem;
      height: 1px;
      background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    }
    
    .section-title {
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
    }
    
    .section-title::before {
      content: '';
      position: absolute;
      top: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
    }
    
    .section-title h3 {
      font-size: 1.6rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 0.75rem 0;
      letter-spacing: -0.5px;
    }
    
    .section-title p {
      font-size: 1rem;
      color: #4a5568;
      margin: 0;
      font-weight: 400;
      opacity: 0.8;
    }
    
    .class-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    
    .class-option {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 3px solid #e2e8f0;
      border-radius: 20px;
      padding: 2rem 1.5rem;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .class-option::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .class-option:hover {
      border-color: #667eea;
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    }
    
    .class-option:hover::before {
      transform: scaleX(1);
    }
    
    .class-option.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
      transform: translateY(-8px) scale(1.02);
    }
    
    .class-option.active::before {
      transform: scaleX(1);
    }
    
    .class-header {
      margin-bottom: 1.5rem;
    }
    
    .class-header .class-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    
    .class-header h4 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .class-features {
      margin-bottom: 1.5rem;
    }
    
    .class-features span {
      display: block;
      font-size: 0.85rem;
      color: #4a5568;
      margin-bottom: 0.5rem;
      padding: 0.25rem 0;
      position: relative;
      font-weight: 500;
    }
    
    .class-features span::before {
      content: '✓';
      color: #48bb78;
      font-weight: 700;
      margin-right: 0.5rem;
    }
    
    .class-price {
      font-size: 1.4rem;
      font-weight: 900;
      color: #667eea;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .food-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .food-item {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .food-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ff6b6b, #feca57);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .food-item:hover {
      border-color: #ff6b6b;
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(255, 107, 107, 0.15);
    }
    
    .food-item:hover::before {
      transform: scaleX(1);
    }
    
    .food-item.selected {
      border-color: #ff6b6b;
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(254, 202, 87, 0.05) 100%);
      transform: translateY(-6px);
      box-shadow: 0 12px 24px rgba(255, 107, 107, 0.2);
    }
    
    .food-item.selected::before {
      transform: scaleX(1);
    }
    
    .food-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    
    .food-info h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.75rem 0;
      letter-spacing: -0.25px;
    }
    
    .food-info p {
      font-size: 0.85rem;
      color: #4a5568;
      margin: 0 0 1rem 0;
      line-height: 1.4;
    }
    
    .food-price {
      font-size: 1rem;
      font-weight: 800;
      color: #ff6b6b;
      background: linear-gradient(135deg, #ff6b6b, #feca57);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .check-mark {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
      animation: checkPulse 0.6s ease-out;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .input-field {
      position: relative;
    }
    
    .input-field.full-width {
      grid-column: 1 / -1;
    }
    
    .input-field label {
      font-size: 0.9rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.75rem;
      display: block;
      position: relative;
    }
    
    .input-field label::after {
      content: '*';
      color: #e53e3e;
      margin-left: 0.25rem;
    }
    
    .input-field input, .input-field select {
      width: 100%;
      padding: 1.25rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      color: #2d3748;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 500;
    }
    
    .input-field input:focus, .input-field select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 8px 16px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
    
    .input-field input::placeholder {
      color: #a0aec0;
      opacity: 0.7;
      font-weight: 400;
    }
    
    .modal-footer {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 2.5rem 2rem;
      position: relative;
    }
    
    .modal-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
    }
    
    .price-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      border: none;
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      position: relative;
      overflow: hidden;
    }
    
    .price-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #48bb78, #38a169);
    }
    
    .price-card h4 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .price-card h4::before {
      content: '💰';
      font-size: 1.2rem;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 1rem;
      font-weight: 500;
    }
    
    .price-row:last-of-type {
      border-bottom: none;
    }
    
    .price-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0 0 0;
      border-top: 3px solid #667eea;
      margin-top: 1.5rem;
      font-weight: 800;
      font-size: 1.3rem;
      color: #2d3748;
      position: relative;
    }
    
    .price-total::before {
      content: '';
      position: absolute;
      top: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      animation: priceHighlight 2s ease-in-out infinite;
    }
    
    .action-buttons {
      display: flex;
      gap: 1.5rem;
    }
    
    .cancel-btn, .confirm-btn {
      flex: 1;
      padding: 1.25rem 2rem;
      border-radius: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      font-size: 1.1rem;
      position: relative;
      overflow: hidden;
    }
    
    .cancel-btn {
      background: white;
      border: 2px solid #e2e8f0;
      color: #4a5568;
    }
    
    .cancel-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(226, 232, 240, 0.5), transparent);
      transition: left 0.5s ease;
    }
    
    .cancel-btn:hover {
      border-color: #cbd5e0;
      color: #2d3748;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }
    
    .cancel-btn:hover::before {
      left: 100%;
    }
    
    .confirm-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      position: relative;
    }
    
    .confirm-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .confirm-btn:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 16px 40px rgba(102, 126, 234, 0.5);
    }
    
    .confirm-btn:hover::before {
      left: 100%;
    }
    
    .btn-icon {
      width: 22px;
      height: 22px;
      stroke-width: 2.5;
    }
    
    .price-tag {
      background: rgba(255,255,255,0.25);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 800;
      margin-left: 0.75rem;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }
    
    .flight-route-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 1.5rem;
      background: var(--modal-bg);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border: 1px solid var(--border-color);
    }
    
    .route-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
    
    .route-code {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    
    .route-city {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0.25rem 0;
    }
    
    .route-time {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .route-arrow {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin: 0 1rem;
    }
    
    .airline-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .booking-section {
      padding: 2rem;
      border-bottom: 1px solid var(--border-color);
      background: var(--modal-bg);
    }
    
    .section-header {
      margin-bottom: 1.5rem;
    }
    
    .section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .section-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
      font-weight: 500;
    }
    
    .flight-details h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }
    
    .flight-details p {
      color: #666;
      margin: 0 0 1rem 0;
    }
    
    .price-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 2px solid var(--primary-color);
    }
    
    .price-label {
      font-weight: 600;
      color: var(--text-secondary);
    }
    
    .price-amount {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .passenger-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .input-group {
      display: flex;
      flex-direction: column;
    }
    
    .input-group.full-width {
      grid-column: 1 / -1;
    }
    
    .input-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .form-input, .form-select {
      padding: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: var(--card-bg);
      color: var(--text-primary);
    }
    
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }
    
    .form-input::placeholder {
      color: #a0aec0;
    }
    
    .booking-footer {
      background: var(--card-bg);
      padding: 2rem;
      border-top: 1px solid var(--border-color);
    }
    
    .price-summary {
      margin-bottom: 2rem;
    }
    
    .price-breakdown {
      background: var(--modal-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      border: 1px solid var(--border-color);
    }
    
    .price-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .price-item:last-child {
      border-bottom: none;
    }
    
    .price-item.taxes {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .price-label {
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    .price-value {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .price-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0 0 0;
      border-top: 2px solid var(--primary-color);
      margin-top: 1rem;
    }
    
    .total-label {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .total-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary-color);
    }
    
    .action-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .btn-cancel {
      flex: 1;
      padding: 1rem 1.5rem;
      border: 2px solid var(--border-color);
      background: var(--card-bg);
      color: var(--text-secondary);
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-cancel:hover {
      border-color: var(--primary-color);
      background: var(--modal-bg);
    }
    
    .btn-confirm {
      flex: 2;
      padding: 1.2rem 2rem;
      border: none;
      background: var(--primary-color);
      color: white;
      border-radius: 12px;
      font-weight: 800;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .btn-confirm:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
    }
    
    .btn-text {
      font-size: 1.1rem;
      font-weight: 800;
    }
    
    .btn-price {
      background: rgba(255,255,255,0.25);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 700;
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    @keyframes modalAppear {
      from {
        opacity: 0;
        transform: translateY(60px) scale(0.8) rotateX(10deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
      }
    }
    
    @keyframes floatSlow {
      from { transform: translateX(-150px); }
      to { transform: translateX(calc(100vw + 150px)); }
    }
    
    @keyframes floatReverse {
      from { transform: translateX(calc(100vw + 150px)); }
      to { transform: translateX(-150px); }
    }
    
    @keyframes gentleWave {
      0%, 100% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(10px) translateY(-5px); }
      50% { transform: translateX(0) translateY(-10px); }
      75% { transform: translateX(-10px) translateY(-5px); }
    }
    
    @keyframes smoothFly {
      0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
      25% { transform: translateX(8px) translateY(-4px) rotate(2deg); }
      50% { transform: translateX(0) translateY(-8px) rotate(0deg); }
      75% { transform: translateX(-8px) translateY(-4px) rotate(-2deg); }
    }
    
    @keyframes drawRoute {
      to {
        stroke-dashoffset: 0;
      }
    }
    
    @keyframes checkPulse {
      0% { transform: scale(0) rotate(0deg); }
      50% { transform: scale(1.2) rotate(180deg); }
      100% { transform: scale(1) rotate(360deg); }
    }
    
    @keyframes priceHighlight {
      0%, 100% { width: 60px; opacity: 1; }
      50% { width: 120px; opacity: 0.7; }
    }
    
    /* Modern Geometric Background */
    .geometric-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }
    
    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }
    
    .shape-1 {
      width: 120px;
      height: 120px;
      top: 20%;
      left: 10%;
      animation: morphFloat 20s ease-in-out infinite;
    }
    
    .shape-2 {
      width: 80px;
      height: 80px;
      top: 60%;
      right: 15%;
      animation: morphFloat 25s ease-in-out infinite reverse;
    }
    
    .shape-3 {
      width: 150px;
      height: 150px;
      top: 40%;
      left: 70%;
      animation: morphFloat 30s ease-in-out infinite;
      border-radius: 30%;
    }
    
    .shape-4 {
      width: 60px;
      height: 60px;
      top: 15%;
      right: 30%;
      animation: morphFloat 18s ease-in-out infinite;
      border-radius: 20%;
    }
    
    .shape-5 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 40%;
      animation: morphFloat 22s ease-in-out infinite reverse;
    }
    
    .gradient-orbs {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.3;
    }
    
    .orb-1 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(102,126,234,0.4) 0%, transparent 70%);
      top: 10%;
      left: 20%;
      animation: orbFloat 25s ease-in-out infinite;
    }
    
    .orb-2 {
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(118,75,162,0.4) 0%, transparent 70%);
      bottom: 20%;
      right: 25%;
      animation: orbFloat 30s ease-in-out infinite reverse;
    }
    
    .orb-3 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%);
      top: 50%;
      left: 60%;
      animation: orbFloat 35s ease-in-out infinite;
    }
    
    .mesh-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120,119,198,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,119,198,0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120,219,226,0.1) 0%, transparent 50%);
      animation: meshShift 40s ease-in-out infinite;
    }
    
    /* Modern Title Animation */
    .main-title {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
    
    .title-word {
      display: inline-block;
      opacity: 0;
      transform: translateY(50px) rotateX(90deg);
      animation: titleReveal 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    .title-word:nth-child(1) { animation-delay: 0.1s; }
    .title-word:nth-child(2) { animation-delay: 0.3s; }
    .title-word:nth-child(3) { animation-delay: 0.5s; }
    .title-word:nth-child(4) { animation-delay: 0.7s; }
    
    /* Live Flight Counter */
    .live-stats {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      animation: slideInUp 1s ease-out 0.9s both;
    }
    
    .live-counter {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255,255,255,0.2);
      position: relative;
      overflow: hidden;
    }
    
    .live-counter::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      animation: shimmer 3s infinite;
    }
    
    .counter-icon {
      font-size: 2rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .counter-content {
      text-align: center;
      color: white;
    }
    
    .counter-number {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
      background: linear-gradient(135deg, #ffffff, #e2e8f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .counter-loading {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.25rem;
    }
    
    .loading-dots {
      display: flex;
      gap: 4px;
    }
    
    .loading-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: white;
      animation: loadingDots 1.4s infinite ease-in-out;
    }
    
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    .counter-label {
      font-size: 0.9rem;
      opacity: 0.9;
      font-weight: 500;
    }
    
    .pulse-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 12px;
      height: 12px;
      background: #48bb78;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    .pulse-indicator::before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 2px solid #48bb78;
      border-radius: 50%;
      animation: pulseRing 2s infinite;
    }
    
    /* Enhanced Card Animations */
    .premium-flight-card {
      position: relative;
      overflow: hidden;
    }
    
    .premium-flight-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.6s ease;
    }
    
    .premium-flight-card:hover::after {
      left: 100%;
    }
    
    .book-flight-btn {
      position: relative;
      overflow: hidden;
      z-index: 10;
    }
    
    .book-flight-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.6s ease;
    }
    
    .book-flight-btn:hover::before {
      width: 300px;
      height: 300px;
    }
    
    /* Modern Animation Keyframes */
    @keyframes morphFloat {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg) scale(1);
        border-radius: 50%;
      }
      25% { 
        transform: translateY(-20px) rotate(90deg) scale(1.1);
        border-radius: 30%;
      }
      50% { 
        transform: translateY(-10px) rotate(180deg) scale(0.9);
        border-radius: 60%;
      }
      75% { 
        transform: translateY(-30px) rotate(270deg) scale(1.05);
        border-radius: 40%;
      }
    }
    
    @keyframes orbFloat {
      0%, 100% { 
        transform: translate(0px, 0px) scale(1);
        opacity: 0.3;
      }
      33% { 
        transform: translate(30px, -20px) scale(1.1);
        opacity: 0.5;
      }
      66% { 
        transform: translate(-20px, 10px) scale(0.9);
        opacity: 0.4;
      }
    }
    
    @keyframes meshShift {
      0%, 100% { 
        background-position: 0% 0%, 100% 100%, 50% 50%;
      }
      50% { 
        background-position: 100% 100%, 0% 0%, 80% 20%;
      }
    }
    
    @keyframes backgroundShift {
      0%, 100% {
        background-position: 0% 0%, 100% 100%, 50% 50%;
        opacity: 1;
      }
      33% {
        background-position: 30% 70%, 70% 30%, 80% 20%;
        opacity: 0.8;
      }
      66% {
        background-position: 70% 30%, 30% 70%, 20% 80%;
        opacity: 0.9;
      }
    }
    
    /* Advanced Content Background Effects */
    .content-background-effects {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: -1;
      overflow: hidden;
    }
    
    .floating-particles {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .animated-svg-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.8;
    }
    
    .particle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.4), rgba(118, 75, 162, 0.4));
      backdrop-filter: blur(4px);
      animation: particleFloat 15s ease-in-out infinite;
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
    }
    
    .particle-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 5%;
      animation-delay: 0s;
      animation-duration: 20s;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6));
      box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    }
    
    .particle-2 {
      width: 60px;
      height: 60px;
      top: 30%;
      right: 10%;
      animation-delay: 3s;
      animation-duration: 25s;
      background: linear-gradient(135deg, rgba(255, 107, 107, 0.5), rgba(254, 202, 87, 0.5));
      box-shadow: 0 0 25px rgba(255, 107, 107, 0.4);
    }
    
    .particle-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 15%;
      animation-delay: 6s;
      animation-duration: 18s;
      background: linear-gradient(135deg, rgba(72, 187, 120, 0.5), rgba(56, 161, 105, 0.5));
      box-shadow: 0 0 35px rgba(72, 187, 120, 0.4);
    }
    
    .particle-4 {
      width: 50px;
      height: 50px;
      top: 60%;
      right: 25%;
      animation-delay: 9s;
      animation-duration: 22s;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5));
      box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
    }
    
    .particle-5 {
      width: 70px;
      height: 70px;
      top: 15%;
      left: 60%;
      animation-delay: 12s;
      animation-duration: 28s;
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.6), rgba(162, 155, 254, 0.6));
      box-shadow: 0 0 28px rgba(108, 92, 231, 0.5);
    }
    
    .particle-6 {
      width: 65px;
      height: 65px;
      bottom: 40%;
      right: 5%;
      animation-delay: 15s;
      animation-duration: 24s;
      background: linear-gradient(135deg, rgba(255, 154, 158, 0.5), rgba(250, 208, 196, 0.5));
      box-shadow: 0 0 25px rgba(255, 154, 158, 0.4);
    }
    
    .geometric-patterns {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .pattern {
      position: absolute;
      opacity: 0.05;
      animation: patternRotate 30s linear infinite;
    }
    
    .pattern-triangle {
      top: 20%;
      left: 20%;
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 87px solid var(--primary-color);
      animation-delay: 0s;
    }
    
    .pattern-circle {
      top: 50%;
      right: 20%;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--secondary-color);
      animation-delay: 10s;
    }
    
    .pattern-square {
      bottom: 30%;
      left: 40%;
      width: 80px;
      height: 80px;
      background: var(--accent-color);
      transform: rotate(45deg);
      animation-delay: 20s;
    }
    
    .light-rays {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .ray {
      position: absolute;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: rayMove 12s ease-in-out infinite;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    }
    
    .ray-1 {
      top: 10%;
      left: -100%;
      width: 200%;
      height: 2px;
      animation-delay: 0s;
      transform: rotate(15deg);
    }
    
    .ray-2 {
      top: 60%;
      left: -100%;
      width: 200%;
      height: 1px;
      animation-delay: 4s;
      transform: rotate(-10deg);
    }
    
    .ray-3 {
      top: 35%;
      left: -100%;
      width: 200%;
      height: 1.5px;
      animation-delay: 8s;
      transform: rotate(5deg);
    }
    
    /* Enhanced Flight Cards with Glassmorphism */
    .premium-flight-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .premium-flight-card:hover {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(25px);
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    /* Enhanced Booking Cards */
    .booking-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .booking-card:hover {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
    }
    
    /* Particle Animation Keyframes */
    @keyframes particleFloat {
      0%, 100% {
        transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
        opacity: 0.6;
      }
      25% {
        transform: translateY(-40px) translateX(30px) rotate(90deg) scale(1.2);
        opacity: 0.9;
      }
      50% {
        transform: translateY(-20px) translateX(-25px) rotate(180deg) scale(0.8);
        opacity: 0.7;
      }
      75% {
        transform: translateY(-50px) translateX(35px) rotate(270deg) scale(1.1);
        opacity: 0.8;
      }
    }
    
    @keyframes patternRotate {
      0% {
        transform: rotate(0deg) scale(1);
        opacity: 0.05;
      }
      50% {
        transform: rotate(180deg) scale(1.2);
        opacity: 0.08;
      }
      100% {
        transform: rotate(360deg) scale(1);
        opacity: 0.05;
      }
    }
    
    @keyframes rayMove {
      0% {
        left: -100%;
        opacity: 0;
      }
      10% {
        opacity: 0.3;
      }
      90% {
        opacity: 0.3;
      }
      100% {
        left: 100%;
        opacity: 0;
      }
    }
    

    
    /* Animated Footer */
    .animated-footer {
      position: relative;
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
      color: white;
      overflow: hidden;
      margin-top: 4rem;
    }
    
    .wave-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 120px;
      overflow: hidden;
    }
    
    .wave-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 120px;
    }
    
    .wave-path {
      opacity: 0.6;
    }
    
    .wave-1 {
      fill: var(--primary-color);
      animation: waveMove1 8s ease-in-out infinite;
    }
    
    .wave-2 {
      fill: var(--secondary-color);
      animation: waveMove2 10s ease-in-out infinite reverse;
    }
    
    .wave-3 {
      fill: rgba(102, 126, 234, 0.3);
      animation: waveMove3 12s ease-in-out infinite;
    }
    
    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .float-element {
      position: absolute;
      opacity: 0.7;
    }
    
    .plane-element {
      top: 20%;
      left: 10%;
      width: 60px;
      height: 20px;
      animation: floatPlane 15s linear infinite;
    }
    
    .cloud-element {
      top: 30%;
      right: 15%;
      width: 80px;
      height: 30px;
      animation: floatCloud 20s ease-in-out infinite;
    }
    
    .star-element {
      top: 15%;
      right: 30%;
      width: 20px;
      height: 20px;
      animation: twinkleStar 3s ease-in-out infinite;
    }
    
    .footer-content {
      position: relative;
      z-index: 10;
      padding: 8rem 2rem 2rem;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .footer-section {
      animation: fadeInUp 1s ease-out both;
    }
    
    .footer-section:nth-child(1) { animation-delay: 0.1s; }
    .footer-section:nth-child(2) { animation-delay: 0.2s; }
    .footer-section:nth-child(3) { animation-delay: 0.3s; }
    .footer-section:nth-child(4) { animation-delay: 0.4s; }
    
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .logo-icon {
      font-size: 2.5rem;
      animation: float 4s ease-in-out infinite;
    }
    
    .logo-text {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #ffffff, #e2e8f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .company-desc {
      color: #cbd5e0;
      line-height: 1.6;
      margin-bottom: 2rem;
      font-size: 1rem;
    }
    
    .social-links {
      display: flex;
      gap: 1rem;
    }
    
    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      color: white;
      text-decoration: none;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .social-link:hover {
      background: var(--primary-color);
      transform: translateY(-3px) scale(1.1);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
    
    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: white;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
    }
    
    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-links li {
      margin-bottom: 0.75rem;
    }
    
    .footer-links a {
      color: #cbd5e0;
      text-decoration: none;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      border-radius: 6px;
    }
    
    .footer-links a:hover {
      color: white;
      transform: translateX(8px);
      background: rgba(255,255,255,0.05);
      padding-left: 1rem;
    }
    
    .newsletter-desc {
      color: #cbd5e0;
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
    }
    
    .newsletter-form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .newsletter-input {
      flex: 1;
      padding: 1rem;
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .newsletter-input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
    
    .newsletter-input::placeholder {
      color: #a0aec0;
    }
    
    .newsletter-btn {
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    
    .newsletter-btn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #cbd5e0;
      font-size: 0.9rem;
    }
    
    .contact-icon {
      font-size: 1.1rem;
    }
    
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 2rem 0;
      margin-top: 3rem;
    }
    
    .footer-bottom-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .copyright {
      color: #a0aec0;
      font-size: 0.9rem;
    }
    
    .footer-bottom-links {
      display: flex;
      gap: 2rem;
    }
    
    .footer-bottom-links a {
      color: #cbd5e0;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
    }
    
    .footer-bottom-links a:hover {
      color: white;
    }
    
    /* Footer Animations */
    @keyframes waveMove1 {
      0%, 100% { d: path('M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z'); }
      50% { d: path('M0,40 C300,100 900,20 1200,80 L1200,120 L0,120 Z'); }
    }
    
    @keyframes waveMove2 {
      0%, 100% { d: path('M0,80 C300,20 900,100 1200,40 L1200,120 L0,120 Z'); }
      50% { d: path('M0,100 C300,40 900,80 1200,60 L1200,120 L0,120 Z'); }
    }
    
    @keyframes waveMove3 {
      0%, 100% { d: path('M0,100 C300,40 900,80 1200,20 L1200,120 L0,120 Z'); }
      50% { d: path('M0,80 C300,60 900,60 1200,40 L1200,120 L0,120 Z'); }
    }
    
    @keyframes floatPlane {
      0% { transform: translateX(-100px) translateY(0px); }
      100% { transform: translateX(calc(100vw + 100px)) translateY(-20px); }
    }
    
    @keyframes floatCloud {
      0%, 100% { transform: translateX(0) translateY(0); }
      50% { transform: translateX(-30px) translateY(-15px); }
    }
    
    @keyframes twinkleStar {
      0%, 100% { opacity: 0.7; transform: scale(1) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes loadingDots {
      0%, 80%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.1);
      }
    }
    
    @keyframes pulseRing {
      0% {
        opacity: 1;
        transform: scale(0.8);
      }
      100% {
        opacity: 0;
        transform: scale(1.4);
      }
    }
    
    @keyframes titleReveal {
      from {
        opacity: 0;
        transform: translateY(50px) rotateX(90deg);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
      }
    }
    
    /* Premium Airlines Showcase */
    .airlines-showcase {
      margin: 4rem 0;
      position: relative;
    }
    
    .showcase-header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
    }
    
    .header-content {
      position: relative;
      z-index: 2;
    }
    
    .header-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }
    
    .showcase-title {
      font-size: 3rem;
      font-weight: 900;
      color: var(--text-primary);
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }
    
    .showcase-subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .airlines-container {
      position: relative;
      overflow: hidden;
      margin: 0 auto;
      padding: 2rem 0;
    }
    
    .airlines-slider {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(102,126,234,0.05), rgba(118,75,162,0.05));
      backdrop-filter: blur(10px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    
    .speed-indicator {
      position: absolute;
      top: 10px;
      right: 20px;
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .speed-line {
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      border-radius: 1px;
      animation: speedPulse 1s ease-in-out infinite;
    }
    
    .speed-dots {
      display: flex;
      gap: 3px;
    }
    
    .speed-dot {
      width: 4px;
      height: 4px;
      background: var(--primary-color);
      border-radius: 50%;
      animation: dotPulse 0.8s ease-in-out infinite;
    }
    
    .speed-dot:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .speed-dot:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    .pulse-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border: 2px solid rgba(102,126,234,0.3);
      border-radius: 16px;
      transform: translate(-50%, -50%);
      opacity: 0;
      pointer-events: none;
    }
    
    .airline-card:hover .pulse-ring {
      animation: pulseRing 1s ease-out;
    }
    
    .logo-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: logoShine 2s ease-in-out infinite;
    }
    
    @keyframes speedPulse {
      0%, 100% {
        opacity: 0.5;
        transform: scaleX(1);
      }
      50% {
        opacity: 1;
        transform: scaleX(1.2);
      }
    }
    
    @keyframes dotPulse {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.3);
      }
    }
    
    @keyframes logoShine {
      0% {
        left: -100%;
      }
      100% {
        left: 100%;
      }
    }
    
    /* Loading Animation Keyframes */
    @keyframes loaderDropDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-30px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }
    
    @keyframes loaderBounceIn {
      from {
        opacity: 0;
        transform: translateY(-30px) scale(0.8);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes flyAcross {
      0% {
        left: 0;
        transform: translateX(-50%) rotate(0deg);
      }
      50% {
        transform: translateX(-50%) rotate(10deg) scale(1.2);
      }
      100% {
        left: 100%;
        transform: translateX(-50%) rotate(0deg);
      }
    }
    
    @keyframes progressFill {
      from {
        width: 0%;
      }
      to {
        width: 100%;
      }
    }
    
    @keyframes stepPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
    }
    
    @keyframes shimmerEffect {
      0% {
        transform: translateX(-100%) skewX(-15deg);
      }
      100% {
        transform: translateX(200%) skewX(-15deg);
      }
    }
    
    .airlines-track {
      display: flex;
      animation: slideLeft 6s linear infinite;
      gap: 1rem;
      padding: 1rem;
    }
    
    .airlines-track:hover {
      animation-play-state: paused;
      transform: scale(1.02);
    }
    
    .airline-card {
      min-width: 200px;
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
      border-radius: 16px;
      padding: 1rem;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      flex-shrink: 0;
      animation: cardFloat 4s ease-in-out infinite;
    }
    
    .airline-card:nth-child(odd) {
      animation-delay: -2s;
    }
    
    .airline-card:hover {
      transform: translateY(-15px) rotateY(5deg) scale(1.05);
      box-shadow: 0 20px 40px rgba(102,126,234,0.2);
      z-index: 10;
    }
    
    .airline-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    
    .airline-card:hover {
      transform: translateY(-12px) scale(1.02);
      box-shadow: 0 25px 60px rgba(102,126,234,0.15);
    }
    
    .airline-card:hover::before {
      transform: scaleX(1);
    }
    
    .card-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102,126,234,0.3), transparent);
      animation: autoGlow 3s ease-in-out infinite;
      pointer-events: none;
    }
    
    .airline-card:hover .card-glow {
      animation: fastGlow 0.8s ease-out;
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .airline-logo {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
      position: relative;
      overflow: hidden;
      animation: logoSpin 8s linear infinite;
    }
    
    .airline-card:hover .airline-logo {
      animation: logoSpinFast 1s ease-in-out;
      transform: scale(1.1);
    }
    
    .airline-logo::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba(255,255,255,0.1), transparent);
    }
    
    .logo-icon {
      font-size: 1.5rem;
      color: white;
      z-index: 2;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }
    
    .rating-badge {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #2d3748;
      padding: 0.4rem 0.8rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 800;
      box-shadow: 0 3px 12px rgba(255,215,0,0.3);
    }
    
    .rating-star {
      font-size: 1rem;
    }
    
    .rating-value {
      font-size: 0.9rem;
    }
    
    .card-body {
      margin-bottom: 1.5rem;
    }
    
    .airline-name {
      font-size: 1.1rem;
      font-weight: 900;
      color: var(--text-primary);
      margin-bottom: 0.3rem;
      letter-spacing: -0.5px;
    }
    
    .airline-type {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1.2rem;
      opacity: 0.8;
    }
    
    .airline-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.8rem;
      margin-bottom: 1.2rem;
    }
    
    .metric {
      text-align: center;
      padding: 0.8rem 0.4rem;
      background: rgba(102,126,234,0.05);
      border-radius: 12px;
      border: 1px solid rgba(102,126,234,0.1);
    }
    
    .metric-value {
      display: block;
      font-size: 0.9rem;
      font-weight: 900;
      color: var(--primary-color);
      margin-bottom: 0.1rem;
    }
    
    .metric-label {
      font-size: 0.7rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .airline-features {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    
    .feature-tag {
      background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
      color: var(--primary-color);
      padding: 0.4rem 0.8rem;
      border-radius: 16px;
      font-size: 0.7rem;
      font-weight: 700;
      border: 1px solid rgba(102,126,234,0.2);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .card-footer {
      margin-top: auto;
    }
    
    .explore-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border: none;
      padding: 0.8rem 1.2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
      position: relative;
      overflow: hidden;
    }
    
    .explore-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .explore-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(102,126,234,0.4);
    }
    
    .explore-btn:hover::before {
      left: 100%;
    }
    
    .btn-arrow {
      font-size: 1.2rem;
      transition: transform 0.3s ease;
    }
    
    .explore-btn:hover .btn-arrow {
      transform: translateX(4px);
    }
    
    .card-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(102,126,234,0.2), transparent);
      animation: cardGlow 3s ease-in-out infinite;
    }
    
    .airline-icon {
      font-size: 3rem;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
      animation: iconPulse 2s ease-in-out infinite;
    }
    
    .airline-details {
      flex: 1;
    }
    
    .airline-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    
    .airline-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }
    
    .meta-item {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .airline-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .badge-national-carrier { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
    .badge-low-cost { background: linear-gradient(135deg, #48bb78, #38a169); color: white; }
    .badge-premium { background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; }
    .badge-full-service { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; }
    .badge-feature { background: rgba(102,126,234,0.1); color: var(--primary-color); }
    
    .airline-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .stat-circle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }
    
    .stat-value {
      font-size: 1rem;
      font-weight: 800;
      line-height: 1;
    }
    
    .stat-label {
      font-size: 0.6rem;
      opacity: 0.9;
      text-transform: uppercase;
    }
    
    @keyframes slideLeft {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    
    @keyframes cardFloat {
      0%, 100% {
        transform: translateY(0px) rotateZ(0deg);
      }
      50% {
        transform: translateY(-8px) rotateZ(1deg);
      }
    }
    
    @keyframes autoGlow {
      0%, 100% {
        left: -100%;
        opacity: 0.3;
      }
      50% {
        left: 100%;
        opacity: 0.8;
      }
    }
    
    @keyframes fastGlow {
      0% {
        left: -100%;
        opacity: 0.5;
      }
      100% {
        left: 100%;
        opacity: 1;
      }
    }
    
    @keyframes logoSpin {
      0% {
        transform: rotateY(0deg);
      }
      100% {
        transform: rotateY(360deg);
      }
    }
    
    @keyframes logoSpinFast {
      0% {
        transform: rotateY(0deg) scale(1);
      }
      50% {
        transform: rotateY(180deg) scale(1.2);
      }
      100% {
        transform: rotateY(360deg) scale(1.1);
      }
    }
    
    @keyframes pulseRing {
      0% {
        transform: scale(0.8);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    /* Premium Flight Slider */
    .flight-slider {
      margin: 0.25rem 0;
      animation: slideInUp 1s ease-out;
    }
    
    .slider-container {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      height: 450px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      background: var(--bg-gradient);
    }
    
    .slider-track {
      display: flex;
      width: 400%;
      height: 100%;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .slide-panel {
      width: 25%;
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    
    .slide-image {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .slide-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(1.1) contrast(1.1) saturate(1.2);
      transition: all 0.6s ease;
    }
    
    .slide-panel:hover .slide-image img {
      transform: scale(1.05);
      filter: brightness(1.2) contrast(1.2) saturate(1.3);
    }
    
    .slide-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(0,0,0,0.4) 0%, 
        rgba(102,126,234,0.3) 50%, 
        rgba(118,75,162,0.3) 100%);
      z-index: 2;
    }
    
    .slide-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: white;
      z-index: 3;
      max-width: 80%;
      padding: 2rem;
    }
    
    .slide-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .slide-title {
      font-size: 2.8rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0,0,0,0.5);
      line-height: 1.1;
    }
    
    .slide-desc {
      font-size: 1.1rem;
      color: rgba(255,255,255,0.9);
      line-height: 1.6;
      margin-bottom: 2rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .slide-stats {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    
    .stat-item {
      background: rgba(255,255,255,0.15);
      padding: 0.75rem 1.25rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .stat-item:hover {
      background: rgba(255,255,255,0.25);
      transform: translateY(-2px);
    }
    
    .slider-dots {
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 10;
    }
    
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      background: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .dot.active {
      background: white;
      transform: scale(1.3);
      box-shadow: 0 0 15px rgba(255,255,255,0.8);
    }
    
    .slider-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      font-size: 24px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      z-index: 10;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .slider-arrow:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-50%) scale(1.1);
    }
    
    .slider-arrow.prev {
      left: 20px;
    }
    
    .slider-arrow.next {
      right: 20px;
    }
    
    @media (max-width: 768px) {
      .slider-container {
        height: 380px;
        border-radius: 16px;
      }
      
      .slide-content {
        max-width: 90%;
        padding: 1.5rem;
      }
      
      .slide-title {
        font-size: 2.2rem;
      }
      
      .slide-desc {
        font-size: 1rem;
      }
      
      .slide-stats {
        gap: 1rem;
      }
      
      .stat-item {
        font-size: 0.8rem;
        padding: 0.6rem 1rem;
      }
      
      .slider-arrow {
        width: 45px;
        height: 45px;
        font-size: 20px;
      }
      
      .slider-arrow.prev {
        left: 15px;
      }
      
      .slider-arrow.next {
        right: 15px;
      }
      
      .showcase-title {
        font-size: 2.2rem;
      }
      
      .airlines-track {
        gap: 1rem;
        padding: 1rem;
      }
      
      .airline-card {
        min-width: 180px;
        padding: 0.8rem;
      }
      
      .airline-logo {
        width: 50px;
        height: 50px;
      }
      
      .logo-icon {
        font-size: 1.6rem;
      }
      
      .airline-name {
        font-size: 1.2rem;
      }
      
      .airline-metrics {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
      }
      
      .metric {
        padding: 0.75rem 0.5rem;
      }
      
      .metric-value {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .food-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .class-grid {
        grid-template-columns: 1fr;
      }
      
      .innovative-booking-modal {
        width: 95%;
        margin: 0.5rem;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .route-visualization {
        flex-direction: column;
        gap: 1rem;
      }
      
      .flight-path {
        margin: 0;
        order: 2;
      }
      
      .slide-content {
        grid-template-columns: 1fr;
      }
      
      .slide-text {
        padding: 2rem;
      }
      
      .slide-title {
        font-size: 2rem;
      }
    }
    
    /* Enhanced Payment Modal */
    .payment-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(20px);
      padding: 2rem;
    }
    
    .payment-modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.3);
      overflow: hidden;
      animation: modalAppear 0.5s ease-out;
    }
    
    .payment-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 2rem;
      color: white;
      text-align: center;
    }
    
    .payment-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
    }
    
    .payment-subtitle {
      opacity: 0.9;
      margin: 0;
    }
    
    .payment-content {
      padding: 2rem;
    }
    
    .payment-summary {
      background: #f8fafc;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      border-left: 4px solid var(--primary-color);
    }
    
    .payment-summary h4 {
      margin: 0 0 1rem 0;
      color: #2d3748;
      font-weight: 700;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .amount {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--primary-color);
    }
    
    .payment-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .payment-method {
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }
    
    .payment-method:hover {
      border-color: var(--primary-color);
      transform: translateY(-2px);
    }
    
    .payment-method.selected {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.1);
    }
    
    .payment-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .method-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #4a5568;
    }
    
    .payment-actions {
      display: flex;
      gap: 1rem;
    }
    
    .payment-btn {
      flex: 1;
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
    }
    
    .pay-now-btn {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
    }
    
    .pay-now-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
    }
    
    .cancel-payment-btn {
      background: #e2e8f0;
      color: #4a5568;
    }
    
    .cancel-payment-btn:hover {
      background: #cbd5e0;
    }
    
    /* Section Content Styles */
    .section-content {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .section-header-main {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem 0;
    }
    
    .section-main-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--text-primary);
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .section-main-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      opacity: 0.8;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Enhanced Search Widget */
    .enhanced-search-widget {
      max-width: 900px;
      margin: 0 auto 3rem;
      background: rgba(255,255,255,0.95);
      padding: 2rem;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    /* Empty State Styles */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255,255,255,0.9);
      border-radius: 20px;
      margin: 2rem auto;
      max-width: 500px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.7;
    }
    
    .empty-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }
    
    .empty-description {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1rem;
    }
    
    .empty-action-btn {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }
    
    .empty-action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }
    
    /* Payments Section */
    .payments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .payment-card {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      animation: slideInUp 0.6s ease-out both;
      border-left: 4px solid var(--primary-color);
    }
    
    .payment-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }
    
    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .payment-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .payment-status.confirmed {
      background: #f0fff4;
      color: #38a169;
    }
    
    .payment-status.pending {
      background: #fef5e7;
      color: #d69e2e;
    }
    
    .payment-amount {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary-color);
    }
    
    .payment-details {
      margin: 1rem 0;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .detail-label {
      color: var(--text-secondary);
      font-weight: 500;
    }
    
    .detail-value {
      color: var(--text-primary);
      font-weight: 600;
    }
    
    .pay-now-btn {
      width: 100%;
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .pay-now-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(72, 187, 120, 0.3);
    }
    
    /* Enhanced Profile Section */
    .profile-container {
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .profile-message {
      background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(56, 161, 105, 0.1));
      border: 1px solid rgba(72, 187, 120, 0.2);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #2d3748;
      font-weight: 500;
      animation: slideInUp 0.3s ease-out;
    }
    
    .profile-message.error {
      background: linear-gradient(135deg, rgba(229, 62, 62, 0.1), rgba(197, 48, 48, 0.1));
      border-color: rgba(229, 62, 62, 0.2);
    }
    
    .profile-header-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
      border-radius: 24px;
      padding: 2.5rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .profile-header-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    }
    
    .profile-avatar-container {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 35px rgba(102,126,234,0.3);
      border: 4px solid white;
      position: relative;
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }
    
    .avatar-text {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .avatar-upload {
      position: absolute;
      bottom: -5px;
      right: -5px;
    }
    
    .upload-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      border: 3px solid white;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }
    
    .upload-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(102,126,234,0.4);
    }
    
    .membership-badge {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: #ffd700;
      color: #2d3748;
      padding: 0.3rem 0.8rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(255,215,0,0.3);
    }
    
    .profile-info-section {
      flex: 1;
    }
    
    .profile-name {
      font-size: 2.2rem;
      font-weight: 900;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .profile-email, .profile-phone, .profile-location, .profile-member-since {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .profile-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%);
      border-radius: 20px;
      padding: 2rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(102,126,234,0.15);
    }
    
    .stat-card:hover::before {
      transform: scaleY(1);
    }
    
    .stat-icon {
      font-size: 3rem;
      opacity: 0.8;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-number {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--primary-color);
      margin-bottom: 0.25rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .profile-actions {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.2rem 2rem;
      border-radius: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: none;
      font-size: 1rem;
      position: relative;
      overflow: hidden;
    }
    
    .profile-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    
    .profile-btn:hover::before {
      left: 100%;
    }
    
    .profile-btn.primary {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      box-shadow: 0 6px 20px rgba(102,126,234,0.3);
    }
    
    .profile-btn.primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(102,126,234,0.4);
    }
    
    .profile-btn.secondary {
      background: white;
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    
    .profile-btn.secondary:hover {
      border-color: var(--primary-color);
      background: rgba(102,126,234,0.05);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px rgba(102,126,234,0.15);
    }
    
    .profile-btn.danger {
      background: linear-gradient(135deg, #e53e3e, #c53030);
      color: white;
      box-shadow: 0 6px 20px rgba(229,62,62,0.3);
    }
    
    .profile-btn.danger:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 35px rgba(229,62,62,0.4);
    }
    
    .profile-loading {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }
    
    .profile-loading .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(102,126,234,0.2);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    /* Profile Modals */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(8px);
      animation: fadeIn 0.3s ease-out;
    }
    
    .profile-modal {
      background: white;
      border-radius: 24px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0,0,0,0.3);
      animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .danger-modal {
      border: 2px solid #e53e3e;
    }
    
    .modal-header {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 24px 24px 0 0;
    }
    
    .danger-modal .modal-header {
      background: linear-gradient(135deg, #e53e3e, #c53030);
    }
    
    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .close-btn:hover {
      background: rgba(255,255,255,0.2);
      transform: scale(1.1);
    }
    
    .modal-content {
      padding: 2rem;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
    }
    
    .form-group.full-width {
      grid-column: 1 / -1;
    }
    
    .form-group label {
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 1rem;
      border: 2px solid var(--border-color);
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
      transform: translateY(-1px);
    }
    
    .preferences-section {
      border-top: 1px solid var(--border-color);
      padding-top: 2rem;
    }
    
    .preferences-section h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
    }
    
    .preferences-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: 500;
    }
    
    .checkbox-label input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color);
    }
    
    .password-requirements {
      background: rgba(102,126,234,0.05);
      border: 1px solid rgba(102,126,234,0.2);
      border-radius: 8px;
      padding: 1rem;
      margin-top: 1rem;
    }
    
    .password-requirements p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    
    .warning-message {
      text-align: center;
      padding: 2rem;
    }
    
    .warning-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .warning-message h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: #e53e3e;
      margin-bottom: 1rem;
    }
    
    .warning-message p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
    
    .modal-footer {
      background: #f8fafc;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-radius: 0 0 24px 24px;
    }
    
    .btn-cancel,
    .btn-save,
    .btn-danger {
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-size: 0.9rem;
    }
    
    .btn-cancel {
      background: #e2e8f0;
      color: #4a5568;
    }
    
    .btn-cancel:hover {
      background: #cbd5e0;
      transform: translateY(-1px);
    }
    
    .btn-save {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }
    
    .btn-save:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }
    
    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #e53e3e, #c53030);
      color: white;
      box-shadow: 0 4px 15px rgba(229,62,62,0.3);
    }
    
    .btn-danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(229,62,62,0.4);
    }
    
    .btn-danger:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @media (max-width: 768px) {
      .section-main-title {
        font-size: 2rem;
      }
      
      .enhanced-search-widget {
        padding: 1.5rem;
      }
      
      .search-grid {
        grid-template-columns: 1fr;
      }
      
      .payments-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-stats-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-header-card {
        flex-direction: column;
        text-align: center;
        padding: 2rem;
      }
      
      .profile-actions {
        flex-direction: column;
      }
      
      .profile-btn {
        justify-content: center;
      }
      
      .profile-modal {
        width: 95%;
        margin: 1rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .preferences-grid {
        grid-template-columns: 1fr;
      }
      
      .modal-content {
        padding: 1.5rem;
      }
      
      .modal-header {
        padding: 1.5rem;
      }
      
      .modal-title {
        font-size: 1.3rem;
      }
      
      .theme-dropdown-nav {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
      }
      
      .theme-dropdown-content {
        min-width: 280px;
      }
      
      .theme-options-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .food-selection-grid {
        grid-template-columns: 1fr;
      }
      
      .booking-header {
        padding: 1.5rem;
      }
      
      .booking-title {
        font-size: 1.5rem;
      }
      
      .payment-methods {
        grid-template-columns: 1fr 1fr;
      }
      
      .nav-links {
        gap: 0.1rem;
        padding: 0.5rem;
      }
      
      .nav-link {
        padding: 0.5rem 0.4rem;
        min-width: 50px;
      }
      
      .nav-text {
        font-size: 0.65rem;
      }
      
      .nav-icon {
        font-size: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  flights: Flight[] = [];
  userBookings: Booking[] = [];
  
  // Profile related properties
  userProfile: UserProfile | null = null;
  profileStats: ProfileStats | null = null;
  showEditProfile = false;
  showChangePassword = false;
  showDeleteAccount = false;
  showSettingsModal = false;
  showUpgradeModal = false;
  showNotifications = false;
  unreadNotifications = 2;

  showSettings() {
    this.showSettingsModal = true;
  }

  showUpgrade() {
    this.showUpgradeModal = true;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  onThemeChange(theme: string) {
    console.log('Theme changed to:', theme);
  }
  editProfileForm: Partial<UserProfile> = {
    preferences: {
      seatPreference: '',
      mealPreference: '',
      newsletter: false,
      notifications: false
    }
  };
  passwordForm: PasswordChangeRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  profilePictureFile: File | null = null;
  isLoadingProfile = false;
  profileMessage = '';
  profileMessageType: 'success' | 'error' = 'success';
  searchCriteria = { source: '', destination: '', departureDate: '' };
  
  showBookingModal = false;
  showPaymentModal = false;
  showBoardingPassModal = false;
  generatedBoardingPasses: BoardingPass[] = [];
  selectedFlight: Flight | null = null;
  selectedBooking: Booking | null = null;
  passengerData = {
    firstName: '',
    lastName: '',
    email: '',
    gender: 'Male',
    aadharNumber: ''
  };
  paymentMethod = 'CREDIT_CARD';
  

  
  // Navigation
  activeSection: string = 'dashboard';
  
  // Theme properties
  currentTheme: any = { name: 'light' };
  showThemeSelector = false;
  
  // Live flight tracking
  liveFlightsCount = 0;
  isLoadingLiveData = false;
  isSearching = false;
  searchMessage = '';
  sortBy = 'price';
  filterBy = 'all';
  hasSearched = false;
  currentSlide = 0;
  slideInterval: any;
  
  // Booking options
  selectedClass: string = 'economy';
  selectedFoods: number[] = [];
  foodItems = [
    { id: 1, name: 'Veg Thali', description: 'Traditional vegetarian meal', price: 250, icon: '🥗' },
    { id: 2, name: 'Chicken Biryani', description: 'Spiced rice with chicken', price: 350, icon: '🍗' },
    { id: 3, name: 'Pasta', description: 'Italian pasta with sauce', price: 280, icon: '🍝' },
    { id: 4, name: 'Sandwich', description: 'Fresh club sandwich', price: 180, icon: '🥪' },
    { id: 5, name: 'Fresh Juice', description: 'Mixed fruit juice', price: 120, icon: '🧃' }
  ];
  
  // City autocomplete
  cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna', 'Vadodara',
    'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi',
    'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
    'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur',
    'Dubai', 'Singapore', 'London', 'New York', 'Paris', 'Tokyo', 'Bangkok', 'Kuala Lumpur', 'Hong Kong', 'Sydney',
    'Toronto', 'Frankfurt', 'Amsterdam', 'Zurich', 'Vienna', 'Rome', 'Barcelona', 'Istanbul', 'Cairo', 'Doha'
  ];
  filteredSourceCities: string[] = [];
  filteredDestCities: string[] = [];
  showSourceDropdown = false;
  showDestDropdown = false;
  recentSearches: string[] = [];
  popularDestinations = ['Mumbai', 'Delhi', 'Bangalore', 'Dubai', 'Singapore', 'London'];
  
  airlines = [
    { name: 'Air India', icon: '🇮🇳', destinations: '102', rating: '4.2', type: 'National', features: ['WiFi', 'Meals', 'Entertainment'] },
    { name: 'IndiGo', icon: '🔵', destinations: '87', rating: '4.5', type: 'Low Cost', features: ['On-time', 'Clean', 'Efficient'] },
    { name: 'Emirates', icon: '🇦🇪', destinations: '158', rating: '4.8', type: 'Premium', features: ['Luxury', 'A380', 'Lounge'] },
    { name: 'Singapore Airlines', icon: '🇸🇬', destinations: '134', rating: '4.9', type: 'Premium', features: ['Service', 'Suites', 'Cuisine'] },
    { name: 'Qatar Airways', icon: '🇶🇦', destinations: '167', rating: '4.7', type: 'Premium', features: ['Qsuite', 'Hub', 'Modern'] },
    { name: 'Vistara', icon: '🔴', destinations: '45', rating: '4.4', type: 'Full Service', features: ['Premium', 'Service', 'Comfort'] }
  ];
  
  extendedAirlines = [
    { name: 'Air India', icon: '🇮🇳', destinations: '102', rating: '4.2', type: 'National Carrier', fleet: '137', onTime: '78', topFeatures: ['WiFi', 'Meals'] },
    { name: 'IndiGo', icon: '🔵', destinations: '87', rating: '4.5', type: 'Low Cost', fleet: '279', onTime: '85', topFeatures: ['On-time', 'Clean'] },
    { name: 'Emirates', icon: '🇦🇪', destinations: '158', rating: '4.8', type: 'Premium', fleet: '271', onTime: '82', topFeatures: ['A380', 'Luxury'] },
    { name: 'Singapore Airlines', icon: '🇸🇬', destinations: '134', rating: '4.9', type: 'Premium', fleet: '138', onTime: '89', topFeatures: ['Suites', 'Service'] },
    { name: 'Qatar Airways', icon: '🇶🇦', destinations: '167', rating: '4.7', type: 'Premium', fleet: '245', onTime: '86', topFeatures: ['Qsuite', 'Hub'] },
    { name: 'Vistara', icon: '🔴', destinations: '45', rating: '4.4', type: 'Full Service', fleet: '53', onTime: '81', topFeatures: ['Premium', 'Comfort'] },
    { name: 'British Airways', icon: '🇬🇧', destinations: '183', rating: '4.3', type: 'Premium', fleet: '273', onTime: '79', topFeatures: ['Club', 'Network'] },
    { name: 'Lufthansa', icon: '🇩🇪', destinations: '197', rating: '4.4', type: 'Premium', fleet: '354', onTime: '83', topFeatures: ['Business', 'Hub'] },
    // Duplicate for seamless loop
    { name: 'Air India', icon: '🇮🇳', destinations: '102', rating: '4.2', type: 'National Carrier', fleet: '137', onTime: '78', topFeatures: ['WiFi', 'Meals'] },
    { name: 'IndiGo', icon: '🔵', destinations: '87', rating: '4.5', type: 'Low Cost', fleet: '279', onTime: '85', topFeatures: ['On-time', 'Clean'] },
    { name: 'Emirates', icon: '🇦🇪', destinations: '158', rating: '4.8', type: 'Premium', fleet: '271', onTime: '82', topFeatures: ['A380', 'Luxury'] },
    { name: 'Singapore Airlines', icon: '🇸🇬', destinations: '134', rating: '4.9', type: 'Premium', fleet: '138', onTime: '89', topFeatures: ['Suites', 'Service'] }
  ];

  constructor(
    private authService: AuthService,
    private flightService: FlightService,
    private paymentService: PaymentService,
    private boardingPassService: BoardingPassService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Redirect admin users to admin panel
    if (this.currentUser.role === 'ADMIN') {
      this.router.navigate(['/admin']);
      return;
    }
    
    const savedTheme = localStorage.getItem('dashboardTheme') || 'ocean';
    this.setTheme(savedTheme);
    
    this.loadRecentSearches();
    this.loadUserBookings();
    this.loadLiveFlightsCount();
    this.startAutoSlide();
    
    // Load profile data
    this.loadUserProfile();
    this.loadProfileStats();

    // Don't load flights initially - only after search
  }
  


  async loadFlights() {
    try {
      // Using AviationStack API for real flight data
      const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=3e808bae39a9b2587c62818e491c43f6&limit=20&flight_status=scheduled`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        this.flights = data.data.map((flight: any, index: number) => ({
          id: index + 1,
          flightNumber: flight.flight?.iata || flight.flight?.icao || `FL-${index + 1}`,
          airline: flight.airline?.name || 'Unknown Airline',
          source: flight.departure?.iata || flight.departure?.icao || 'Unknown',
          destination: flight.arrival?.iata || flight.arrival?.icao || 'Unknown',
          departureDate: flight.flight_date || new Date().toISOString().split('T')[0],
          departureTime: flight.departure?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
          arrivalTime: flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
          fare: Math.floor(Math.random() * 25000) + 2500,
          availableSeats: Math.floor(Math.random() * 150) + 5,
          aircraft: flight.aircraft?.registration || flight.aircraft?.iata || 'Aircraft',
          duration: this.calculateDuration(flight.departure?.scheduled, flight.arrival?.scheduled)
        }));
        console.log('Real flight data loaded:', this.flights.length, 'flights');
      } else {
        console.log('No flight data received from API');
        this.loadDemoFlights();
      }
    } catch (error) {
      console.error('Error loading real flight data:', error);
      // Try HTTPS if HTTP fails
      try {
        const httpsResponse = await fetch(`https://api.aviationstack.com/v1/flights?access_key=3e808bae39a9b2587c62818e491c43f6&limit=15&flight_status=active`);
        const httpsData = await httpsResponse.json();
        if (httpsData.data && httpsData.data.length > 0) {
          this.flights = httpsData.data.map((flight: any, index: number) => ({
            id: index + 1,
            flightNumber: flight.flight?.iata || flight.flight?.icao || `FL-${index + 1}`,
            airline: flight.airline?.name || 'Unknown Airline',
            source: flight.departure?.iata || 'Unknown',
            destination: flight.arrival?.iata || 'Unknown',
            departureDate: flight.flight_date || new Date().toISOString().split('T')[0],
            departureTime: flight.departure?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
            arrivalTime: flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
            fare: Math.floor(Math.random() * 25000) + 2500,
            availableSeats: Math.floor(Math.random() * 150) + 5,
            aircraft: flight.aircraft?.registration || 'Aircraft',
            duration: this.calculateDuration(flight.departure?.scheduled, flight.arrival?.scheduled)
          }));
          console.log('HTTPS flight data loaded:', this.flights.length, 'flights');
        } else {
          this.loadDemoFlights();
        }
      } catch (httpsError) {
        console.error('HTTPS request also failed:', httpsError);
        this.loadDemoFlights();
      }
    }
  }
  
  loadDemoFlights() {
    // Indian flights as fallback
    this.flights = [
      {
        id: 1, flightNumber: 'AI-101', airline: 'Air India', source: 'Delhi', destination: 'Mumbai',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '06:00', arrivalTime: '08:15', fare: 4500,
        availableSeats: 45, aircraft: 'Boeing 737-800', duration: '2h 15m'
      },
      {
        id: 2, flightNumber: '6E-234', airline: 'IndiGo', source: 'Mumbai', destination: 'Bangalore',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '09:30', arrivalTime: '11:00', fare: 3200,
        availableSeats: 32, aircraft: 'Airbus A320', duration: '1h 30m'
      },
      {
        id: 3, flightNumber: 'SG-567', airline: 'SpiceJet', source: 'Delhi', destination: 'Goa',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '14:20', arrivalTime: '16:45', fare: 5800,
        availableSeats: 28, aircraft: 'Boeing 737-900', duration: '2h 25m'
      },
      {
        id: 4, flightNumber: 'UK-445', airline: 'Vistara', source: 'Bangalore', destination: 'Chennai',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '12:15', arrivalTime: '13:30', fare: 2800,
        availableSeats: 52, aircraft: 'Airbus A321', duration: '1h 15m'
      },
      {
        id: 5, flightNumber: 'G8-678', airline: 'GoAir', source: 'Kolkata', destination: 'Hyderabad',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '16:45', arrivalTime: '18:30', fare: 4100,
        availableSeats: 38, aircraft: 'Airbus A320neo', duration: '1h 45m'
      },
      {
        id: 6, flightNumber: 'I5-890', airline: 'AirAsia India', source: 'Pune', destination: 'Jaipur',
        departureDate: new Date().toISOString().split('T')[0], departureTime: '11:00', arrivalTime: '12:45', fare: 3600,
        availableSeats: 41, aircraft: 'Airbus A320', duration: '1h 45m'
      }
    ];
  }
  
  calculateDuration(departure: string, arrival: string): string {
    if (!departure || !arrival) return '2h 00m';
    
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  loadUserBookings() {
    if (this.currentUser) {
      this.flightService.getUserBookings(this.currentUser.id!).subscribe(bookings => {
        this.userBookings = bookings;
      });
    }
  }

  async searchFlights() {
    if (!this.searchCriteria.source || !this.searchCriteria.destination || !this.searchCriteria.departureDate) {
      this.searchMessage = 'Please enter departure city, destination, and travel date';
      return;
    }
    
    this.isSearching = true;
    this.hasSearched = true;
    this.searchMessage = '';
    
    // Premium 2-second loading animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Search for flights with Indian routes
      const sourceCode = this.getCityCode(this.searchCriteria.source);
      const destCode = this.getCityCode(this.searchCriteria.destination);
      
      const response = await fetch(`https://api.aviationstack.com/v1/flights?access_key=3e808bae39a9b2587c62818e491c43f6&dep_iata=${sourceCode}&arr_iata=${destCode}&limit=10`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        this.flights = data.data.map((flight: any, index: number) => ({
          id: index + 1,
          flightNumber: flight.flight?.iata || `FL-${index + 1}`,
          airline: flight.airline?.name || 'Unknown Airline',
          source: this.searchCriteria.source,
          destination: this.searchCriteria.destination,
          departureDate: this.searchCriteria.departureDate || new Date().toISOString().split('T')[0],
          departureTime: flight.departure?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
          arrivalTime: flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5) || '00:00',
          fare: Math.floor(Math.random() * 15000) + 3000,
          availableSeats: Math.floor(Math.random() * 100) + 10,
          aircraft: flight.aircraft?.registration || 'Boeing 737',
          duration: this.calculateDuration(flight.departure?.scheduled, flight.arrival?.scheduled)
        }));
        this.searchMessage = `Found ${this.flights.length} flights`;
      } else {
        this.generateIndianFlights();
        this.searchMessage = `Found ${this.flights.length} flights for your route`;
      }
    } catch (error) {
      console.error('Search error:', error);
      this.generateIndianFlights();
      this.searchMessage = `Showing available flights for your route`;
    } finally {
      this.isSearching = false;
    }
  }
  
  getCityCode(city: string): string {
    const codes: {[key: string]: string} = {
      'Mumbai': 'BOM', 'Delhi': 'DEL', 'Bangalore': 'BLR', 'Chennai': 'MAA',
      'Kolkata': 'CCU', 'Hyderabad': 'HYD', 'Pune': 'PNQ', 'Ahmedabad': 'AMD',
      'Jaipur': 'JAI', 'Goa': 'GOI', 'Kochi': 'COK', 'Lucknow': 'LKO',
      'Dubai': 'DXB', 'Singapore': 'SIN', 'London': 'LHR', 'New York': 'JFK'
    };
    return codes[city] || city.substring(0, 3).toUpperCase();
  }
  
  generateIndianFlights() {
    const indianAirlines = ['Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];
    const aircraft = ['Boeing 737-800', 'Airbus A320', 'Boeing 787', 'Airbus A321', 'ATR 72'];
    
    this.flights = [];
    for (let i = 0; i < 8; i++) {
      const airline = indianAirlines[Math.floor(Math.random() * indianAirlines.length)];
      const departureHour = Math.floor(Math.random() * 20) + 4;
      const duration = Math.floor(Math.random() * 4) + 1;
      const arrivalHour = (departureHour + duration) % 24;
      
      this.flights.push({
        id: i + 1,
        flightNumber: this.generateFlightNumber(airline),
        airline: airline,
        source: this.searchCriteria.source,
        destination: this.searchCriteria.destination,
        departureDate: this.searchCriteria.departureDate || new Date().toISOString().split('T')[0],
        departureTime: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        arrivalTime: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        fare: Math.floor(Math.random() * 12000) + 2500,
        availableSeats: Math.floor(Math.random() * 120) + 15,
        aircraft: aircraft[Math.floor(Math.random() * aircraft.length)],
        duration: `${duration}h ${Math.floor(Math.random() * 60)}m`
      });
    }
  }
  
  generateFlightNumber(airline: string): string {
    const codes: {[key: string]: string} = {
      'Air India': 'AI', 'IndiGo': '6E', 'SpiceJet': 'SG', 
      'Vistara': 'UK', 'GoAir': 'G8', 'AirAsia India': 'I5'
    };
    const code = codes[airline] || 'FL';
    const number = Math.floor(Math.random() * 999) + 100;
    return `${code}-${number}`;
  }

  bookFlight(flight: Flight) {
    this.selectedFlight = flight;
    this.selectedClass = 'economy';
    this.selectedFoods = [];
    this.passengerData = {
      firstName: this.currentUser?.name?.split(' ')[0] || '',
      lastName: this.currentUser?.name?.split(' ')[1] || '',
      email: this.currentUser?.email || '',
      gender: 'Male',
      aadharNumber: ''
    };
    this.showBookingModal = true;
  }
  
  selectClass(className: string) {
    this.selectedClass = className;
  }
  
  toggleFood(foodId: number) {
    const index = this.selectedFoods.indexOf(foodId);
    if (index > -1) {
      this.selectedFoods.splice(index, 1);
    } else {
      this.selectedFoods.push(foodId);
    }
  }
  
  getBaseFare(): number {
    if (!this.selectedFlight) return 0;
    
    let basePrice = this.selectedFlight.fare;
    
    if (this.selectedClass === 'business') {
      basePrice *= 2.5;
    } else if (this.selectedClass === 'first') {
      basePrice *= 4;
    }
    
    return basePrice;
  }
  
  getFoodTotal(): number {
    return this.selectedFoods.reduce((total, foodId) => {
      const food = this.foodItems.find(f => f.id === foodId);
      return total + (food ? food.price : 0);
    }, 0);
  }
  
  getTaxes(): number {
    return Math.round(this.getBaseFare() * 0.12); // 12% taxes
  }
  
  getTotalPrice(): number {
    return this.getBaseFare() + this.getFoodTotal() + this.getTaxes();
  }
  
  onSourceInput(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredSourceCities = this.cities.filter(city => 
      city.toLowerCase().startsWith(value)
    ).slice(0, 8);
    this.showSourceDropdown = true;
  }
  
  onDestInput(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredDestCities = this.cities.filter(city => 
      city.toLowerCase().startsWith(value)
    ).slice(0, 8);
    this.showDestDropdown = true;
  }
  
  selectSourceCity(city: string) {
    this.searchCriteria.source = city;
    this.showSourceDropdown = false;
    this.addToRecentSearches(city);
  }
  
  selectDestCity(city: string) {
    this.searchCriteria.destination = city;
    this.showDestDropdown = false;
    this.addToRecentSearches(city);
  }
  
  addToRecentSearches(city: string) {
    if (!this.recentSearches.includes(city)) {
      this.recentSearches.unshift(city);
      if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
      }
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
  }
  
  loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved);
    }
  }
  
  getDropdownCities(type: 'source' | 'dest'): string[] {
    const filtered = type === 'source' ? this.filteredSourceCities : this.filteredDestCities;
    const inputValue = type === 'source' ? this.searchCriteria.source : this.searchCriteria.destination;
    
    if (inputValue.length === 0) {
      const combined = [...new Set([...this.recentSearches, ...this.popularDestinations])];
      return combined.slice(0, 6);
    }
    return filtered;
  }
  
  clearSource() {
    this.searchCriteria.source = '';
    this.showSourceDropdown = false;
  }
  
  clearDest() {
    this.searchCriteria.destination = '';
    this.showDestDropdown = false;
  }
  
  trackByCity(index: number, city: string): string {
    return city;
  }
  
  sortFlights() {
    switch(this.sortBy) {
      case 'price':
        this.flights.sort((a, b) => a.fare - b.fare);
        break;
      case 'time':
        this.flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'duration':
        this.flights.sort((a, b) => {
          const aDuration = parseInt((a.duration || '2h').split('h')[0]);
          const bDuration = parseInt((b.duration || '2h').split('h')[0]);
          return aDuration - bDuration;
        });
        break;
      case 'airline':
        this.flights.sort((a, b) => a.airline.localeCompare(b.airline));
        break;
    }
  }
  
  async loadLiveFlightsCount() {
    this.isLoadingLiveData = true;
    try {
      // Using OpenSky Network API for live flight tracking
      const response = await fetch('https://opensky-network.org/api/states/all');
      const data = await response.json();
      
      if (data.states) {
        this.liveFlightsCount = data.states.length;
      } else {
        this.liveFlightsCount = Math.floor(Math.random() * 5000) + 8000; // Fallback
      }
    } catch (error) {
      console.error('Error loading live flights:', error);
      this.liveFlightsCount = Math.floor(Math.random() * 5000) + 8000; // Fallback
    }
    this.isLoadingLiveData = false;
  }
  
  onClickOutside(event: any) {
    if (!event.target.closest('.search-field')) {
      this.showSourceDropdown = false;
      this.showDestDropdown = false;
    }
  }
  
  onKeyDown(event: KeyboardEvent, type: 'source' | 'dest') {
    if (event.key === 'Escape') {
      if (type === 'source') this.showSourceDropdown = false;
      if (type === 'dest') this.showDestDropdown = false;
    }
  }

  confirmBooking() {
    if (!this.selectedFlight || !this.passengerData.firstName || !this.passengerData.lastName) {
      alert('Please fill in all required fields');
      return;
    }



    if (this.selectedFlight && this.passengerData.firstName) {
      this.flightService.bookFlight(this.selectedFlight.id, this.passengerData)
        .subscribe({
          next: (booking) => {
            this.userBookings.push(booking);
            this.loadFlights();
            this.closeModal();
            alert('Flight booked successfully!');
          },
          error: (error) => {
            console.error('Booking error:', error);
            alert('Error booking flight: Please check Aadhar number (must be 12 digits)');
          }
        });
    }
  }

  makePayment(booking: Booking) {
    this.selectedBooking = booking;
    this.showPaymentModal = true;
  }
  
  testRazorpay() {
    console.log('Testing Razorpay integration...');
    
    // Check if Razorpay is loaded
    if (typeof (window as any).Razorpay === 'undefined') {
      alert('Razorpay SDK not loaded. Please refresh the page.');
      return;
    }
    
    console.log('Razorpay SDK loaded successfully');
    console.log('Using key:', this.paymentService.getRazorpayKey());
    
    // Test with dummy order
    const options = {
      key: this.paymentService.getRazorpayKey(),
      amount: 100000, // ₹1000 in paise
      currency: 'INR',
      name: 'FlightHub Test',
      description: 'Test Payment',
      handler: (response: any) => {
        console.log('Test payment successful:', response);
        alert(`Test Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          console.log('Test payment cancelled');
          alert('Test payment cancelled');
        }
      }
    };
    
    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      alert('Error opening Razorpay: ' + error);
    }
  }

  processPayment() {
    if (!this.selectedBooking) return;
    
    // Show loading state
    const payButton = document.querySelector('.pay-now-btn') as HTMLButtonElement;
    if (payButton) {
      payButton.disabled = true;
      payButton.innerHTML = '⏳ Processing...';
    }
    
    switch (this.paymentMethod) {
      case 'RAZORPAY':
        this.initiateRazorpayPayment();
        break;
      case 'UPI':
        this.initiateUPIPayment();
        break;
      case 'CARD':
        this.initiateCardPayment();
        break;
      case 'WALLET':
        this.initiateWalletPayment();
        break;
      default:
        this.initiateRazorpayPayment();
    }
  }

  initiateRazorpayPayment() {
    if (!this.selectedBooking || !this.currentUser || !this.selectedBooking.id) {
      this.handlePaymentError('Invalid booking or user data');
      return;
    }
    
    // For demo purposes, create a direct payment without backend order
    console.log('Creating direct Razorpay payment...');
    
    const options = {
      key: this.paymentService.getRazorpayKey(),
      amount: this.selectedBooking.totalFare * 100, // Convert to paise
      currency: 'INR',
      name: 'FlightHub',
      description: `Flight Booking Payment - Booking #${this.selectedBooking.id}`,
      handler: (response: any) => {
        console.log('Payment successful:', response);
        this.handlePaymentSuccess({
          paymentId: response.razorpay_payment_id,
          amount: this.selectedBooking?.totalFare
        });
      },
      prefill: {
        name: this.currentUser.name || 'Customer',
        email: this.currentUser.email || 'customer@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#667eea'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment cancelled by user');
          this.handlePaymentError('Payment cancelled by user');
        }
      }
    };
    
    try {
      if (typeof (window as any).Razorpay === 'undefined') {
        this.handlePaymentError('Razorpay SDK not loaded. Please refresh the page.');
        return;
      }
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      this.handlePaymentError('Failed to open payment gateway: ' + error);
    }
  }
  
  // Removed - using direct payment instead
  
  verifyPayment(response: any, orderId: string) {
    const verificationData = {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
      amount: this.selectedBooking?.totalFare?.toString() || '0'
    };
    
    this.paymentService.verifyPayment(verificationData).subscribe({
      next: (result) => {
        if (result.includes('Successfully')) {
          this.paymentService.handlePaymentSuccess(this.selectedBooking?.id?.toString() || '').subscribe({
            next: (successResult) => {
              this.handlePaymentSuccess({ paymentId: response.razorpay_payment_id, amount: this.selectedBooking?.totalFare });
            },
            error: (error) => this.handlePaymentError('Payment success handling failed')
          });
        } else {
          this.handlePaymentError('Payment verification failed');
        }
      },
      error: (error) => {
        console.error('Payment verification failed:', error);
        this.handlePaymentError('Payment verification failed');
      }
    });
  }
  
  initiateUPIPayment() {
    // For UPI payments, you can integrate with UPI payment gateways
    // or redirect to UPI apps
    const upiId = 'your-merchant@upi'; // Replace with your UPI ID
    const amount = this.selectedBooking?.totalFare || 0;
    const note = `Flight Booking Payment - ${this.selectedBooking?.id}`;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=FlightHub&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // For web, you might want to show QR code or redirect to payment gateway
    if (this.isMobileDevice()) {
      window.location.href = upiUrl;
    } else {
      // Show UPI QR code or redirect to payment gateway
      this.showUPIOptions(upiUrl);
    }
  }
  
  initiateCardPayment() {
    // Integrate with card payment gateway (Stripe, Square, etc.)
    // This is a placeholder - implement based on your chosen gateway
    this.handlePaymentError('Card payment integration pending');
  }
  
  initiateWalletPayment() {
    // Integrate with wallet providers (Paytm, PhonePe, etc.)
    // This is a placeholder - implement based on your chosen provider
    this.handlePaymentError('Wallet payment integration pending');
  }
  
  showUPIOptions(upiUrl: string) {
    // Create a modal or popup showing UPI payment options
    const upiApps = [
      { name: 'Google Pay', url: upiUrl.replace('upi://', 'tez://') },
      { name: 'PhonePe', url: upiUrl.replace('upi://', 'phonepe://') },
      { name: 'Paytm', url: upiUrl.replace('upi://', 'paytmmp://') },
      { name: 'BHIM', url: upiUrl }
    ];
    
    // Show options to user (implement UI for this)
    alert('UPI Payment: Please use your preferred UPI app to complete payment');
  }
  
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  handlePaymentSuccess(result: any) {
    if (this.selectedBooking) {
      // Update booking status locally
      this.selectedBooking.status = 'CONFIRMED';
      
      // Update booking status in FlightService (localStorage)
      if (this.selectedBooking.id) {
        this.flightService.updateBookingStatus(this.selectedBooking.id, 'CONFIRMED');
      }
      
      // Reload user bookings to reflect the change
      this.loadUserBookings();
      this.closePaymentModal();
      
      // Show success message
      // Generate boarding pass with real flight data
      const flightData = this.selectedFlight;
      if (this.selectedBooking && this.selectedBooking.passengers) {
        this.boardingPassService.generateBoardingPass(this.selectedBooking, flightData).subscribe({
        next: (boardingPasses) => {
          this.generatedBoardingPasses = boardingPasses;
          // Show boarding pass modal instead of alert
          this.showBoardingPassModal = true;
        },
        error: (error) => {
          console.error('Error generating boarding pass:', error);
          alert(`Payment Successful!\nPayment ID: ${result.paymentId}\nAmount: ₹${result.amount}\nBut there was an issue generating boarding pass.`);
        }
      });
      } else {
        alert(`Payment Successful!\nPayment ID: ${result.paymentId}\nAmount: ₹${result.amount}`);
      }
    }
  }
  
  handlePaymentError(message: string) {
    // Reset button state
    const payButton = document.querySelector('.pay-now-btn') as HTMLButtonElement;
    if (payButton) {
      payButton.disabled = false;
      payButton.innerHTML = `🚀 Pay ₹${this.selectedBooking?.totalFare || 0}`;
    }
    
    alert(`Payment Failed: ${message}`);
    console.error('Payment error:', message);
  }



  closeModal() {
    this.showBookingModal = false;
    this.selectedFlight = null;
    this.selectedClass = 'economy';
    this.selectedFoods = [];
    this.passengerData = {
      firstName: '',
      lastName: '',
      email: '',
      gender: 'Male',
      aadharNumber: ''
    };
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedBooking = null;
  }

  closeBoardingPassModal() {
    this.showBoardingPassModal = false;
    this.generatedBoardingPasses = [];
  }

  showBoardingPass(booking: Booking) {
    const flightData = this.flights.find(f => f.id === booking.flightId);
    this.boardingPassService.generateBoardingPass(booking, flightData).subscribe({
      next: (boardingPasses) => {
        this.generatedBoardingPasses = boardingPasses;
        this.showBoardingPassModal = true;
      },
      error: (error) => {
        console.error('Error generating boarding pass:', error);
        alert('Error generating boarding pass');
      }
    });
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    this.showThemeSelector = false;
    localStorage.setItem('dashboardTheme', theme);
  }
  
  setActiveSection(section: string) {
    console.log('Setting active section to:', section);
    this.activeSection = section;
    // Close any open modals when switching sections
    this.showBookingModal = false;
    this.showPaymentModal = false;
    this.showThemeSelector = false;
  }
  
  toggleThemeSelector() {
    this.showThemeSelector = !this.showThemeSelector;
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }
  
  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % 4;
  }
  
  prevSlide() {
    this.stopAutoSlide();
    this.currentSlide = this.currentSlide === 0 ? 3 : this.currentSlide - 1;
    this.startAutoSlide();
  }
  
  goToSlide(index: number) {
    this.stopAutoSlide();
    this.currentSlide = index;
    this.startAutoSlide();
  }


  

  
  logout() {
    this.stopAutoSlide();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  ngOnDestroy() {
    this.stopAutoSlide();
  }
  // Profile Management Methods
  loadUserProfile() {
    this.isLoadingProfile = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editProfileForm = { 
          ...profile,
          preferences: {
            seatPreference: profile.preferences?.seatPreference || '',
            mealPreference: profile.preferences?.mealPreference || '',
            newsletter: profile.preferences?.newsletter || false,
            notifications: profile.preferences?.notifications || false
          }
        };
        this.isLoadingProfile = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoadingProfile = false;
        this.showProfileMessage('Failed to load profile', 'error');
      }
    });
  }

  loadProfileStats() {
    this.profileService.getProfileStats().subscribe({
      next: (stats) => {
        this.profileStats = stats;
      },
      error: (error) => {
        console.error('Error loading profile stats:', error);
      }
    });
  }



  cancelEditProfile() {
    this.showEditProfile = false;
    this.editProfileForm = {};
    this.profileMessage = '';
  }

  saveProfile() {
    if (!this.editProfileForm.name || !this.editProfileForm.email) {
      this.showProfileMessage('Name and email are required', 'error');
      return;
    }

    this.isLoadingProfile = true;
    this.profileService.updateProfile(this.editProfileForm).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.showEditProfile = false;
        this.isLoadingProfile = false;
        this.showProfileMessage('Profile updated successfully', 'success');
        
        // Update current user in auth service
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.name = updatedProfile.name || currentUser.name;
          currentUser.email = updatedProfile.email || currentUser.email;
        }
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoadingProfile = false;
        this.showProfileMessage('Failed to update profile', 'error');
      }
    });
  }

  showChangePasswordModal() {
    this.showChangePassword = true;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  cancelChangePassword() {
    this.showChangePassword = false;
    this.passwordForm = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.profileMessage = '';
  }

  changePassword() {
    if (!this.passwordForm.currentPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      this.showProfileMessage('All password fields are required', 'error');
      return;
    }

    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.showProfileMessage('New passwords do not match', 'error');
      return;
    }

    if (this.passwordForm.newPassword.length < 6) {
      this.showProfileMessage('New password must be at least 6 characters', 'error');
      return;
    }

    this.isLoadingProfile = true;
    this.profileService.changePassword(this.passwordForm).subscribe({
      next: (response) => {
        this.showChangePassword = false;
        this.isLoadingProfile = false;
        this.showProfileMessage('Password changed successfully', 'success');
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.isLoadingProfile = false;
        this.showProfileMessage('Failed to change password', 'error');
      }
    });
  }

  onProfilePictureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showProfileMessage('File size must be less than 5MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.showProfileMessage('Please select an image file', 'error');
        return;
      }

      this.profilePictureFile = file;
      this.uploadProfilePicture();
    }
  }

  uploadProfilePicture() {
    if (!this.profilePictureFile) return;

    this.isLoadingProfile = true;
    this.profileService.uploadProfilePicture(this.profilePictureFile).subscribe({
      next: (response) => {
        if (this.userProfile) {
          this.userProfile.profilePicture = response.profilePictureUrl;
        }
        this.isLoadingProfile = false;
        this.showProfileMessage('Profile picture updated successfully', 'success');
        this.profilePictureFile = null;
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
        this.isLoadingProfile = false;
        this.showProfileMessage('Failed to upload profile picture', 'error');
      }
    });
  }

  showDeleteAccountModal() {
    this.showDeleteAccount = true;
  }

  cancelDeleteAccount() {
    this.showDeleteAccount = false;
  }

  confirmDeleteAccount() {
    this.isLoadingProfile = true;
    this.profileService.deleteAccount().subscribe({
      next: (response) => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.isLoadingProfile = false;
        this.showProfileMessage('Failed to delete account', 'error');
      }
    });
  }

  showProfileMessage(message: string, type: 'success' | 'error') {
    this.profileMessage = message;
    this.profileMessageType = type;
    setTimeout(() => {
      this.profileMessage = '';
    }, 5000);
  }

  getUniqueDestinations(): number {
    if (!this.profileStats) {
      const destinations = new Set();
      this.userBookings.forEach(booking => {
        if (booking.flightId) {
          const flight = this.flights.find(f => f.id === booking.flightId);
          if (flight) {
            destinations.add(flight.destination);
          }
        }
      });
      return destinations.size;
    }
    return this.profileStats.uniqueDestinations;
  }

  getTotalSpent(): number {
    if (!this.profileStats) {
      return this.userBookings.reduce((total, booking) => total + (booking.totalFare || 0), 0);
    }
    return this.profileStats.totalSpent;
  }

  getMembershipLevel(): string {
    return this.userProfile?.membershipLevel || 'BASIC';
  }

  getMembershipColor(): string {
    const level = this.getMembershipLevel();
    switch (level) {
      case 'PLATINUM': return '#E5E7EB';
      case 'GOLD': return '#FCD34D';
      case 'SILVER': return '#9CA3AF';
      default: return '#6B7280';
    }
  }

  goToProfile() {
    this.setActiveSection('profile');
  }
}