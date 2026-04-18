import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, Role } from '../models/user.model';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="video-background-container">
          <video class="background-video" autoplay muted loop playsinline>
            <source src="assets/videos/flight-takeoff.mp4" type="video/mp4">
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4" type="video/mp4">
            <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4">
          </video>
          <div class="video-overlay"></div>
          
          <div class="flight-particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
          </div>
          
          <div class="cloud-layer">
            <div class="cloud">☁️</div>
            <div class="cloud">☁️</div>
            <div class="cloud">☁️</div>
          </div>
        </div>
        
        <div class="floating-shapes">
          <div class="shape shape-1">✈️</div>
          <div class="shape shape-2">🌍</div>
          <div class="shape shape-3">☁️</div>
          <div class="shape shape-4">🛫</div>
        </div>
      </div>
      
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="brand">
              <span class="brand-icon">✈️</span>
              <span class="brand-text">SkyBooker</span>
            </div>
            <h1 class="auth-title">Join SkyBooker</h1>
            <p class="auth-subtitle">Create your account and start exploring the world</p>
          </div>
          
          <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
            <div class="form-row">
              <div class="input-group">
                <div class="input-wrapper">
                  <span class="input-icon">👤</span>
                  <input type="text" [(ngModel)]="userData.username" name="username" 
                         class="auth-input" placeholder=" " required>
                  <label class="floating-label">Username</label>
                </div>
              </div>
              
              <div class="input-group">
                <div class="input-wrapper">
                  <span class="input-icon">📝</span>
                  <input type="text" [(ngModel)]="userData.name" name="name" 
                         class="auth-input" placeholder=" " required>
                  <label class="floating-label">Full Name</label>
                </div>
              </div>
            </div>
            
            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input type="email" [(ngModel)]="userData.email" name="email" 
                       class="auth-input" placeholder=" " required>
                <label class="floating-label">Email Address</label>
              </div>
            </div>
            
            
            <div class="form-row">
              <div class="input-group">
                <div class="input-wrapper">
                  <span class="input-icon">🔒</span>
                  <input type="password" [(ngModel)]="userData.password" name="password" 
                         class="auth-input" placeholder=" " required minlength="6">
                  <label class="floating-label">Password</label>
                </div>
              </div>
              
              <div class="input-group">
                <div class="input-wrapper">
                  <span class="input-icon">🏆</span>
                  <select [(ngModel)]="userData.role" name="role" class="auth-select" required>
                    <option value="USER">Traveler</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  <label class="select-label">Account Type</label>
                </div>
              </div>
            </div>
            
            <button type="submit" [disabled]="!registerForm.valid || loading" class="auth-btn">
              <span *ngIf="!loading" class="btn-content">
                <span class="btn-icon">✨</span>
                <span class="btn-text">Create Account</span>
              </span>
              <span *ngIf="loading" class="btn-loading">
                <span class="spinner"></span>
                <span>Creating account...</span>
              </span>
            </button>
            
            <!-- Social Login Divider -->
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">Or continue with</span>
              <span class="divider-line"></span>
            </div>
            
            <!-- Social Login Buttons -->
            <div class="social-login">
              <button type="button" (click)="loginWithGoogle()" class="social-btn google-btn" [disabled]="socialLoading">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              
              <button type="button" (click)="loginWithFacebook()" class="social-btn facebook-btn" [disabled]="socialLoading">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
              
              <button type="button" (click)="loginWithTwitter()" class="social-btn twitter-btn" [disabled]="socialLoading">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#1DA1F2" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </button>
              
              <button type="button" (click)="loginWithGitHub()" class="social-btn github-btn" [disabled]="socialLoading">
                <svg class="social-icon" viewBox="0 0 24 24">
                  <path fill="#333" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>
            </div>
            
            <div *ngIf="message" class="success-message">
              <span class="success-icon">✓</span>
              <span>{{message}}</span>
            </div>
            
            <div *ngIf="error" class="error-message">
              <span class="error-icon">⚠️</span>
              <span>{{error}}</span>
            </div>
          </form>
          
          <div class="auth-footer">
            <p class="auth-link">
              Already have an account? 
              <a routerLink="/login" class="link">Sign in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    .auth-page {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    
    .auth-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -1;
      overflow: hidden;
    }
    
    .video-background-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
    }
    
    .background-video {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 100%;
      min-height: 100%;
      width: auto;
      height: auto;
      transform: translate(-50%, -50%);
      z-index: -3;
      object-fit: cover;
      filter: brightness(0.6) contrast(1.3) saturate(1.1);
    }
    
    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.75) 0%, rgba(118, 75, 162, 0.75) 100%);
      z-index: -2;
      backdrop-filter: blur(1px);
    }
    
    .flight-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: flyParticle 8s linear infinite;
    }
    
    .particle:nth-child(1) { top: 20%; left: -10px; animation-delay: 0s; }
    .particle:nth-child(2) { top: 40%; left: -10px; animation-delay: 2s; }
    .particle:nth-child(3) { top: 60%; left: -10px; animation-delay: 4s; }
    .particle:nth-child(4) { top: 80%; left: -10px; animation-delay: 6s; }
    
    .cloud-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
    
    .cloud {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      font-size: 3rem;
      animation: floatCloud 15s linear infinite;
    }
    
    .cloud:nth-child(1) { top: 10%; animation-delay: 0s; }
    .cloud:nth-child(2) { top: 30%; animation-delay: 5s; }
    .cloud:nth-child(3) { top: 50%; animation-delay: 10s; }
    
    @keyframes flyParticle {
      0% { transform: translateX(0) translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(calc(100vw + 20px)) translateY(-50px); opacity: 0; }
    }
    
    @keyframes floatCloud {
      0% { transform: translateX(-100px); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateX(calc(100vw + 100px)); opacity: 0; }
    }
    
    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .shape {
      position: absolute;
      font-size: 2rem;
      opacity: 0.1;
      animation: float 6s ease-in-out infinite;
    }
    
    .shape-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }
    
    .shape-2 {
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }
    
    .shape-3 {
      bottom: 30%;
      left: 20%;
      animation-delay: 4s;
    }
    
    .shape-4 {
      top: 40%;
      right: 30%;
      animation-delay: 1s;
    }
    
    .auth-container {
      width: 100%;
      max-width: 550px;
      padding: 2rem;
      z-index: 1;
    }
    
    .auth-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideInUp 0.8s ease-out;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    
    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .brand-icon {
      font-size: 2.5rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .brand-text {
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(45deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .auth-title {
      font-size: 2rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }
    
    .auth-subtitle {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }
    
    .auth-form {
      margin-bottom: 2rem;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .input-group {
      margin-bottom: 1.5rem;
    }
    
    .input-wrapper {
      position: relative;
    }
    
    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      z-index: 2;
    }
    
    .auth-input, .auth-select {
      width: 100%;
      padding: 16px 16px 16px 50px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .auth-input:focus, .auth-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .floating-label, .select-label {
      position: absolute;
      left: 50px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.3s ease;
      background: white;
      padding: 0 4px;
    }
    
    .auth-input:focus + .floating-label,
    .auth-input:not(:placeholder-shown) + .floating-label {
      top: 0;
      font-size: 0.75rem;
      color: #667eea;
      font-weight: 500;
    }
    
    .select-label {
      top: 0;
      font-size: 0.75rem;
      color: #667eea;
      font-weight: 500;
    }
    
    .auth-btn {
      width: 100%;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 16px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      margin-bottom: 1rem;
    }
    
    .auth-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
    
    .auth-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .auth-btn:disabled .btn-content {
      opacity: 0.8;
    }
    
    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #c6f6d5;
      color: #22543d;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-top: 1rem;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fed7d7;
      color: #c53030;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-top: 1rem;
    }
    
    .auth-footer {
      text-align: center;
    }
    
    .auth-link {
      color: #666;
      font-size: 0.875rem;
      margin: 0;
    }
    
    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }
    
    .link:hover {
      color: #764ba2;
    }
    
    /* Social Login Styles */
    .divider {
      display: flex;
      align-items: center;
      margin: 2rem 0 1.5rem;
      gap: 1rem;
    }
    
    .divider-line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }
    
    .divider-text {
      color: #666;
      font-size: 0.875rem;
      font-weight: 500;
      white-space: nowrap;
    }
    
    .social-login {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      color: #374151;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .social-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .social-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .social-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    
    .google-btn:hover:not(:disabled) {
      border-color: #4285F4;
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
    }
    
    .facebook-btn:hover:not(:disabled) {
      border-color: #1877F2;
      box-shadow: 0 4px 12px rgba(24, 119, 242, 0.2);
    }
    
    .twitter-btn:hover:not(:disabled) {
      border-color: #1DA1F2;
      box-shadow: 0 4px 12px rgba(29, 161, 242, 0.2);
    }
    
    .github-btn:hover:not(:disabled) {
      border-color: #333;
      box-shadow: 0 4px 12px rgba(51, 51, 51, 0.2);
    }
    
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
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* OTP Verification Styles */
    .send-otp-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .send-otp-btn:hover:not(:disabled) {
      transform: translateY(-50%) scale(1.05);
    }
    
    .send-otp-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .verified-badge {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: #c6f6d5;
      color: #22543d;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    
    .otp-section {
      background: #f8fafc;
      border: 2px solid #667eea;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      animation: slideInDown 0.3s ease;
    }
    
    .otp-input {
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.5rem;
    }
    
    .otp-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    
    .verify-otp-btn {
      flex: 1;
      background: linear-gradient(45deg, #48bb78, #38a169);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .verify-otp-btn:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .verify-otp-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .resend-otp-btn {
      background: #e2e8f0;
      color: #4a5568;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }
    
    .resend-otp-btn:hover:not(:disabled) {
      background: #cbd5e0;
    }
    
    .resend-otp-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .back-btn {
      background: #fed7d7;
      color: #c53030;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }
    
    .back-btn:hover {
      background: #fbb6ce;
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
    
    @media (max-width: 768px) {
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 2rem;
      }
      
      .auth-title {
        font-size: 1.5rem;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .social-login {
        grid-template-columns: 1fr;
      }
      
      .social-btn {
        padding: 14px 16px;
      }
      
      .otp-actions {
        flex-direction: column;
      }
      
      .send-otp-btn {
        position: static;
        transform: none;
        margin-top: 0.5rem;
        width: 100%;
      }
    }
  `]
})
export class RegisterComponent {
  userData: RegisterDTO = {
    username: '',
    name: '',
    email: '',
    password: '',
    role: Role.USER
  };
  loading = false;
  error = '';
  message = '';
  socialLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister() {
    this.loading = true;
    this.error = '';
    this.message = '';
    
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      }
    });
  }
  
  async loginWithGoogle() {
    this.socialLoading = true;
    try {
      if (typeof window !== 'undefined' && (window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Replace with your Google Client ID
          callback: (response: any) => {
            this.handleGoogleResponse(response);
          }
        });
        (window as any).google.accounts.id.prompt();
      } else {
        this.error = 'Google SDK not loaded. Please refresh the page.';
        this.socialLoading = false;
      }
    } catch (error) {
      console.error('Google login error:', error);
      this.error = 'Google login failed. Please try again.';
      this.socialLoading = false;
    }
  }
  
  async loginWithFacebook() {
    this.socialLoading = true;
    try {
      if (typeof window !== 'undefined' && (window as any).FB) {
        (window as any).FB.login((response: any) => {
          if (response.authResponse) {
            (window as any).FB.api('/me', { fields: 'name,email' }, (userInfo: any) => {
              this.handleFacebookResponse(userInfo, response.authResponse);
            });
          } else {
            this.error = 'Facebook login was cancelled.';
            this.socialLoading = false;
          }
        }, { scope: 'email' });
      } else {
        this.error = 'Facebook SDK not loaded. Please refresh the page.';
        this.socialLoading = false;
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      this.error = 'Facebook login failed. Please try again.';
      this.socialLoading = false;
    }
  }
  
  async loginWithTwitter() {
    this.socialLoading = true;
    // Demo Twitter registration
    setTimeout(() => {
      this.handleSocialDemo('Twitter');
    }, 1000);
  }
  
  async loginWithGitHub() {
    this.socialLoading = true;
    // Demo GitHub registration
    setTimeout(() => {
      this.handleSocialDemo('GitHub');
    }, 1000);
  }
  
  handleGoogleResponse(response: any) {
    try {
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const socialUser = {
        username: payload.email.split('@')[0] + '_google',
        name: payload.name,
        email: payload.email,
        password: 'google_oauth_' + Math.random().toString(36),
        role: Role.USER
      };
      
      this.registerSocialUser(socialUser, 'Google');
    } catch (error) {
      console.error('Error parsing Google response:', error);
      this.error = 'Failed to process Google login data.';
      this.socialLoading = false;
    }
  }
  
  handleFacebookResponse(userInfo: any, authResponse: any) {
    const socialUser = {
      username: userInfo.email ? userInfo.email.split('@')[0] + '_facebook' : 'facebook_user_' + Date.now(),
      name: userInfo.name,
      email: userInfo.email || 'no-email@facebook.com',
      password: 'facebook_oauth_' + Math.random().toString(36),
      role: Role.USER
    };
    
    this.registerSocialUser(socialUser, 'Facebook');
  }
  
  registerSocialUser(socialUser: any, provider: string) {
    this.authService.register(socialUser).subscribe({
      next: (response) => {
        this.socialLoading = false;
        this.message = `Account created successfully with ${provider}!`;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.socialLoading = false;
        if (error.includes('already exists')) {
          this.error = `An account with this ${provider} email already exists. Please login instead.`;
        } else {
          this.error = `Error creating account with ${provider}. Please try again.`;
        }
      }
    });
  }
  
  handleSocialDemo(provider: string) {
    // Demo social registration
    const demoUser = {
      username: `${provider.toLowerCase()}_demo_${Date.now()}`,
      name: `${provider} Demo User`,
      email: `demo@${provider.toLowerCase()}.com`,
      password: 'demo123456',
      role: Role.USER
    };
    
    this.authService.register(demoUser).subscribe({
      next: (response) => {
        this.socialLoading = false;
        this.message = `Demo account created with ${provider}!`;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.socialLoading = false;
        this.error = `Error creating demo account`;
      }
    });
  }
}