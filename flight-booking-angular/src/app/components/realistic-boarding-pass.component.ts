import { Component, Input, OnInit } from '@angular/core';
import { BoardingPass } from '../models/boarding-pass.model';
import { QRCodeService } from '../services/qr-code.service';

@Component({
  selector: 'app-realistic-boarding-pass',
  template: `
    <div class="boarding-pass-wrapper" *ngFor="let pass of boardingPasses">
      <div class="boarding-pass-ticket">
        <!-- Left Section - Main Ticket -->
        <div class="main-ticket">
          <!-- Header -->
          <div class="ticket-header">
            <div class="airline-section">
              <div class="airline-logo">
                <svg width="50" height="50" viewBox="0 0 50 50">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#1e40af"/>
                      <stop offset="100%" style="stop-color:#3b82f6"/>
                    </linearGradient>
                  </defs>
                  <circle cx="25" cy="25" r="23" fill="url(#logoGrad)" stroke="white" stroke-width="2"/>
                  <path d="M15 25 L25 15 L35 25 L25 35 Z" fill="white"/>
                  <animateTransform attributeName="transform" type="rotate" values="0 25 25;360 25 25" dur="10s" repeatCount="indefinite"/>
                </svg>
              </div>
              <div class="airline-info">
                <h1>{{getAirlineName(pass.flightNumber)}}</h1>
                <div class="flight-code">{{pass.flightNumber}}</div>
              </div>
            </div>
            <div class="boarding-pass-title">BOARDING PASS</div>
          </div>

          <!-- Flight Route -->
          <div class="flight-route-section">
            <div class="route-info">
              <div class="departure-info">
                <div class="airport-code">{{pass.origin}}</div>
                <div class="city-name">{{pass.originCity}}</div>
                <div class="time-block">
                  <div class="time">{{pass.departureTime}}</div>
                  <div class="label">DEPARTURE</div>
                </div>
              </div>
              
              <div class="flight-path">
                <svg class="flight-animation" viewBox="0 0 200 80">
                  <defs>
                    <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#3b82f6"/>
                      <stop offset="100%" style="stop-color:#1e40af"/>
                    </linearGradient>
                  </defs>
                  <path id="flightPath" d="M20 40 Q100 20 180 40" stroke="url(#pathGrad)" stroke-width="2" fill="none" stroke-dasharray="5,5">
                    <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
                  </path>
                  <g class="plane-icon">
                    <path d="M-8,-2 L8,0 L-8,2 L-3,0 Z" fill="#1e40af">
                      <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#flightPath"/>
                      </animateMotion>
                    </path>
                  </g>
                  <text x="100" y="65" text-anchor="middle" fill="#6b7280" font-size="10" font-weight="bold">{{pass.aircraft}}</text>
                </svg>
              </div>
              
              <div class="arrival-info">
                <div class="airport-code">{{pass.destination}}</div>
                <div class="city-name">{{pass.destinationCity}}</div>
                <div class="time-block">
                  <div class="time">{{pass.arrivalTime}}</div>
                  <div class="label">ARRIVAL</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Passenger Details -->
          <div class="passenger-section">
            <div class="passenger-row">
              <div class="detail-block">
                <div class="detail-label">PASSENGER NAME</div>
                <div class="detail-value passenger-name">{{pass.passengerName}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">CLASS</div>
                <div class="detail-value class-info">{{pass.class}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">DATE</div>
                <div class="detail-value">{{getCurrentDate()}}</div>
              </div>
            </div>
            
            <div class="passenger-row">
              <div class="detail-block">
                <div class="detail-label">SEAT</div>
                <div class="detail-value seat-number">{{pass.seatNumber}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">GATE</div>
                <div class="detail-value gate-number">{{pass.gate}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">TERMINAL</div>
                <div class="detail-value">{{pass.terminal}}</div>
              </div>
            </div>
            
            <div class="passenger-row">
              <div class="detail-block">
                <div class="detail-label">BOARDING TIME</div>
                <div class="detail-value boarding-time">{{pass.boardingTime}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">BAGGAGE</div>
                <div class="detail-value">{{pass.baggage}}</div>
              </div>
              <div class="detail-block">
                <div class="detail-label">PNR</div>
                <div class="detail-value pnr-code">{{pass.pnr}}</div>
              </div>
            </div>
          </div>

          <!-- Bottom Section -->
          <div class="ticket-bottom">
            <div class="barcode-section">
              <div class="barcode" [innerHTML]="generateBarcodeSVG(pass.barcode)"></div>
              <div class="barcode-text">{{pass.ticketNumber}}</div>
            </div>
            <div class="important-notice">
              <div class="notice-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#ef4444">
                  <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                  <path d="M7 3h2v6H7zM7 11h2v2H7z"/>
                </svg>
                <span>Report to gate 30 minutes before boarding time</span>
              </div>
              <div class="notice-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#10b981">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span>Mobile boarding pass accepted</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Section - Stub -->
        <div class="ticket-stub">
          <div class="stub-content">
            <div class="stub-header">
              <div class="stub-title">BOARDING PASS</div>
              <div class="stub-flight">{{pass.flightNumber}}</div>
            </div>
            
            <div class="qr-section">
              <div class="qr-code" [innerHTML]="generateQRCodeSVG(pass.qrCode)"></div>
              <div class="qr-label">SCAN TO BOARD</div>
            </div>
            
            <div class="stub-details">
              <div class="stub-item">
                <div class="stub-label">PASSENGER</div>
                <div class="stub-value">{{getShortName(pass.passengerName)}}</div>
              </div>
              <div class="stub-item">
                <div class="stub-label">SEAT</div>
                <div class="stub-value">{{pass.seatNumber}}</div>
              </div>
              <div class="stub-item">
                <div class="stub-label">GATE</div>
                <div class="stub-value">{{pass.gate}}</div>
              </div>
              <div class="stub-item">
                <div class="stub-label">BOARDING</div>
                <div class="stub-value">{{pass.boardingTime}}</div>
              </div>
            </div>
            
            <div class="stub-route">
              <span class="stub-from">{{pass.origin}}</span>
              <svg width="20" height="12" viewBox="0 0 20 12" fill="#6b7280">
                <path d="M1 6h18M15 2l4 4-4 4"/>
              </svg>
              <span class="stub-to">{{pass.destination}}</span>
            </div>
          </div>
        </div>

        <!-- Perforated Edge -->
        <div class="perforation">
          <div class="perf-circle" *ngFor="let i of [].constructor(15); let idx = index" 
               [style.top.px]="idx * 23 + 10"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boarding-pass-wrapper {
      margin: 20px auto;
      width: 80vw;
      max-width: 1400px;
      perspective: 1000px;
    }

    .boarding-pass-ticket {
      display: flex;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      overflow: visible;
      position: relative;
      width: 100%;
      min-height: 450px;
      height: auto;
      transition: transform 0.3s ease;
    }

    .boarding-pass-ticket:hover {
      transform: rotateY(2deg) rotateX(1deg);
    }

    .main-ticket {
      flex: 3;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 25px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e2e8f0;
    }

    .airline-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .airline-info h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 900;
      color: #1e293b;
      letter-spacing: -0.5px;
    }

    .flight-code {
      background: #1e40af;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 700;
      margin-top: 5px;
    }

    .boarding-pass-title {
      font-size: 1.5rem;
      font-weight: 900;
      color: #1e293b;
      letter-spacing: 2px;
    }

    .flight-route-section {
      margin-bottom: 25px;
    }

    .route-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }

    .departure-info, .arrival-info {
      text-align: center;
      flex: 1;
    }

    .airport-code {
      font-size: 3rem;
      font-weight: 900;
      color: #1e40af;
      margin-bottom: 5px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }

    .city-name {
      font-size: 1.1rem;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .time-block .time {
      font-size: 1.6rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 3px;
    }

    .time-block .label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .flight-path {
      flex: 2;
      margin: 0 30px;
    }

    .flight-animation {
      width: 100%;
      height: 80px;
    }

    .passenger-section {
      flex: 1;
      margin-bottom: 15px;
      min-height: 200px;
    }

    .passenger-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 15px;
    }

    .detail-block {
      background: white;
      padding: 12px 8px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      min-height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .detail-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .detail-value {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      line-height: 1.3;
      word-break: break-word;
    }

    .passenger-name {
      color: #1e40af;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .seat-number, .gate-number {
      color: #dc2626;
      font-size: 1.4rem;
    }

    .boarding-time {
      color: #ea580c;
      font-size: 1.3rem;
    }

    .class-info {
      color: #059669;
      text-transform: uppercase;
    }

    .pnr-code {
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
    }

    .ticket-bottom {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 20px;
      border-top: 2px dashed #cbd5e1;
    }

    .barcode-section {
      text-align: center;
    }

    .barcode {
      margin-bottom: 8px;
    }

    .barcode-text {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .important-notice {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .notice-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #475569;
      font-weight: 600;
    }

    .ticket-stub {
      flex: 1;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 25px 20px;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .stub-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
    }

    .stub-title {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .stub-flight {
      font-size: 1.2rem;
      font-weight: 900;
      letter-spacing: 1px;
    }

    .qr-section {
      text-align: center;
      margin-bottom: 25px;
    }

    .qr-code {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 8px;
      padding: 8px;
      margin: 0 auto 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: qrPulse 3s ease-in-out infinite;
    }

    @keyframes qrPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .qr-code svg {
      width: 100%;
      height: 100%;
    }

    .qr-label {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 1px;
      opacity: 0.9;
    }

    .stub-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .stub-item {
      text-align: center;
    }

    .stub-label {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 5px;
      opacity: 0.8;
    }

    .stub-value {
      font-size: 1rem;
      font-weight: 800;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    }

    .stub-route {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid rgba(255,255,255,0.3);
    }

    .stub-from, .stub-to {
      font-size: 1.2rem;
      font-weight: 900;
      letter-spacing: 1px;
    }

    .perforation {
      position: absolute;
      right: 25%;
      top: 0;
      height: 100%;
      width: 2px;
      background: #e2e8f0;
    }

    .perf-circle {
      position: absolute;
      width: 8px;
      height: 8px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      left: -4px;
      animation: perfFloat 4s ease-in-out infinite;
      animation-delay: calc(var(--i) * 0.1s);
    }

    @keyframes perfFloat {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(2px); }
    }

    @media (max-width: 768px) {
      .boarding-pass-ticket {
        flex-direction: column;
        height: auto;
      }
      
      .main-ticket {
        flex: none;
      }
      
      .ticket-stub {
        flex: none;
        padding: 20px;
      }
      
      .passenger-row {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .perforation {
        display: none;
      }
    }
  `]
})
export class RealisticBoardingPassComponent implements OnInit {
  @Input() boardingPasses: BoardingPass[] = [];

  constructor(private qrCodeService: QRCodeService) {}

  ngOnInit() {}

  getAirlineName(flightNumber: string): string {
    const airlineMap: {[key: string]: string} = {
      'AI': 'Air India',
      '6E': 'IndiGo',
      'SG': 'SpiceJet',
      'UK': 'Vistara',
      'G8': 'GoAir',
      'I5': 'AirAsia India'
    };
    
    const prefix = flightNumber.split('-')[0] || flightNumber.substring(0, 2);
    return airlineMap[prefix] || 'Indian Airlines';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  }

  getShortName(fullName: string): string {
    const parts = fullName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return fullName;
  }

  generateQRCodeSVG(data: string): string {
    return this.qrCodeService.generateAnimatedQRCodeSVG(data, 64);
  }

  generateBarcodeSVG(data: string): string {
    return this.qrCodeService.generateBarcodeSVG(data, 180, 30);
  }
}