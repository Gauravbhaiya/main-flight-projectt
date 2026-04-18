import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upgrade-modal',
  template: `
    <div class="upgrade-overlay" *ngIf="show" (click)="closeModal()">
      <!-- Animated Background -->
      <svg class="upgrade-bg-animation" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="upgradeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(102,126,234,0.4)">
              <animate attributeName="stop-color" values="rgba(102,126,234,0.4);rgba(118,75,162,0.4);rgba(102,126,234,0.4)" dur="4s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stop-color="rgba(118,75,162,0.4)">
              <animate attributeName="stop-color" values="rgba(118,75,162,0.4);rgba(102,126,234,0.4);rgba(118,75,162,0.4)" dur="4s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        <circle cx="300" cy="200" r="80" fill="url(#upgradeGrad1)" opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0; 40,-30; 0,0" dur="6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="900" cy="400" r="100" fill="rgba(118,75,162,0.3)" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; -30,50; 0,0" dur="8s" repeatCount="indefinite"/>
        </circle>
      </svg>
      
      <div class="upgrade-modal" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="upgrade-header">
          <div class="crown-animation">
            <svg class="crown-icon" viewBox="0 0 100 100">
              <path d="M20,70 L25,40 L35,50 L50,30 L65,50 L75,40 L80,70 Z" fill="#667eea" stroke="#764ba2" stroke-width="2">
                <animate attributeName="fill" values="#667eea;#764ba2;#667eea" dur="2s" repeatCount="indefinite"/>
              </path>
              <circle cx="25" cy="40" r="3" fill="#FF6B6B"/>
              <circle cx="50" cy="30" r="4" fill="#4ECDC4"/>
              <circle cx="75" cy="40" r="3" fill="#45B7D1"/>
            </svg>
          </div>
          <div class="header-content">
            <h1 class="upgrade-title">Upgrade to Premium</h1>
            <p class="upgrade-subtitle">Unlock exclusive features and premium benefits</p>
          </div>
          <button class="close-btn" (click)="closeModal()">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Plans Section -->
        <div class="plans-section">
          <div class="plans-grid">
            <!-- Basic Plan -->
            <div class="plan-card basic-plan">
              <div class="plan-header">
                <h3>Basic</h3>
                <div class="plan-price">
                  <span class="currency">₹</span>
                  <span class="amount">0</span>
                  <span class="period">/month</span>
                </div>
                <p class="plan-desc">Perfect for occasional travelers</p>
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Basic flight search</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Standard booking</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Email support</span>
                </div>
                <div class="feature-item disabled">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" stroke-width="2"/>
                  </svg>
                  <span>Priority support</span>
                </div>
              </div>
              <button class="plan-btn current-plan">Current Plan</button>
            </div>
            
            <!-- Premium Plan -->
            <div class="plan-card premium-plan popular">
              <div class="popular-badge">Most Popular</div>
              <div class="plan-header">
                <h3>Premium</h3>
                <div class="plan-price">
                  <span class="currency">₹</span>
                  <span class="amount">999</span>
                  <span class="period">/month</span>
                </div>
                <p class="plan-desc">Best for frequent travelers</p>
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Advanced flight search</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Priority booking</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>24/7 priority support</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Exclusive deals & discounts</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Lounge access</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Free cancellation</span>
                </div>
              </div>
              <button class="plan-btn upgrade-btn" (click)="selectPlan('premium')">Upgrade Now</button>
            </div>
            
            <!-- Enterprise Plan -->
            <div class="plan-card enterprise-plan">
              <div class="plan-header">
                <h3>Enterprise</h3>
                <div class="plan-price">
                  <span class="currency">₹</span>
                  <span class="amount">2999</span>
                  <span class="period">/month</span>
                </div>
                <p class="plan-desc">For business travelers</p>
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Everything in Premium</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Corporate booking tools</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Dedicated account manager</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>Custom reporting</span>
                </div>
                <div class="feature-item">
                  <svg class="feature-icon" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" stroke="#10b981" stroke-width="2" fill="none"/>
                  </svg>
                  <span>API access</span>
                </div>
              </div>
              <button class="plan-btn enterprise-btn" (click)="selectPlan('enterprise')">Contact Sales</button>
            </div>
          </div>
        </div>
        
        <!-- Features Comparison -->
        <div class="features-comparison">
          <h2 class="comparison-title">Feature Comparison</h2>
          <div class="comparison-table">
            <div class="table-header">
              <div class="feature-col">Features</div>
              <div class="plan-col">Basic</div>
              <div class="plan-col">Premium</div>
              <div class="plan-col">Enterprise</div>
            </div>
            
            <div class="table-row" *ngFor="let feature of comparisonFeatures">
              <div class="feature-col">
                <span class="feature-name">{{feature.name}}</span>
                <span class="feature-desc">{{feature.description}}</span>
              </div>
              <div class="plan-col">
                <span class="feature-value" [class]="getFeatureClass(feature.basic)">{{feature.basic}}</span>
              </div>
              <div class="plan-col">
                <span class="feature-value" [class]="getFeatureClass(feature.premium)">{{feature.premium}}</span>
              </div>
              <div class="plan-col">
                <span class="feature-value" [class]="getFeatureClass(feature.enterprise)">{{feature.enterprise}}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Benefits Section -->
        <div class="benefits-section">
          <h2 class="benefits-title">Why Upgrade?</h2>
          <div class="benefits-grid">
            <div class="benefit-card">
              <div class="benefit-icon">🚀</div>
              <h3>Priority Access</h3>
              <p>Skip the queue with priority booking and faster check-in</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">💰</div>
              <h3>Exclusive Deals</h3>
              <p>Access to member-only discounts and special offers</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">🏆</div>
              <h3>Premium Support</h3>
              <p>24/7 dedicated support with instant response</p>
            </div>
            <div class="benefit-card">
              <div class="benefit-icon">🎯</div>
              <h3>Smart Recommendations</h3>
              <p>AI-powered flight suggestions based on your preferences</p>
            </div>
          </div>
        </div>
        
        <!-- Testimonials -->
        <div class="testimonials-section">
          <h2 class="testimonials-title">What Our Premium Users Say</h2>
          <div class="testimonials-grid">
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"The premium features saved me hours of searching. The exclusive deals alone pay for the subscription!"</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">S</div>
                <div class="author-info">
                  <span class="author-name">Sarah Johnson</span>
                  <span class="author-title">Business Traveler</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card">
              <div class="testimonial-content">
                <p>"Priority support is amazing. They resolved my booking issue in minutes, not hours."</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">M</div>
                <div class="author-info">
                  <span class="author-name">Mike Chen</span>
                  <span class="author-title">Frequent Flyer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="upgrade-footer">
          <div class="footer-content">
            <div class="guarantee">
              <svg class="guarantee-icon" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#10b981" stroke-width="2" fill="none"/>
              </svg>
              <span>30-day money-back guarantee</span>
            </div>
            <div class="security">
              <svg class="security-icon" viewBox="0 0 24 24">
                <path d="M12 1l3 6 6 .75-4.5 4.25L18 18l-6-3.25L6 18l1.5-6.25L3 7.75 9 7l3-6z" stroke="#667eea" stroke-width="2" fill="none"/>
              </svg>
              <span>Secure payment processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .upgrade-overlay {
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
      overflow-y: auto;
    }

    .upgrade-bg-animation {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.3;
      pointer-events: none;
    }

    .upgrade-modal {
      background: white;
      border-radius: 24px;
      width: 100%;
      max-width: 1200px;
      max-height: 95vh;
      overflow-y: auto;
      box-shadow: 0 30px 80px rgba(0,0,0,0.3);
      animation: upgradeModalSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }

    .upgrade-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      color: white;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .crown-animation {
      width: 60px;
      height: 60px;
      flex-shrink: 0;
    }

    .crown-icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
    }

    .header-content {
      flex: 1;
    }

    .upgrade-title {
      font-size: 2rem;
      font-weight: 900;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .upgrade-subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin: 0;
    }

    .close-btn {
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
    }

    .close-btn:hover {
      background: rgba(255,255,255,0.25);
      transform: scale(1.1) rotate(90deg);
    }

    .close-icon {
      width: 20px;
      height: 20px;
    }

    .plans-section {
      padding: 3rem 2rem;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .plan-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .plan-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .premium-plan {
      border-color: #667eea;
      box-shadow: 0 8px 32px rgba(102,126,234,0.2);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }

    .plan-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .plan-header h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 1rem 0;
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
      margin-bottom: 1rem;
    }

    .currency {
      font-size: 1.5rem;
      font-weight: 600;
      color: #667eea;
    }

    .amount {
      font-size: 3rem;
      font-weight: 900;
      color: #2d3748;
    }

    .period {
      font-size: 1rem;
      color: #64748b;
    }

    .plan-desc {
      color: #64748b;
      margin: 0;
    }

    .plan-features {
      margin-bottom: 2rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .feature-item:last-child {
      border-bottom: none;
    }

    .feature-item.disabled {
      opacity: 0.5;
    }

    .feature-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .plan-btn {
      width: 100%;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }

    .current-plan {
      background: #e2e8f0;
      color: #64748b;
      cursor: not-allowed;
    }

    .upgrade-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 15px rgba(102,126,234,0.3);
    }

    .upgrade-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102,126,234,0.4);
    }

    .enterprise-btn {
      background: linear-gradient(135deg, #764ba2, #667eea);
      color: white;
      box-shadow: 0 4px 15px rgba(118,75,162,0.3);
    }

    .enterprise-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(118,75,162,0.4);
    }

    .features-comparison {
      padding: 3rem 2rem;
      background: #f8fafc;
    }

    .comparison-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 2rem 0;
    }

    .comparison-table {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .table-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      font-weight: 700;
      padding: 1rem;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .feature-col {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .feature-name {
      font-weight: 600;
      color: #2d3748;
    }

    .feature-desc {
      font-size: 0.875rem;
      color: #64748b;
    }

    .plan-col {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .feature-value {
      font-weight: 600;
    }

    .feature-value.yes {
      color: #10b981;
    }

    .feature-value.no {
      color: #ef4444;
    }

    .feature-value.limited {
      color: #f59e0b;
    }

    .benefits-section {
      padding: 3rem 2rem;
    }

    .benefits-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 2rem 0;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .benefit-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .benefit-card:hover {
      border-color: #667eea;
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(102,126,234,0.2);
    }

    .benefit-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .benefit-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 1rem 0;
    }

    .benefit-card p {
      color: #64748b;
      margin: 0;
      line-height: 1.6;
    }

    .testimonials-section {
      padding: 3rem 2rem;
      background: #f8fafc;
    }

    .testimonials-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 800;
      color: #2d3748;
      margin: 0 0 2rem 0;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }

    .testimonial-content {
      margin-bottom: 1.5rem;
    }

    .testimonial-content p {
      font-style: italic;
      color: #4a5568;
      margin: 0;
      line-height: 1.6;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
    }

    .author-name {
      font-weight: 700;
      color: #2d3748;
      display: block;
    }

    .author-title {
      font-size: 0.875rem;
      color: #64748b;
    }

    .upgrade-footer {
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 2rem;
      color: white;
    }

    .footer-content {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .guarantee, .security {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .guarantee-icon, .security-icon {
      width: 24px;
      height: 24px;
    }

    @keyframes upgradeModalSlide {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Dark Mode Support */
    body.theme-dark .upgrade-modal {
      background: #1a202c;
      color: #f7fafc;
    }

    body.theme-dark .plan-card {
      background: #2d3748 !important;
      border-color: #4a5568 !important;
    }

    body.theme-dark .plan-card.basic-plan {
      background: #2d3748 !important;
      border-color: #4a5568 !important;
    }

    body.theme-dark .upgrade-modal .basic-plan {
      background: #2d3748 !important;
      border-color: #4a5568 !important;
    }

    /* Comprehensive Dark Mode Text Visibility */
    body.theme-dark .upgrade-modal,
    body.theme-dark .upgrade-modal *,
    body.theme-dark .upgrade-modal h1,
    body.theme-dark .upgrade-modal h2,
    body.theme-dark .upgrade-modal h3,
    body.theme-dark .upgrade-modal h4,
    body.theme-dark .upgrade-modal p,
    body.theme-dark .upgrade-modal span,
    body.theme-dark .upgrade-modal div {
      color: #f7fafc !important;
    }

    body.theme-dark .upgrade-modal .upgrade-header {
      color: white !important;
    }

    body.theme-dark .upgrade-modal .upgrade-header * {
      color: white !important;
    }

    /* Dark Mode Background Changes */
    body.theme-dark .upgrade-overlay {
      background: linear-gradient(135deg, rgba(26,32,44,0.9), rgba(45,55,72,0.9)) !important;
    }

    body.theme-dark .upgrade-modal {
      background: #1a202c !important;
    }

    body.theme-dark .plans-section {
      background: #000000 !important;
    }

    body.theme-dark .features-comparison {
      background: #2d3748 !important;
    }

    body.theme-dark .benefits-section {
      background: #1a202c !important;
    }

    body.theme-dark .testimonials-section {
      background: #2d3748 !important;
    }

    body.theme-dark .upgrade-footer {
      background: linear-gradient(135deg, #2d3748, #1a202c) !important;
    }

    body.theme-dark .plan-header h3,
    body.theme-dark .amount,
    body.theme-dark .comparison-title,
    body.theme-dark .benefits-title,
    body.theme-dark .testimonials-title,
    body.theme-dark .feature-name,
    body.theme-dark .benefit-card h3,
    body.theme-dark .author-name {
      color: #000000 !important;
    }

    body.theme-dark .plan-desc,
    body.theme-dark .feature-desc,
    body.theme-dark .benefit-card p,
    body.theme-dark .testimonial-content p,
    body.theme-dark .author-title {
      color: #333333 !important;
    }

    body.theme-dark .features-comparison {
      background: #2d3748;
    }

    body.theme-dark .comparison-table {
      background: #1a202c;
    }

    body.theme-dark .table-row {
      border-color: #4a5568;
    }

    body.theme-dark .benefit-card,
    body.theme-dark .testimonial-card {
      background: #2d3748;
      border-color: #4a5568;
    }

    body.theme-dark .benefit-card:hover {
      border-color: #667eea;
      box-shadow: 0 12px 32px rgba(102,126,234,0.2);
    }

    body.theme-dark .testimonials-section {
      background: #2d3748;
    }

    body.theme-dark .current-plan {
      background: #374151;
      color: #a0aec0;
    }

    body.theme-dark .upgrade-title {
      color: white !important;
    }

    body.theme-dark .upgrade-subtitle {
      color: rgba(255,255,255,0.9) !important;
    }

    body.theme-dark .currency {
      color: #000000 !important;
    }

    body.theme-dark .period {
      color: #333333 !important;
    }

    body.theme-dark .feature-item span {
      color: #000000 !important;
    }

    body.theme-dark .feature-value {
      color: #000000 !important;
    }

    body.theme-dark .table-header {
      color: white !important;
    }

    body.theme-dark .guarantee span,
    body.theme-dark .security span {
      color: white !important;
    }

    body.theme-dark .footer-content {
      color: white !important;
    }

    body.theme-dark .plan-header h3 {
      color: #000000 !important;
    }

    body.theme-dark .plan-price .amount {
      color: #000000 !important;
    }

    body.theme-dark .plan-desc {
      color: #333333 !important;
    }

    body.theme-dark .feature-item {
      color: #000000 !important;
    }

    body.theme-dark h1,
    body.theme-dark h2,
    body.theme-dark h3,
    body.theme-dark h4 {
      color: #000000 !important;
    }

    body.theme-dark .upgrade-overlay {
      color: #000000 !important;
    }

    body.theme-dark .upgrade-overlay * {
      color: #000000 !important;
    }

    body.theme-dark .upgrade-overlay .plan-desc,
    body.theme-dark .upgrade-overlay .feature-desc,
    body.theme-dark .upgrade-overlay .benefit-card p,
    body.theme-dark .upgrade-overlay .testimonial-content p,
    body.theme-dark .upgrade-overlay .author-title {
      color: #333333 !important;
    }

    @media (max-width: 768px) {
      .upgrade-modal {
        width: 95%;
        max-height: 95vh;
      }

      .upgrade-header {
        padding: 1.5rem;
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .crown-animation {
        width: 50px;
        height: 50px;
      }

      .upgrade-title {
        font-size: 1.5rem;
      }

      .plans-section {
        padding: 2rem 1rem;
      }

      .plans-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .table-header, .table-row {
        grid-template-columns: 2fr 1fr 1fr 1fr;
        font-size: 0.875rem;
      }

      .benefits-grid {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
    }
  `]
})
export class UpgradeModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();

  comparisonFeatures = [
    {
      name: 'Flight Search',
      description: 'Search and compare flights',
      basic: 'Basic',
      premium: 'Advanced',
      enterprise: 'Advanced + API'
    },
    {
      name: 'Booking Priority',
      description: 'Priority in booking queue',
      basic: 'No',
      premium: 'Yes',
      enterprise: 'Yes'
    },
    {
      name: 'Customer Support',
      description: 'Support response time',
      basic: 'Email (24h)',
      premium: '24/7 Priority',
      enterprise: 'Dedicated Manager'
    },
    {
      name: 'Exclusive Deals',
      description: 'Access to special offers',
      basic: 'No',
      premium: 'Yes',
      enterprise: 'Yes + Custom'
    },
    {
      name: 'Lounge Access',
      description: 'Airport lounge access',
      basic: 'No',
      premium: 'Yes',
      enterprise: 'Yes + Guest'
    },
    {
      name: 'Free Cancellation',
      description: 'Cancel without fees',
      basic: 'Limited',
      premium: 'Yes',
      enterprise: 'Yes + Flexible'
    },
    {
      name: 'Reporting',
      description: 'Travel analytics',
      basic: 'No',
      premium: 'Basic',
      enterprise: 'Advanced'
    }
  ];

  closeModal() {
    this.close.emit();
  }

  selectPlan(plan: string) {
    console.log('Selected plan:', plan);
    // Handle plan selection
  }

  getFeatureClass(value: string): string {
    if (value === 'Yes' || value === 'Advanced' || value === 'Advanced + API' || value === '24/7 Priority' || value === 'Dedicated Manager' || value === 'Yes + Custom' || value === 'Yes + Guest' || value === 'Yes + Flexible') {
      return 'yes';
    } else if (value === 'No') {
      return 'no';
    } else {
      return 'limited';
    }
  }
}