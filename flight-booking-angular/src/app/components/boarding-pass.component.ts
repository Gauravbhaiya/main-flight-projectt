import { Component, Input } from '@angular/core';
import { BoardingPass } from '../models/boarding-pass.model';

@Component({
  selector: 'app-boarding-pass',
  template: `
    <app-realistic-boarding-pass [boardingPasses]="boardingPasses"></app-realistic-boarding-pass>
    <!-- Legacy template -->
    <div class="boarding-pass legacy" *ngFor="let pass of boardingPasses" style="display: none;">
      <div class="boarding-pass-header">
        <h3>Boarding Pass</h3>
        <div class="flight-number">{{pass.flightNumber}}</div>
      </div>
      
      <div class="boarding-pass-content">
        <div class="passenger-info">
          <div class="info-row">
            <span class="label">Passenger:</span>
            <span class="value">{{pass.passengerName}}</span>
          </div>
          <div class="info-row">
            <span class="label">Seat:</span>
            <span class="value">{{pass.seatNumber}}</span>
          </div>
        </div>
        
        <div class="flight-info">
          <div class="route">
            <div class="airport">
              <div class="code">{{pass.origin}}</div>
            </div>
            <div class="arrow">→</div>
            <div class="airport">
              <div class="code">{{pass.destination}}</div>
            </div>
          </div>
          
          <div class="times">
            <div class="time-info">
              <span class="label">Boarding:</span>
              <span class="time">{{pass.boardingTime}}</span>
            </div>
            <div class="time-info">
              <span class="label">Departure:</span>
              <span class="time">{{pass.departureTime}}</span>
            </div>
            <div class="time-info">
              <span class="label">Gate:</span>
              <span class="gate">{{pass.gate}}</span>
            </div>
          </div>
        </div>
        
        <div class="qr-section">
          <div class="qr-code">
            <div class="qr-placeholder">QR</div>
          </div>
          <div class="qr-text">{{pass.qrCode}}</div>
        </div>
      </div>
      
      <div class="boarding-pass-footer">
        <small>Status: {{pass.status}}</small>
      </div>
    </div>
  `,
  styles: [`
    .boarding-pass {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 15px;
      padding: 20px;
      margin: 10px 0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    
    .boarding-pass::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
      opacity: 0.3;
    }
    
    .boarding-pass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    
    .boarding-pass-header h3 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .flight-number {
      font-size: 1.2rem;
      font-weight: bold;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
    }
    
    .boarding-pass-content {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 20px;
      position: relative;
      z-index: 1;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .label {
      opacity: 0.8;
      font-size: 0.9rem;
    }
    
    .value {
      font-weight: bold;
    }
    
    .route {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .airport .code {
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .arrow {
      font-size: 1.5rem;
      opacity: 0.7;
    }
    
    .times {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .time-info {
      display: flex;
      justify-content: space-between;
    }
    
    .time, .gate {
      font-weight: bold;
      color: #ffd700;
    }
    
    .qr-section {
      text-align: center;
    }
    
    .qr-code {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    
    .qr-placeholder {
      color: #333;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .qr-text {
      font-size: 0.8rem;
      opacity: 0.8;
      word-break: break-all;
    }
    
    .boarding-pass-footer {
      margin-top: 20px;
      text-align: center;
      position: relative;
      z-index: 1;
    }
    
    @media (max-width: 768px) {
      .boarding-pass-content {
        grid-template-columns: 1fr;
        gap: 15px;
      }
      
      .qr-section {
        order: -1;
      }
    }
  `]
})
export class BoardingPassComponent {
  @Input() boardingPasses: BoardingPass[] = [];
}