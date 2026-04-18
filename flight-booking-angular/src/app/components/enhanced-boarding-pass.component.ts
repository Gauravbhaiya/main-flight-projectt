import { Component, Input, OnInit } from '@angular/core';
import { BoardingPass } from '../models/boarding-pass.model';
import { QRCodeService } from '../services/qr-code.service';

@Component({
  selector: 'app-enhanced-boarding-pass',
  template: `
    <div class="boarding-pass-container" *ngFor="let pass of boardingPasses">
      <div class="boarding-pass">
        <!-- Animated Background -->
        <div class="animated-bg">
          <svg class="bg-animation" viewBox="0 0 400 300">
            <defs>
              <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
              <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgGradient)"/>
            <rect width="100%" height="100%" fill="url(#dots)"/>
            <circle class="floating-circle" cx="50" cy="50" r="3" fill="rgba(255,255,255,0.2)">
              <animate attributeName="cy" values="50;40;50" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle class="floating-circle" cx="350" cy="100" r="2" fill="rgba(255,255,255,0.15)">
              <animate attributeName="cx" values="350;360;350" dur="5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="4s" repeatCount="indefinite"/>
            </circle>
            <circle class="floating-circle" cx="200" cy="250" r="4" fill="rgba(255,255,255,0.1)">
              <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <!-- Additional animated elements -->
            <path d="M0,150 Q200,130 400,150" stroke="rgba(255,255,255,0.1)" stroke-width="1" fill="none">
              <animate attributeName="stroke-dasharray" values="0,400;200,200;400,0;0,400" dur="8s" repeatCount="indefinite"/>
            </path>
            <g class="sparkle-group">
              <circle cx="100" cy="80" r="1" fill="rgba(255,255,255,0.6)">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0s"/>
              </circle>
              <circle cx="300" cy="180" r="1" fill="rgba(255,255,255,0.6)">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s"/>
              </circle>
              <circle cx="150" cy="220" r="1" fill="rgba(255,255,255,0.6)">
                <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s"/>
              </circle>
            </g>
          </svg>
        </div>

        <!-- Header Section -->
        <div class="boarding-pass-header">
          <div class="airline-section">
            <div class="airline-logo">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="white" opacity="0.9"/>
                <path d="M12 20 L20 12 L28 20 L20 28 Z" fill="#667eea"/>
              </svg>
            </div>
            <div class="airline-info">
              <h2>{{getAirlineName(pass.flightNumber)}}</h2>
              <div class="flight-number">{{pass.flightNumber}}</div>
            </div>
          </div>
          
          <div class="qr-section">
            <div class="qr-code" [innerHTML]="generateQRCodeSVG(pass.qrCode)"></div>
            <div class="qr-label">{{pass.qrCode.substring(0, 8)}}</div>
          </div>
        </div>

        <!-- Flight Route with Animation -->
        <div class="flight-route">
          <div class="airport-info departure">
            <div class="airport-code">{{pass.origin}}</div>
            <div class="airport-city">{{pass.originCity}}</div>
            <div class="time-info">
              <div class="time">{{pass.departureTime}}</div>
              <div class="label">Departure</div>
            </div>
          </div>
          
          <div class="flight-path">
            <svg class="route-svg" viewBox="0 0 200 60">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#667eea"/>
                  <stop offset="100%" style="stop-color:#764ba2"/>
                </linearGradient>
              </defs>
              <path class="route-line" d="M20 30 Q100 10 180 30" stroke="url(#routeGradient)" stroke-width="3" fill="none"/>
              <g class="plane-group">
                <circle class="plane-dot" cx="20" cy="30" r="4" fill="#667eea">
                  <animateMotion dur="4s" repeatCount="indefinite">
                    <mpath href="#route"/>
                  </animateMotion>
                </circle>
                <circle class="plane-trail" cx="20" cy="30" r="2" fill="rgba(102, 126, 234, 0.3)">
                  <animateMotion dur="4s" repeatCount="indefinite" begin="0.2s">
                    <mpath href="#route"/>
                  </animateMotion>
                </circle>
                <circle class="plane-trail" cx="20" cy="30" r="1" fill="rgba(102, 126, 234, 0.2)">
                  <animateMotion dur="4s" repeatCount="indefinite" begin="0.4s">
                    <mpath href="#route"/>
                  </animateMotion>
                </circle>
              </g>
              <path id="route" d="M20 30 Q100 10 180 30" fill="none"/>
              <text x="100" y="50" text-anchor="middle" fill="#667eea" font-size="10" font-weight="bold">{{pass.aircraft}}</text>
            </svg>
          </div>
          
          <div class="airport-info arrival">
            <div class="airport-code">{{pass.destination}}</div>
            <div class="airport-city">{{pass.destinationCity}}</div>
            <div class="time-info">
              <div class="time">{{pass.arrivalTime}}</div>
              <div class="label">Arrival</div>
            </div>
          </div>
        </div>

        <!-- Passenger Details Grid -->
        <div class="passenger-details">
          <div class="detail-grid">
            <div class="detail-item passenger-name-item">
              <div class="detail-label">Passenger Name</div>
              <div class="detail-value passenger-name">{{pass.passengerName}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Seat</div>
              <div class="detail-value seat-number">{{pass.seatNumber}}</div>
            </div>
            <div class="detail-item class-item">
              <div class="detail-label">Class</div>
              <div class="detail-value class-value">{{pass.class}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Gate</div>
              <div class="detail-value gate-number">{{pass.gate}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Terminal</div>
              <div class="detail-value">{{pass.terminal}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Baggage</div>
              <div class="detail-value">{{pass.baggage}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Boarding Time</div>
              <div class="detail-value boarding-time">{{pass.boardingTime}}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Check-in</div>
              <div class="detail-value">{{pass.checkinTime}}</div>
            </div>
          </div>
        </div>

        <!-- Important Information -->
        <div class="important-info">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">PNR:</span>
              <span class="info-value">{{pass.pnr}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ticket:</span>
              <span class="info-value">{{pass.ticketNumber}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value status" [class]="'status-' + pass.status.toLowerCase()">{{pass.status}}</span>
            </div>
          </div>
        </div>

        <!-- Barcode Section -->
        <div class="barcode-section">
          <div class="barcode" [innerHTML]="generateBarcodeSVG(pass.barcode)"></div>
          <div class="barcode-text">{{pass.barcode}}</div>
        </div>

        <!-- Footer -->
        <div class="boarding-pass-footer">
          <div class="instructions">
            <div class="instruction-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                <path d="M7 3h2v6H7zM7 11h2v2H7z"/>
              </svg>
              <span>Arrive at gate 30 minutes before boarding</span>
            </div>
            <div class="instruction-item">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 2h12v12H2V2zm1 1v10h10V3H3z"/>
                <path d="M5 5h6v2H5V5zM5 8h4v2H5V8z"/>
              </svg>
              <span>Keep this pass until you reach your destination</span>
            </div>
          </div>
        </div>

        <!-- Decorative Elements -->
        <div class="decorative-elements">
          <div class="perforation-left"></div>
          <div class="perforation-right"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boarding-pass-container {
      margin: 30px auto;
      perspective: 1000px;
      width: 100%;
      max-width: 1000px;
      min-height: 600px;
    }

    .boarding-pass {
      position: relative;
      width: 100%;
      max-width: 1000px;
      height: 600px;
      background: white;
      border-radius: 25px;
      box-shadow: 
        0 25px 80px rgba(0,0,0,0.2),
        0 10px 30px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.8);
      overflow: hidden;
      transform-style: preserve-3d;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-weight: 700;
      border: 3px solid rgba(102, 126, 234, 0.1);
      backdrop-filter: blur(10px);
    }

    .boarding-pass:hover {
      transform: rotateY(8deg) rotateX(3deg) translateY(-10px);
      box-shadow: 
        0 35px 100px rgba(0,0,0,0.25),
        0 15px 40px rgba(0,0,0,0.15),
        inset 0 1px 0 rgba(255,255,255,0.9);
    }

    .animated-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .bg-animation {
      width: 100%;
      height: 100%;
    }

    .floating-circle {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-8px) rotate(1deg); }
      66% { transform: translateY(-12px) rotate(-1deg); }
    }

    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.3); }
      50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4); }
    }

    .boarding-pass-header {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 35px 40px 30px;
      color: white;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
      backdrop-filter: blur(20px);
      min-height: 120px;
    }

    .airline-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .airline-logo {
      animation: pulse 2s infinite, glow 3s ease-in-out infinite;
      border-radius: 50%;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .airline-info h2 {
      margin: 0 0 8px 0;
      font-size: 2.2rem;
      font-weight: 900;
      text-shadow: 3px 3px 6px rgba(0,0,0,0.4);
      letter-spacing: -0.5px;
    }

    .flight-number {
      background: 
        linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 100%),
        rgba(255,255,255,0.2);
      background-size: 200px 100%;
      animation: shimmer 3s ease-in-out infinite;
      padding: 10px 20px;
      border-radius: 30px;
      font-weight: 800;
      font-size: 1.2rem;
      backdrop-filter: blur(15px);
      border: 2px solid rgba(255,255,255,0.2);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .qr-section {
      text-align: center;
    }

    .qr-code {
      width: 90px;
      height: 90px;
      background: white;
      border-radius: 15px;
      padding: 8px;
      margin-bottom: 10px;
      box-shadow: 
        0 6px 20px rgba(0,0,0,0.25),
        inset 0 1px 0 rgba(255,255,255,0.8);
      border: 2px solid rgba(255,255,255,0.3);
      animation: qrPulse 3s ease-in-out infinite;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-code svg {
      width: 100%;
      height: 100%;
    }

    @keyframes qrPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .qr-label {
      font-size: 0.9rem;
      opacity: 1;
      font-weight: 700;
      color: white;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }

    .flight-route {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30px 40px 35px;
      background: rgba(255,255,255,0.98);
      margin: 0 30px;
      border-radius: 20px;
      box-shadow: 
        0 10px 30px rgba(0,0,0,0.15),
        inset 0 1px 0 rgba(255,255,255,0.9);
      border: 2px solid rgba(102, 126, 234, 0.1);
      min-height: 140px;
    }

    .airport-info {
      text-align: center;
      flex: 1;
    }

    .airport-code {
      font-size: 3rem;
      font-weight: 900;
      color: #2d3748;
      margin-bottom: 8px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.15);
      letter-spacing: -1px;
    }

    .airport-city {
      font-size: 1.1rem;
      color: #4a5568;
      font-weight: 800;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .time-info .time {
      font-size: 1.6rem;
      font-weight: 900;
      color: #667eea;
      margin-bottom: 5px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .time-info .label {
      font-size: 0.9rem;
      color: #718096;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .flight-path {
      flex: 2;
      margin: 0 30px;
    }

    .route-svg {
      width: 100%;
      height: 60px;
    }

    .route-line {
      stroke-dasharray: 5,5;
      animation: dash 2s linear infinite;
    }

    @keyframes dash {
      to { stroke-dashoffset: -10; }
    }

    .passenger-details {
      position: relative;
      z-index: 2;
      padding: 35px 40px;
      background: white;
      min-height: 180px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 30px;
      min-height: 120px;
    }

    .detail-item {
      transition: transform 0.2s ease;
    }

    .detail-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      background: rgba(255, 255, 255, 0.9);
    }

    .passenger-name {
      color: #2d3748;
      font-size: 1.4rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .class-value {
      color: #38a169;
      font-size: 1.3rem;
      font-weight: 900;
      text-transform: uppercase;
      background: rgba(56, 161, 105, 0.1);
      padding: 5px 12px;
      border-radius: 20px;
      border: 2px solid rgba(56, 161, 105, 0.2);
    }

    .detail-item {
      text-align: center;
      background: rgba(247, 250, 252, 0.9);
      padding: 20px 15px;
      border-radius: 15px;
      border: 2px solid rgba(226, 232, 240, 0.7);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      min-height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .detail-label {
      font-size: 1rem;
      color: #2d3748;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 15px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }

    .detail-value {
      font-size: 1.5rem;
      font-weight: 900;
      color: #1a202c;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.15);
      min-height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.2;
    }

    .seat-number, .gate-number {
      color: #667eea;
      font-size: 1.6rem;
      font-weight: 900;
      text-shadow: 2px 2px 4px rgba(102, 126, 234, 0.3);
      background: rgba(102, 126, 234, 0.1);
      padding: 5px 10px;
      border-radius: 8px;
      border: 2px solid rgba(102, 126, 234, 0.2);
    }

    .boarding-time {
      color: #e53e3e;
      font-size: 1.4rem;
      text-shadow: 1px 1px 2px rgba(229, 62, 62, 0.2);
      animation: urgentPulse 2s ease-in-out infinite;
    }

    @keyframes urgentPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .important-info {
      position: relative;
      z-index: 2;
      padding: 0 40px 30px;
      background: white;
      min-height: 80px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #f7fafc, #edf2f7);
      padding: 20px 25px;
      border-radius: 15px;
      border: 3px solid #e2e8f0;
      box-shadow: 
        0 4px 15px rgba(0,0,0,0.08),
        inset 0 1px 0 rgba(255,255,255,0.8);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .info-label {
      font-size: 0.8rem;
      color: #718096;
      font-weight: 700;
      text-transform: uppercase;
    }

    .info-value {
      font-size: 1.1rem;
      font-weight: 900;
      color: #2d3748;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
    }

    .status-active {
      color: #38a169;
    }

    .barcode-section {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 30px 40px;
      background: linear-gradient(135deg, #ffffff, #f7fafc);
      border-top: 3px dashed #e2e8f0;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
      min-height: 100px;
    }

    .barcode {
      margin-bottom: 15px;
      animation: fadeInUp 1s ease-out 0.5s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .barcode-text {
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
      color: #2d3748;
      font-weight: 900;
      letter-spacing: 3px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      background: rgba(247, 250, 252, 0.8);
      padding: 8px 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .boarding-pass-footer {
      position: relative;
      z-index: 2;
      padding: 25px 40px;
      background: linear-gradient(135deg, #f7fafc, #edf2f7);
      border-top: 2px solid #e2e8f0;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.8);
      min-height: 80px;
    }

    .instructions {
      display: flex;
      justify-content: space-around;
      gap: 20px;
    }

    .instruction-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: #4a5568;
      font-weight: 700;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
    }

    .decorative-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .perforation-left, .perforation-right {
      position: absolute;
      top: 50%;
      width: 25px;
      height: 25px;
      background: #f7fafc;
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 
        inset 0 2px 4px rgba(0,0,0,0.1),
        0 1px 2px rgba(0,0,0,0.05);
      border: 2px solid #e2e8f0;
    }

    .perforation-left {
      left: -12px;
    }

    .perforation-right {
      right: -12px;
    }

    @media (max-width: 768px) {
      .boarding-pass {
        height: auto;
        min-height: 500px;
      }

      .flight-route {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
      }

      .flight-path {
        margin: 0;
        order: 2;
      }

      .detail-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
      }

      .instructions {
        flex-direction: column;
        gap: 10px;
      }

      .info-row {
        flex-direction: column;
        gap: 15px;
      }
    }
  `]
})
export class EnhancedBoardingPassComponent implements OnInit {
  @Input() boardingPasses: BoardingPass[] = [];

  constructor(private qrCodeService: QRCodeService) {}

  ngOnInit() {
    // Add any initialization logic here
  }

  getAirlineName(flightNumber: string): string {
    const airlineMap: {[key: string]: string} = {
      'AI': 'Air India',
      '6E': 'IndiGo',
      'SG': 'SpiceJet',
      'UK': 'Vistara',
      'G8': 'GoAir',
      'I5': 'AirAsia India',
      'EK': 'Emirates',
      'SQ': 'Singapore Airlines',
      'QR': 'Qatar Airways'
    };
    
    const prefix = flightNumber.split('-')[0] || flightNumber.substring(0, 2);
    return airlineMap[prefix] || 'Indian Airlines';
  }

  generateQRCodeSVG(data: string): string {
    return this.qrCodeService.generateAnimatedQRCodeSVG(data, 64);
  }

  generateBarcodeSVG(data: string): string {
    return this.qrCodeService.generateBarcodeSVG(data, 200, 40);
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}