import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  template: `
    <div class="advanced-settings-overlay" *ngIf="show" (click)="closeModal()">
      <!-- Animated Background -->
      <svg class="settings-bg-animation" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="settingsGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(102,126,234,0.4)">
              <animate attributeName="stop-color" values="rgba(102,126,234,0.4);rgba(118,75,162,0.4);rgba(102,126,234,0.4)" dur="6s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="rgba(118,75,162,0.4)">
              <animate attributeName="stop-color" values="rgba(118,75,162,0.4);rgba(102,126,234,0.4);rgba(118,75,162,0.4)" dur="6s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        <circle cx="200" cy="150" r="60" fill="url(#settingsGrad1)" opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0; 30,-20; 0,0" dur="8s" repeatCount="indefinite"/>
        </circle>
        <circle cx="800" cy="300" r="80" fill="rgba(255,107,107,0.3)" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; -25,35; 0,0" dur="10s" repeatCount="indefinite"/>
        </circle>
      </svg>
      
      <div class="advanced-settings-modal" (click)="$event.stopPropagation()">
        <!-- Header with SVG Animation -->
        <div class="advanced-settings-header">
          <div class="header-animation">
            <svg class="settings-gear" viewBox="0 0 100 100">
              <path d="M50,15 L60,25 L75,20 L80,35 L95,40 L85,50 L95,60 L80,65 L75,80 L60,75 L50,85 L40,75 L25,80 L20,65 L5,60 L15,50 L5,40 L20,35 L25,20 L40,25 Z" 
                    fill="white" opacity="0.9">
                <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="8s" repeatCount="indefinite"/>
              </path>
              <circle cx="50" cy="50" r="15" fill="rgba(0,0,0,0.2)"/>
            </svg>
          </div>
          <div class="header-content">
            <h1 class="settings-title">Advanced Settings</h1>
            <p class="settings-subtitle">Customize your flight booking experience</p>
          </div>
          <button class="advanced-close-btn" (click)="closeModal()">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Tabbed Content -->
        <div class="settings-tabs">
          <button class="tab-btn" [class.active]="activeTab === 'appearance'" (click)="activeTab = 'appearance'">
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18.75c-3.728 0-6.75-3.022-6.75-6.75S8.272 5.25 12 5.25 18.75 8.272 18.75 12 15.728 18.75 12 18.75z" fill="currentColor"/>
            </svg>
            Appearance
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'">
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" fill="currentColor"/>
            </svg>
            Notifications
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'preferences'" (click)="activeTab = 'preferences'">
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" fill="currentColor"/>
              <path d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" fill="currentColor"/>
            </svg>
            Preferences
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'flight'" (click)="activeTab = 'flight'">
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l-5.511-3.182" fill="currentColor"/>
            </svg>
            Flight
          </button>
          <button class="tab-btn" [class.active]="activeTab === 'security'" (click)="activeTab = 'security'">
            <svg viewBox="0 0 24 24" class="tab-icon">
              <path d="M12 1l3 6 6 .75-4.5 4.25L18 18l-6-3.25L6 18l1.5-6.25L3 7.75 9 7l3-6z" fill="currentColor"/>
            </svg>
            Security
          </button>
        </div>
        
        <div class="advanced-settings-content">
          <!-- Appearance Tab -->
          <div class="tab-content" *ngIf="activeTab === 'appearance'">
            <div class="content-section">
              <h3 class="section-title">🎨 Theme & Display</h3>
              <div class="theme-grid">
                <div class="theme-card" [class.selected]="currentTheme === 'light'" (click)="selectTheme('light')">
                  <div class="theme-preview light-preview"></div>
                  <span>Light</span>
                </div>
                <div class="theme-card" [class.selected]="currentTheme === 'dark'" (click)="selectTheme('dark')">
                  <div class="theme-preview dark-preview"></div>
                  <span>Dark</span>
                </div>
                <div class="theme-card" [class.selected]="currentTheme === 'ocean'" (click)="selectTheme('ocean')">
                  <div class="theme-preview ocean-preview"></div>
                  <span>Ocean</span>
                </div>
                <div class="theme-card" [class.selected]="currentTheme === 'sunset'" (click)="selectTheme('sunset')">
                  <div class="theme-preview sunset-preview"></div>
                  <span>Sunset</span>
                </div>
              </div>
              
              <div class="setting-row">
                <div class="setting-info">
                  <label>Font Size</label>
                  <span class="setting-desc">Adjust text size for better readability</span>
                </div>
                <select [(ngModel)]="fontSize" (change)="saveSettings()" class="modern-select">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div class="setting-row">
                <div class="setting-info">
                  <label>Animation Speed</label>
                  <span class="setting-desc">Control interface animation speed</span>
                </div>
                <div class="slider-container">
                  <input type="range" min="0.5" max="2" step="0.1" [(ngModel)]="animationSpeed" (change)="saveSettings()" class="modern-slider">
                  <span class="slider-value">{{animationSpeed}}x</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Notifications Tab -->
          <div class="tab-content" *ngIf="activeTab === 'notifications'">
            <div class="content-section">
              <h3 class="section-title">🔔 Notification Preferences</h3>
              
              <div class="notification-card">
                <div class="notification-header">
                  <svg viewBox="0 0 24 24" class="notification-icon">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" fill="currentColor"/>
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" fill="currentColor"/>
                  </svg>
                  <div>
                    <h4>Email Notifications</h4>
                    <p>Receive booking confirmations and updates</p>
                  </div>
                  <label class="modern-toggle">
                    <input type="checkbox" [(ngModel)]="emailNotifications" (change)="saveSettings()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="notification-card">
                <div class="notification-header">
                  <svg viewBox="0 0 24 24" class="notification-icon">
                    <path d="M10.5 1.875a1.125 1.125 0 012.25 0v2.438a1.125 1.125 0 01-2.25 0V1.875zM6 6a6 6 0 1112 0c0 3.314-2.686 6-6 6s-6-2.686-6-6zM4.5 10.5a1.125 1.125 0 000 2.25h2.438a1.125 1.125 0 000-2.25H4.5z" fill="currentColor"/>
                  </svg>
                  <div>
                    <h4>SMS Alerts</h4>
                    <p>Get flight status updates via SMS</p>
                  </div>
                  <label class="modern-toggle">
                    <input type="checkbox" [(ngModel)]="smsAlerts" (change)="saveSettings()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
              
              <div class="notification-card">
                <div class="notification-header">
                  <svg viewBox="0 0 24 24" class="notification-icon">
                    <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 6.242C2.119 8.977 2.119 9.023 2.385 9.5h1.615a.75.75 0 000-1.5H3.5c-.192 0-.384-.007-.576-.022a8.219 8.219 0 011.926-4.478z" fill="currentColor"/>
                  </svg>
                  <div>
                    <h4>Push Notifications</h4>
                    <p>Real-time alerts on your device</p>
                  </div>
                  <label class="modern-toggle">
                    <input type="checkbox" [(ngModel)]="pushNotifications" (change)="saveSettings()">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Preferences Tab -->
          <div class="tab-content" *ngIf="activeTab === 'preferences'">
            <div class="content-section">
              <h3 class="section-title">🌍 Regional Settings</h3>
              
              <div class="preference-grid">
                <div class="preference-card">
                  <div class="preference-icon">💰</div>
                  <h4>Currency</h4>
                  <select [(ngModel)]="currency" (change)="saveSettings()" class="modern-select">
                    <option value="INR">₹ Indian Rupee</option>
                    <option value="USD">$ US Dollar</option>
                    <option value="EUR">€ Euro</option>
                    <option value="GBP">£ British Pound</option>
                    <option value="JPY">¥ Japanese Yen</option>
                    <option value="CAD">C$ Canadian Dollar</option>
                  </select>
                </div>
                
                <div class="preference-card">
                  <div class="preference-icon">🌐</div>
                  <h4>Language</h4>
                  <select [(ngModel)]="language" (change)="saveSettings()" class="modern-select">
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
                
                <div class="preference-card">
                  <div class="preference-icon">🕐</div>
                  <h4>Time Zone</h4>
                  <select [(ngModel)]="timeZone" (change)="saveSettings()" class="modern-select">
                    <option value="IST">India Standard Time</option>
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
                
                <div class="preference-card">
                  <div class="preference-icon">📅</div>
                  <h4>Date Format</h4>
                  <select [(ngModel)]="dateFormat" (change)="saveSettings()" class="modern-select">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Flight Tab -->
          <div class="tab-content" *ngIf="activeTab === 'flight'">
            <div class="content-section">
              <h3 class="section-title">✈️ Flight Preferences</h3>
              
              <div class="flight-preferences">
                <div class="class-selection">
                  <h4>Preferred Class</h4>
                  <div class="class-options">
                    <div class="class-option" [class.selected]="preferredClass === 'economy'" (click)="preferredClass = 'economy'; saveSettings()">
                      <div class="class-icon">🪑</div>
                      <span>Economy</span>
                    </div>
                    <div class="class-option" [class.selected]="preferredClass === 'business'" (click)="preferredClass = 'business'; saveSettings()">
                      <div class="class-icon">🛋️</div>
                      <span>Business</span>
                    </div>
                    <div class="class-option" [class.selected]="preferredClass === 'first'" (click)="preferredClass = 'first'; saveSettings()">
                      <div class="class-icon">👑</div>
                      <span>First Class</span>
                    </div>
                  </div>
                </div>
                
                <div class="seat-selection">
                  <h4>Seat Preference</h4>
                  <div class="seat-options">
                    <div class="seat-option" [class.selected]="seatPreference === 'window'" (click)="seatPreference = 'window'; saveSettings()">
                      <div class="seat-icon">🪟</div>
                      <span>Window</span>
                    </div>
                    <div class="seat-option" [class.selected]="seatPreference === 'aisle'" (click)="seatPreference = 'aisle'; saveSettings()">
                      <div class="seat-icon">🚶</div>
                      <span>Aisle</span>
                    </div>
                    <div class="seat-option" [class.selected]="seatPreference === 'middle'" (click)="seatPreference = 'middle'; saveSettings()">
                      <div class="seat-icon">🪑</div>
                      <span>Middle</span>
                    </div>
                  </div>
                </div>
                
                <div class="meal-preference">
                  <h4>Meal Preference</h4>
                  <select [(ngModel)]="mealPreference" (change)="saveSettings()" class="modern-select">
                    <option value="none">No Preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="halal">Halal</option>
                    <option value="kosher">Kosher</option>
                    <option value="gluten-free">Gluten Free</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Security Tab -->
          <div class="tab-content" *ngIf="activeTab === 'security'">
            <div class="content-section">
              <h3 class="section-title">🔒 Security & Privacy</h3>
              
              <div class="security-options">
                <div class="security-card">
                  <div class="security-header">
                    <svg viewBox="0 0 24 24" class="security-icon">
                      <path d="M12 1l3 6 6 .75-4.5 4.25L18 18l-6-3.25L6 18l1.5-6.25L3 7.75 9 7l3-6z" fill="currentColor"/>
                    </svg>
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add extra security to your account</p>
                    </div>
                    <label class="modern-toggle">
                      <input type="checkbox" [(ngModel)]="twoFactorAuth" (change)="saveSettings()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div class="security-card">
                  <div class="security-header">
                    <svg viewBox="0 0 24 24" class="security-icon">
                      <path d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V5.625z" fill="currentColor"/>
                    </svg>
                    <div>
                      <h4>Save Payment Methods</h4>
                      <p>Securely store cards for faster checkout</p>
                    </div>
                    <label class="modern-toggle">
                      <input type="checkbox" [(ngModel)]="savePaymentMethods" (change)="saveSettings()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
                
                <div class="security-card">
                  <div class="security-header">
                    <svg viewBox="0 0 24 24" class="security-icon">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" fill="currentColor"/>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="currentColor"/>
                    </svg>
                    <div>
                      <h4>Privacy Mode</h4>
                      <p>Hide sensitive information in public</p>
                    </div>
                    <label class="modern-toggle">
                      <input type="checkbox" [(ngModel)]="privacyMode" (change)="saveSettings()">
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="advanced-settings-footer">
          <button class="reset-btn" (click)="resetSettings()">🔄 Reset to Default</button>
          <button class="save-btn" (click)="saveAndClose()">
            <svg viewBox="0 0 24 24" class="save-icon">
              <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A1.875 1.875 0 0119.125 7.125v12.652c0 1.035-.84 1.875-1.875 1.875H5.25a1.875 1.875 0 01-1.875-1.875V5.25c0-1.036.84-1.875 1.875-1.875z" fill="currentColor"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .advanced-settings-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9));
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(20px);
      padding: 1rem;
    }

    .settings-bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      pointer-events: none;
    }

    .advanced-settings-modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 1000px;
      max-height: 90vh;
      overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.3);
      animation: advancedModalSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }

    .advanced-settings-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .advanced-settings-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="30" cy="5" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="15" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="70" cy="8" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="90" cy="12" r="1" fill="%23ffffff" opacity="0.1"/></svg>');
    }

    .header-animation {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .settings-gear {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .header-content {
      flex: 1;
      z-index: 2;
    }

    .settings-title {
      font-size: 2rem;
      font-weight: 900;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .settings-subtitle {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
    }

    .advanced-close-btn {
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      color: white;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      z-index: 2;
    }

    .advanced-close-btn:hover {
      background: rgba(255,255,255,0.25);
      transform: scale(1.1) rotate(90deg);
    }

    .close-icon {
      width: 20px;
      height: 20px;
    }

    .settings-tabs {
      display: flex;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 1rem 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: #64748b;
      white-space: nowrap;
      border-bottom: 3px solid transparent;
    }

    .tab-btn:hover {
      background: rgba(102,126,234,0.1);
      color: #667eea;
    }

    .tab-btn.active {
      background: white;
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-icon {
      width: 18px;
      height: 18px;
    }

    .advanced-settings-content {
      padding: 2rem;
      max-height: 60vh;
      overflow-y: auto;
    }

    .tab-content {
      animation: tabSlide 0.3s ease-out;
    }

    .content-section {
      max-width: 800px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 2rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .theme-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .theme-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .theme-card.selected {
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
    }

    .theme-preview {
      width: 60px;
      height: 40px;
      border-radius: 8px;
      margin: 0 auto 0.5rem;
    }

    .light-preview { background: linear-gradient(135deg, #ffffff, #f1f5f9); }
    .dark-preview { background: linear-gradient(135deg, #1a202c, #2d3748); }
    .ocean-preview { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
    .sunset-preview { background: linear-gradient(135deg, #f97316, #ea580c); }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .setting-info label {
      font-weight: 700;
      color: #2d3748;
      display: block;
      margin-bottom: 0.25rem;
    }

    .setting-desc {
      font-size: 0.875rem;
      color: #64748b;
    }

    .modern-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      background: white;
      color: #2d3748;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 150px;
    }

    .modern-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
    }

    .slider-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .modern-slider {
      width: 120px;
      height: 6px;
      border-radius: 3px;
      background: #e2e8f0;
      outline: none;
      cursor: pointer;
    }

    .modern-slider::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #667eea;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(102,126,234,0.3);
    }

    .slider-value {
      font-weight: 700;
      color: #667eea;
      min-width: 40px;
    }

    .notification-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    .notification-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102,126,234,0.1);
    }

    .notification-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notification-icon {
      width: 24px;
      height: 24px;
      color: #667eea;
      flex-shrink: 0;
    }

    .notification-header div {
      flex: 1;
    }

    .notification-header h4 {
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
    }

    .notification-header p {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    .modern-toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .modern-toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #e2e8f0;
      transition: 0.3s;
      border-radius: 24px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    input:checked + .toggle-slider {
      background-color: #667eea;
    }

    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .preference-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .preference-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .preference-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .preference-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .preference-card h4 {
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 1rem 0;
    }

    .class-options, .seat-options {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .class-option, .seat-option {
      flex: 1;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .class-option:hover, .seat-option:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }

    .class-option.selected, .seat-option.selected {
      border-color: #667eea;
      background: rgba(102,126,234,0.1);
    }

    .class-icon, .seat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .security-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .security-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }

    .security-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102,126,234,0.1);
    }

    .security-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .security-icon {
      width: 24px;
      height: 24px;
      color: #667eea;
      flex-shrink: 0;
    }

    .security-header div {
      flex: 1;
    }

    .security-header h4 {
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
    }

    .security-header p {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0;
    }

    .advanced-settings-footer {
      background: #f8fafc;
      padding: 1.5rem 2rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .reset-btn {
      background: white;
      border: 2px solid #e2e8f0;
      color: #64748b;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .reset-btn:hover {
      border-color: #f87171;
      color: #ef4444;
    }

    .save-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }

    .save-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }

    .save-icon {
      width: 18px;
      height: 18px;
    }

    @keyframes advancedModalSlide {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes tabSlide {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Dark Mode */
    body.theme-dark .advanced-settings-modal {
      background: #1a202c;
      color: #f7fafc;
    }

    body.theme-dark .settings-tabs {
      background: #2d3748;
      border-color: #4a5568;
    }

    body.theme-dark .tab-btn {
      color: #a0aec0;
    }

    body.theme-dark .tab-btn.active {
      background: #1a202c;
      color: #667eea;
    }

    body.theme-dark .section-title {
      color: #f7fafc;
    }

    body.theme-dark .theme-card,
    body.theme-dark .notification-card,
    body.theme-dark .preference-card,
    body.theme-dark .class-option,
    body.theme-dark .seat-option,
    body.theme-dark .security-card {
      background: #2d3748;
      border-color: #4a5568;
    }

    body.theme-dark .modern-select {
      background: #374151;
      color: #f7fafc;
      border-color: #4a5568;
    }

    body.theme-dark .advanced-settings-footer {
      background: #2d3748;
      border-color: #4a5568;
    }

    body.theme-dark .reset-btn {
      background: #374151;
      border-color: #4a5568;
      color: #a0aec0;
    }

    @media (max-width: 768px) {
      .advanced-settings-modal {
        width: 95%;
        max-height: 95vh;
      }

      .advanced-settings-header {
        padding: 1.5rem;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .header-animation {
        width: 50px;
        height: 50px;
      }

      .settings-title {
        font-size: 1.5rem;
      }

      .settings-tabs {
        flex-wrap: wrap;
      }

      .tab-btn {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }

      .advanced-settings-content {
        padding: 1rem;
      }

      .theme-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .preference-grid {
        grid-template-columns: 1fr;
      }

      .class-options, .seat-options {
        flex-direction: column;
      }

      .setting-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .modern-select {
        width: 100%;
      }

      .advanced-settings-footer {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .save-btn, .reset-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class SettingsModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() themeChange = new EventEmitter<string>();

  activeTab = 'appearance';
  currentTheme = 'light';
  fontSize = 'medium';
  animationSpeed = 1;
  emailNotifications = true;
  smsAlerts = false;
  pushNotifications = true;
  currency = 'INR';
  language = 'en';
  timeZone = 'IST';
  dateFormat = 'DD/MM/YYYY';
  preferredClass = 'economy';
  seatPreference = 'window';
  mealPreference = 'none';
  twoFactorAuth = false;
  savePaymentMethods = true;
  privacyMode = false;

  ngOnInit() {
    this.loadSettings();
  }

  selectTheme(theme: string) {
    this.currentTheme = theme;
    this.changeTheme();
  }

  changeTheme() {
    document.body.className = `theme-${this.currentTheme}`;
    this.themeChange.emit(this.currentTheme);
    this.saveSettings();
  }

  resetSettings() {
    this.currentTheme = 'light';
    this.fontSize = 'medium';
    this.animationSpeed = 1;
    this.emailNotifications = true;
    this.smsAlerts = false;
    this.pushNotifications = true;
    this.currency = 'INR';
    this.language = 'en';
    this.timeZone = 'IST';
    this.dateFormat = 'DD/MM/YYYY';
    this.preferredClass = 'economy';
    this.seatPreference = 'window';
    this.mealPreference = 'none';
    this.twoFactorAuth = false;
    this.savePaymentMethods = true;
    this.privacyMode = false;
    this.saveSettings();
  }

  saveSettings() {
    const settings = {
      theme: this.currentTheme,
      fontSize: this.fontSize,
      animationSpeed: this.animationSpeed,
      emailNotifications: this.emailNotifications,
      smsAlerts: this.smsAlerts,
      pushNotifications: this.pushNotifications,
      currency: this.currency,
      language: this.language,
      timeZone: this.timeZone,
      dateFormat: this.dateFormat,
      preferredClass: this.preferredClass,
      seatPreference: this.seatPreference,
      mealPreference: this.mealPreference,
      twoFactorAuth: this.twoFactorAuth,
      savePaymentMethods: this.savePaymentMethods,
      privacyMode: this.privacyMode
    };
    localStorage.setItem('flightAppSettings', JSON.stringify(settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('flightAppSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      this.currentTheme = settings.theme || 'light';
      this.fontSize = settings.fontSize || 'medium';
      this.animationSpeed = settings.animationSpeed || 1;
      this.emailNotifications = settings.emailNotifications ?? true;
      this.smsAlerts = settings.smsAlerts ?? false;
      this.pushNotifications = settings.pushNotifications ?? true;
      this.currency = settings.currency || 'INR';
      this.language = settings.language || 'en';
      this.timeZone = settings.timeZone || 'IST';
      this.dateFormat = settings.dateFormat || 'DD/MM/YYYY';
      this.preferredClass = settings.preferredClass || 'economy';
      this.seatPreference = settings.seatPreference || 'window';
      this.mealPreference = settings.mealPreference || 'none';
      this.twoFactorAuth = settings.twoFactorAuth ?? false;
      this.savePaymentMethods = settings.savePaymentMethods ?? true;
      this.privacyMode = settings.privacyMode ?? false;
    }
  }

  closeModal() {
    this.close.emit();
  }

  saveAndClose() {
    this.saveSettings();
    this.close.emit();
  }
}