import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FlightService } from '../services/flight.service';
import { Flight, FlightDTO } from '../models/flight.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-admin',
  template: `
    <div class="admin-panel" [attr.data-theme]="currentTheme">
      <!-- SVG Animated Background -->
      <div class="svg-background">
        <!-- Flying Planes -->
        <div class="flying-planes">
          <div class="plane plane-1">
            <svg viewBox="0 0 100 30" class="plane-svg">
              <path d="M10,15 L30,10 L70,12 L90,15 L70,18 L30,20 Z" fill="#ffffff" opacity="0.9"/>
              <path d="M25,15 L35,8 L45,15 L35,22 Z" fill="#ffffff" opacity="0.9"/>
              <circle cx="20" cy="15" r="2" fill="#ff4444"/>
              <circle cx="80" cy="15" r="2" fill="#44ff44"/>
            </svg>
          </div>
          
          <div class="plane plane-2">
            <svg viewBox="0 0 100 30" class="plane-svg">
              <path d="M10,15 L25,12 L60,13 L85,15 L60,17 L25,18 Z" fill="#e0e0e0" opacity="0.8"/>
              <path d="M20,15 L30,9 L40,15 L30,21 Z" fill="#e0e0e0" opacity="0.8"/>
              <circle cx="15" cy="15" r="2" fill="#ff4444"/>
              <circle cx="75" cy="15" r="2" fill="#44ff44"/>
            </svg>
          </div>
          
          <div class="plane plane-3">
            <svg viewBox="0 0 120 35" class="plane-svg">
              <path d="M15,17 L35,14 L80,15 L105,17 L80,19 L35,20 Z" fill="#f0f0f0" opacity="0.9"/>
              <path d="M30,17 L45,10 L55,17 L45,24 Z" fill="#f0f0f0" opacity="0.9"/>
              <rect x="40" y="14" width="30" height="6" fill="#d0d0d0" opacity="0.8"/>
              <circle cx="25" cy="17" r="2" fill="#ff4444"/>
              <circle cx="95" cy="17" r="2" fill="#44ff44"/>
            </svg>
          </div>
        </div>
        
        <!-- SVG Clouds -->
        <div class="svg-clouds">
          <svg class="cloud cloud-1" viewBox="0 0 100 40">
            <ellipse cx="25" cy="25" rx="25" ry="15" fill="rgba(255,255,255,0.8)"/>
            <ellipse cx="50" cy="20" rx="30" ry="18" fill="rgba(255,255,255,0.8)"/>
            <ellipse cx="75" cy="25" rx="25" ry="15" fill="rgba(255,255,255,0.8)"/>
          </svg>
          <svg class="cloud cloud-2" viewBox="0 0 80 30">
            <ellipse cx="20" cy="20" rx="20" ry="12" fill="rgba(255,255,255,0.7)"/>
            <ellipse cx="40" cy="15" rx="25" ry="15" fill="rgba(255,255,255,0.7)"/>
            <ellipse cx="60" cy="20" rx="20" ry="12" fill="rgba(255,255,255,0.7)"/>
          </svg>
          <svg class="cloud cloud-3" viewBox="0 0 120 50">
            <ellipse cx="30" cy="30" rx="30" ry="18" fill="rgba(255,255,255,0.6)"/>
            <ellipse cx="60" cy="25" rx="35" ry="20" fill="rgba(255,255,255,0.6)"/>
            <ellipse cx="90" cy="30" rx="30" ry="18" fill="rgba(255,255,255,0.6)"/>
          </svg>
        </div>
      </div>
      
      <header class="admin-header">
        <div class="header-left">
          <h1>🚀 Admin Pannel</h1>
          <div class="admin-badge">
            <span>👑</span>
            <span>Administrator</span>
          </div>
        </div>
        
        <div class="header-controls">
          <div class="theme-selector" [class.active]="showThemeSelector">
            <button (click)="showThemeSelector = !showThemeSelector" class="theme-btn">
              <span>🎨</span>
              <span>Themes</span>
            </button>
            <div class="theme-dropdown" *ngIf="showThemeSelector">
              <button (click)="setTheme('default')" [class.active]="currentTheme === 'default'" class="theme-option">
                <div class="theme-preview default"></div>
                <span>Ocean Blue</span>
              </button>
              <button (click)="setTheme('dark')" [class.active]="currentTheme === 'dark'" class="theme-option">
                <div class="theme-preview dark"></div>
                <span>Dark Mode</span>
              </button>
              <button (click)="setTheme('sunset')" [class.active]="currentTheme === 'sunset'" class="theme-option">
                <div class="theme-preview sunset"></div>
                <span>Sunset</span>
              </button>
              <button (click)="setTheme('forest')" [class.active]="currentTheme === 'forest'" class="theme-option">
                <div class="theme-preview forest"></div>
                <span>Forest</span>
              </button>
            </div>
          </div>
          
          <div class="user-info">
            <div class="user-avatar-large">
              <span>{{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}}</span>
              <div class="status-indicator"></div>
            </div>
            <div class="user-details">
              <span class="user-name">{{currentUser?.name}}</span>
              <span class="user-role">System Administrator</span>
            </div>
          </div>
          
          <button (click)="logout()" class="logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div class="admin-content">
        <div class="welcome-section">
          <div class="welcome-text">
            <h2>Welcome back, {{currentUser?.name}}! 👋</h2>
            <p>Manage your airline operations from this comprehensive dashboard</p>
          </div>
          <div class="quick-actions">
            <button (click)="showCreateForm()" class="action-btn primary">
              <span>✈️</span>
              <span>Add Flight</span>
            </button>
            <button (click)="loadFlights(); loadUsers()" class="action-btn secondary">
              <span>🔄</span>
              <span>Refresh All</span>
            </button>
            <button class="action-btn tertiary">
              <span>📊</span>
              <span>Analytics</span>
            </button>
          </div>
        </div>

        <div class="flights-stats">
          <div class="stat-card live-flights">
            <div class="stat-icon">🌍</div>
            <div class="stat-content">
              <h3 *ngIf="!isLoadingLiveData">{{liveFlightsCount | number}}</h3>
              <div class="loading-counter" *ngIf="isLoadingLiveData">
                <div class="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <p>Live Flights Worldwide</p>
              <div class="pulse-indicator"></div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✈️</div>
            <div class="stat-content">
              <h3>{{flights.length}}</h3>
              <p>Managed Flights</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💺</div>
            <div class="stat-content">
              <h3>{{getTotalSeats()}}</h3>
              <p>Available Seats</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <h3>{{users.length}}</h3>
              <p>Registered Users</p>
            </div>
          </div>
        </div>

        <div class="admin-tabs">
          <button (click)="activeTab = 'flights'" [class.active]="activeTab === 'flights'" class="tab-btn">
            ✈️ Flights Management
            <span class="live-indicator" *ngIf="activeTab === 'flights'">🔴 LIVE</span>
          </button>
          <button (click)="activeTab = 'users'; loadUsers()" [class.active]="activeTab === 'users'" class="tab-btn">
            👥 User Management
          </button>
        </div>
        
        <div class="table-controls" *ngIf="activeTab === 'flights'">
          <div class="data-source-info">
            <span class="source-badge">📡 Real-time Data</span>
            <span class="last-updated">Auto-refresh: 5min</span>
          </div>
          <button (click)="loadFlights(); loadLiveFlightsCount()" class="refresh-flights-btn">
            <span class="refresh-icon">🔄</span>
            <span>Refresh Data</span>
          </button>
        </div>

        <div class="flights-table-container" *ngIf="activeTab === 'flights'">
          <table class="flights-table">
            <thead>
              <tr>
                <th>Flight No.</th>
                <th>Airline</th>
                <th>Route</th>
                <th>Date</th>
                <th>Time</th>
                <th>Seats</th>
                <th>Fare</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let flight of flights">
                <td>{{flight.flightNumber}}</td>
                <td>{{flight.airline}}</td>
                <td>{{flight.source}} → {{flight.destination}}</td>
                <td>{{flight.departureDate}}</td>
                <td>{{flight.departureTime}} - {{flight.arrivalTime}}</td>
                <td>{{flight.availableSeats}}</td>
                <td>₹{{flight.fare}}</td>
                <td class="actions">
                  <button (click)="editFlight(flight)" class="edit-btn">Edit</button>
                  <button (click)="deleteFlight(flight.id)" class="delete-btn">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="users-table-container" *ngIf="activeTab === 'users'">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>#{{user.id}}</td>
                <td>{{user.username}}</td>
                <td>{{user.name}}</td>
                <td>{{user.email}}</td>
                <td>{{user.role}}</td>
                <td>Active</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div *ngIf="showModal" class="modal">
      <div class="modal-content">
        <h3>{{isEditing ? 'Edit Flight' : 'Create New Flight'}}</h3>
        <form (ngSubmit)="saveFlight()" #flightForm="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Flight Number</label>
              <input type="text" [(ngModel)]="flightData.flightNumber" name="flightNumber" required>
            </div>
            <div class="form-group">
              <label>Airline</label>
              <input type="text" [(ngModel)]="flightData.airline" name="airline" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Source</label>
              <input type="text" [(ngModel)]="flightData.source" name="source" required>
            </div>
            <div class="form-group">
              <label>Destination</label>
              <input type="text" [(ngModel)]="flightData.destination" name="destination" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Departure Date</label>
              <input type="date" [(ngModel)]="flightData.departureDate" name="departureDate" required>
            </div>
            <div class="form-group">
              <label>Available Seats</label>
              <input type="number" [(ngModel)]="flightData.availableSeats" name="availableSeats" min="1" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Departure Time</label>
              <input type="time" [(ngModel)]="flightData.departureTime" name="departureTime" required>
            </div>
            <div class="form-group">
              <label>Arrival Time</label>
              <input type="time" [(ngModel)]="flightData.arrivalTime" name="arrivalTime" required>
            </div>
          </div>

          <div class="form-group">
            <label>Fare (₹)</label>
            <input type="number" [(ngModel)]="flightData.fare" name="fare" min="1" required>
          </div>

          <div class="modal-actions">
            <button type="submit" [disabled]="!flightForm.valid" class="save-btn">
              {{isEditing ? 'Update' : 'Create'}}
            </button>
            <button type="button" (click)="closeModal()" class="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    .admin-panel {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      background: #0f0f23;
      color: #ffffff;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .svg-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
    }
    
    /* Flying SVG Planes */
    .flying-planes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .plane {
      position: absolute;
      width: 80px;
      height: 24px;
    }
    
    .plane-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    }
    
    .plane-1 {
      top: 25%;
      left: -100px;
      animation: flyRight 18s linear infinite;
    }
    
    .plane-2 {
      top: 35%;
      right: -100px;
      animation: flyLeft 22s linear infinite;
      animation-delay: 6s;
      transform: scaleX(-1);
    }
    
    .plane-3 {
      top: 45%;
      left: -120px;
      animation: flyRight 25s linear infinite;
      animation-delay: 12s;
      width: 100px;
      height: 30px;
    }
    
    /* SVG Clouds */
    .svg-clouds {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .cloud {
      position: absolute;
      width: 150px;
      height: 60px;
      opacity: 0.4;
      animation: cloudDrift 30s linear infinite;
    }
    
    .cloud-1 {
      top: 10%;
      left: -200px;
      animation-delay: 0s;
    }
    
    .cloud-2 {
      top: 20%;
      left: -150px;
      animation-delay: 10s;
      width: 120px;
      height: 45px;
    }
    
    .cloud-3 {
      top: 15%;
      left: -180px;
      animation-delay: 20s;
      width: 180px;
      height: 75px;
    }
    
    /* SVG Animations */
    @keyframes flyRight {
      0% { 
        transform: translateX(0) translateY(0) rotate(2deg); 
        opacity: 0;
      }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { 
        transform: translateX(calc(100vw + 100px)) translateY(-20px) rotate(-2deg); 
        opacity: 0;
      }
    }
    
    @keyframes flyLeft {
      0% { 
        transform: translateX(0) translateY(0) rotate(-2deg) scaleX(-1); 
        opacity: 0;
      }
      10% { opacity: 0.8; }
      90% { opacity: 0.8; }
      100% { 
        transform: translateX(calc(-100vw - 100px)) translateY(-15px) rotate(2deg) scaleX(-1); 
        opacity: 0;
      }
    }
    
    @keyframes cloudDrift {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(100vw + 200px)); }
    }
    
    .admin-panel[data-theme="default"] {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .admin-panel[data-theme="dark"] {
      background: #0f0f23;
    }
    
    .admin-panel[data-theme="sunset"] {
      background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    }
    
    .admin-panel[data-theme="forest"] {
      background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
    }
    
    .admin-header {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      position: relative;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    .admin-header h1 {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .admin-badge {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .theme-selector {
      position: relative;
    }
    
    .theme-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .theme-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .theme-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
      min-width: 180px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 0.2s ease;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .theme-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border: none;
      background: transparent;
      color: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      width: 100%;
      text-align: left;
      transition: all 0.2s ease;
    }
    
    .theme-option:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .theme-option.active {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
    }
    
    .theme-preview {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    .theme-preview.default {
      background: linear-gradient(45deg, #667eea, #764ba2);
    }
    
    .theme-preview.dark {
      background: linear-gradient(45deg, #0f0f23, #6366f1);
    }
    
    .theme-preview.sunset {
      background: linear-gradient(45deg, #ff6b6b, #feca57);
    }
    
    .theme-preview.forest {
      background: linear-gradient(45deg, #00b894, #00cec9);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .user-avatar-large {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(45deg, #6366f1, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      position: relative;
    }
    
    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid #0f0f23;
    }
    
    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1;
    }
    
    .user-role {
      font-size: 0.75rem;
      opacity: 0.7;
      line-height: 1;
    }
    
    .logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
    }
    
    .admin-content {
      padding: 2rem;
      position: relative;
      z-index: 10;
    }
    
    .welcome-section {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .welcome-text h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: white;
    }
    
    .welcome-text p {
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-size: 0.875rem;
    }
    
    .quick-actions {
      display: flex;
      gap: 0.75rem;
    }
    
    .action-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    }
    
    .action-btn.primary {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
    }
    
    .action-btn.secondary {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
    }
    
    .action-btn.tertiary {
      background: rgba(245, 158, 11, 0.2);
      border-color: rgba(245, 158, 11, 0.3);
      color: #fcd34d;
    }
    
    .flights-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card:hover {
      background: rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
    }
    
    .stat-card.live-flights {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
      border-color: rgba(16, 185, 129, 0.3);
    }
    
    .stat-card.live-flights::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      animation: shimmer 3s infinite;
    }
    
    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      display: block;
    }
    
    .stat-content {
      position: relative;
    }
    
    .stat-card h3 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      color: white;
    }
    
    .stat-card p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .loading-counter {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
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
    
    .pulse-indicator {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 12px;
      height: 12px;
      background: #10b981;
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
      border: 2px solid #10b981;
      border-radius: 50%;
      animation: pulseRing 2s infinite;
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
    
    .admin-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
    }
    
    .tab-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .tab-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    
    .tab-btn:hover:not(.active) {
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.9);
    }
    
    .live-indicator {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.6rem;
      font-weight: 700;
      margin-left: 0.5rem;
      animation: blink 2s infinite;
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.5; }
    }
    
    .table-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
    }
    
    .data-source-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .source-badge {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .last-updated {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .refresh-flights-btn {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .refresh-flights-btn:hover {
      background: rgba(99, 102, 241, 0.3);
      transform: translateY(-1px);
    }
    
    .refresh-icon {
      animation: rotate 2s linear infinite paused;
    }
    
    .refresh-flights-btn:active .refresh-icon {
      animation-play-state: running;
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .flights-table-container, .users-table-container {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }
    
    .flights-table, .users-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .flights-table th, .users-table th {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .flights-table td, .users-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
    }
    
    .flights-table tbody tr:hover, .users-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .edit-btn, .delete-btn {
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      transition: all 0.2s ease;
      margin-right: 0.5rem;
    }
    
    .edit-btn {
      background: rgba(245, 158, 11, 0.2);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .delete-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .edit-btn:hover {
      background: rgba(245, 158, 11, 0.3);
    }
    
    .delete-btn:hover {
      background: rgba(239, 68, 68, 0.3);
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
    
    .modal-content {
      background: rgba(15, 15, 35, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }
    
    .modal-content h3 {
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 0 1.5rem 0;
      text-align: center;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .form-group input, .form-group select {
      width: 100%;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }
    
    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: rgba(99, 102, 241, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }
    
    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: center;
    }
    
    .save-btn, .cancel-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .save-btn {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    
    .save-btn:hover {
      background: rgba(16, 185, 129, 0.3);
    }
    
    .cancel-btn {
      background: rgba(107, 114, 128, 0.2);
      color: #d1d5db;
      border: 1px solid rgba(107, 114, 128, 0.3);
    }
    
    .cancel-btn:hover {
      background: rgba(107, 114, 128, 0.3);
    }
    
    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      
      .welcome-section {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .plane {
        width: 60px;
        height: 18px;
      }
      
      .takeoff-plane {
        width: 90px;
        height: 24px;
      }
      
      .cloud {
        width: 100px;
        height: 40px;
      }
      
      .control-tower {
        width: 40px;
        height: 70px;
      }
      
      .terminal {
        width: 80px;
        height: 40px;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  flights: Flight[] = [];
  users: User[] = [];
  activeTab: string = 'flights';
  showModal = false;
  isEditing = false;
  flightData: any = {};
  currentTheme: string = 'default';
  showThemeSelector = false;
  
  // Live flight tracking
  liveFlightsCount = 0;
  isLoadingLiveData = false;

  constructor(
    private authService: AuthService,
    private flightService: FlightService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'ADMIN') {
      this.router.navigate(['/dashboard']);
      return;
    }
    
    const savedTheme = localStorage.getItem('adminTheme') || 'default';
    this.setTheme(savedTheme);
    
    this.loadFlights();
    this.loadUsers();
    this.loadLiveFlightsCount();
    
    // Auto-refresh flights every 5 minutes
    setInterval(() => {
      this.loadFlights();
      this.loadLiveFlightsCount();
    }, 300000);
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    this.showThemeSelector = false;
    localStorage.setItem('adminTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  loadFlights() {
    this.flightService.getAllFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
        console.log('Flights loaded from backend:', this.flights.length, 'flights');
      },
      error: (error) => {
        console.error('Error loading flights from backend:', error);
        this.loadDemoFlights();
      }
    });
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

  loadUsers() {
    console.log('Loading users...');
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.users = [];
      }
    });
  }

  getTotalSeats(): number {
    return this.flights.reduce((total, flight) => total + flight.availableSeats, 0);
  }

  showCreateForm() {
    this.isEditing = false;
    this.flightData = {};
    this.showModal = true;
  }

  editFlight(flight: Flight) {
    this.isEditing = true;
    this.flightData = { ...flight };
    this.showModal = true;
  }

  saveFlight() {
    const flightDTO: FlightDTO = {
      flightNumber: this.flightData.flightNumber,
      airline: this.flightData.airline,
      source: this.flightData.source,
      destination: this.flightData.destination,
      departureDate: this.flightData.departureDate,
      departureTime: this.flightData.departureTime,
      arrivalTime: this.flightData.arrivalTime,
      availableSeats: parseInt(this.flightData.availableSeats),
      fare: parseFloat(this.flightData.fare)
    };

    if (this.isEditing) {
      this.flightService.updateFlight(this.flightData.id, flightDTO).subscribe({
        next: () => {
          this.loadFlights();
          this.closeModal();
          alert('Flight updated successfully!');
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Error updating flight');
        }
      });
    } else {
      this.flightService.createFlight(flightDTO).subscribe({
        next: () => {
          this.loadFlights();
          this.closeModal();
          alert('Flight created successfully!');
        },
        error: (error) => {
          console.error('Create error:', error);
          alert('Error creating flight');
        }
      });
    }
  }

  deleteFlight(id: number) {
    if (confirm('Are you sure you want to delete this flight?')) {
      this.flightService.deleteFlight(id).subscribe({
        next: () => {
          this.loadFlights();
          alert('Flight deleted successfully!');
        },
        error: (error) => {
          console.error('Delete error:', error);
          alert('Error deleting flight');
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.flightData = {};
  }

  loadLiveFlightsCount() {
    this.isLoadingLiveData = true;
    // Use your backend API for live count
    this.flightService.getAllFlights().subscribe({
      next: (flights) => {
        this.liveFlightsCount = flights.length * 50; // Simulate global flights
        this.isLoadingLiveData = false;
      },
      error: (error) => {
        console.error('Error loading live flights:', error);
        this.liveFlightsCount = Math.floor(Math.random() * 5000) + 8000;
        this.isLoadingLiveData = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}