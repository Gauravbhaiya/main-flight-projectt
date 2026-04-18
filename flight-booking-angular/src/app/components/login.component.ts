import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../models/user.model';

@Component({
  selector: 'app-login',
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
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to your account to continue your journey</p>
          </div>
          
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input type="text" [(ngModel)]="credentials.username" name="username" 
                       class="auth-input" placeholder=" " required>
                <label class="floating-label">Username</label>
              </div>
            </div>
            
            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input type="password" [(ngModel)]="credentials.password" name="password" 
                       class="auth-input" placeholder=" " required>
                <label class="floating-label">Password</label>
              </div>
            </div>
            
            <button type="submit" [disabled]="!loginForm.valid || loading" class="auth-btn">
              <span *ngIf="!loading" class="btn-content">
                <span class="btn-icon">🚀</span>
                <span class="btn-text">Sign In</span>
              </span>
              <span *ngIf="loading" class="btn-loading">
                <span class="spinner"></span>
                <span>Signing in...</span>
              </span>
            </button>
            
            <div *ngIf="error" class="error-message">
              <span class="error-icon">⚠️</span>
              <span>{{error}}</span>
            </div>
          </form>
          
          <div class="auth-footer">
            <p class="auth-link">
              Don't have an account? 
              <a routerLink="/register" class="link">Create one here</a>
            </p>
          </div>
          
          <div class="demo-section">
            <div class="demo-header">
              <span class="demo-icon">🎯</span>
              <span class="demo-title">Demo Credentials</span>
            </div>
            <div class="demo-credentials">
              <div class="demo-item">
                <span class="demo-label">Username:</span>
                <span class="demo-value">user</span>
              </div>
              <div class="demo-item">
                <span class="demo-label">Password:</span>
                <span class="demo-value">password</span>
              </div>
            </div>
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
      max-width: 450px;
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
    
    .auth-input {
      width: 100%;
      padding: 16px 16px 16px 50px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .auth-input:focus {
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
      margin-bottom: 2rem;
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
    
    .demo-section {
      background: #f7fafc;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    
    .demo-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .demo-title {
      font-weight: 600;
      color: #2d3748;
    }
    
    .demo-credentials {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .demo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .demo-label {
      color: #666;
      font-size: 0.875rem;
    }
    
    .demo-value {
      font-family: monospace;
      background: #e2e8f0;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.875rem;
      color: #2d3748;
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
    }
  `]
})
export class LoginComponent {
  credentials: LoginDTO = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.error = error;
      }
    });
  }
}