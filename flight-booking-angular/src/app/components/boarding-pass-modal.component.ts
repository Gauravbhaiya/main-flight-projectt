import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BoardingPass } from '../models/boarding-pass.model';

@Component({
  selector: 'app-boarding-pass-modal',
  template: `
    <div class="boarding-pass-modal-overlay" *ngIf="show" (click)="closeModal()">
      <div class="boarding-pass-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>🎫 Boarding Pass</h2>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        
        <div class="boarding-passes-container">
          <app-realistic-boarding-pass [boardingPasses]="boardingPasses"></app-realistic-boarding-pass>
          <!-- Fallback for old design -->
          <div class="boarding-pass legacy-pass" *ngFor="let pass of boardingPasses" style="display: none;">
            <div class="boarding-pass-header">
              <div class="airline-info">
                <h3>{{getAirlineName(pass.flightNumber)}}</h3>
                <div class="flight-number">{{pass.flightNumber}}</div>
              </div>
              <div class="qr-code">
                <div class="qr-placeholder">
                  <div class="qr-pattern"></div>
                </div>
                <small>{{pass.qrCode}}</small>
              </div>
            </div>
            
            <div class="flight-route">
              <div class="airport">
                <div class="airport-code">{{pass.origin}}</div>
                <div class="airport-name">Departure</div>
              </div>
              <div class="flight-path">
                <div class="plane-icon">✈️</div>
                <div class="route-line"></div>
              </div>
              <div class="airport">
                <div class="airport-code">{{pass.destination}}</div>
                <div class="airport-name">Arrival</div>
              </div>
            </div>
            
            <div class="passenger-details">
              <div class="detail-row">
                <div class="detail-item">
                  <span class="label">Passenger</span>
                  <span class="value">{{pass.passengerName}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Seat</span>
                  <span class="value">{{pass.seatNumber}}</span>
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-item">
                  <span class="label">Gate</span>
                  <span class="value">{{pass.gate}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Boarding</span>
                  <span class="value">{{pass.boardingTime}}</span>
                </div>
              </div>
              
              <div class="detail-row">
                <div class="detail-item">
                  <span class="label">Departure</span>
                  <span class="value">{{pass.departureTime}}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Status</span>
                  <span class="value status-active">{{pass.status}}</span>
                </div>
              </div>
            </div>
            
            <div class="boarding-pass-footer">
              <div class="boarding-pass-bottom">
                <div class="booking-reference">
                  <span class="label">Booking Reference</span>
                  <span class="value">{{pass.qrCode.substring(0, 6)}}</span>
                </div>
                <div class="sequence-number">
                  <span class="label">Sequence</span>
                  <span class="value">{{pass.id}}</span>
                </div>
              </div>
              <div class="barcode">
                <div class="barcode-lines">
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
                <div class="barcode-text">{{pass.qrCode}}</div>
              </div>
              <p class="instructions">⚠️ Please arrive at the gate 30 minutes before boarding time • Keep this boarding pass until you reach your destination</p>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="download-btn" (click)="downloadBoardingPass()">📱 Save to Phone</button>
          <button class="print-btn" (click)="printBoardingPass()">🖨️ Print</button>
          <button class="close-modal-btn" (click)="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boarding-pass-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
      padding: 1rem;
    }
    
    .boarding-pass-modal {
      background: white;
      border-radius: 20px;
      width: 85vw;
      max-width: 1500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .modal-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 1.5rem;
      border-radius: 20px 20px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
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
    
    .boarding-passes-container {
      padding: 1.5rem;
      width: 100%;
      max-height: 70vh;
      overflow-x: auto;
      overflow-y: auto;
    }

    .boarding-passes-container::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .boarding-passes-container::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .boarding-passes-container::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .boarding-passes-container::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    .boarding-pass {
      background: white;
      border-radius: 8px;
      padding: 1.5rem 2.5rem;
      margin-bottom: 1rem;
      border: 1px solid #d1d5db;
      position: relative;
      overflow: hidden;
      width: 100%;
      max-width: 800px;
      height: 280px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .boarding-pass::before {
      content: '';
      position: absolute;
      top: 50%;
      right: -10px;
      width: 20px;
      height: 20px;
      background: #f3f4f6;
      border-radius: 50%;
      transform: translateY(-50%);
    }
    
    .boarding-pass::after {
      content: '';
      position: absolute;
      top: 50%;
      left: -10px;
      width: 20px;
      height: 20px;
      background: #f3f4f6;
      border-radius: 50%;
      transform: translateY(-50%);
    }
    
    .boarding-pass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.8rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .airline-info h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
      font-weight: 800;
      color: #2d3748;
    }
    
    .flight-number {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.9rem;
      display: inline-block;
    }
    
    .qr-code {
      text-align: center;
    }
    
    .qr-placeholder {
      width: 60px;
      height: 60px;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.3rem;
    }
    
    .qr-pattern {
      width: 60px;
      height: 60px;
      background: 
        linear-gradient(90deg, #333 50%, transparent 50%),
        linear-gradient(#333 50%, transparent 50%);
      background-size: 4px 4px;
      opacity: 0.8;
    }
    
    .flight-route {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding: 1rem 0;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .airport {
      text-align: center;
      flex: 1;
    }
    
    .airport-code {
      font-size: 2rem;
      font-weight: 900;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }
    
    .airport-name {
      font-size: 0.9rem;
      color: #4a5568;
      font-weight: 600;
    }
    
    .flight-path {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 2rem;
      position: relative;
    }
    
    .route-line {
      height: 2px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      flex: 1;
    }
    
    .plane-icon {
      position: absolute;
      font-size: 1.5rem;
      background: white;
      padding: 0.5rem;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .passenger-details {
      margin-bottom: 1rem;
    }
    
    .detail-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 0.8rem;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    
    .label {
      font-size: 0.8rem;
      color: #4a5568;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .value {
      font-size: 1rem;
      font-weight: 700;
      color: #2d3748;
    }
    
    .status-active {
      color: #48bb78;
    }
    
    .boarding-pass-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      text-align: center;
    }
    
    .boarding-pass-bottom {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding: 1rem;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 8px;
    }
    
    .booking-reference, .sequence-number {
      text-align: center;
    }
    
    .booking-reference .label, .sequence-number .label {
      display: block;
      font-size: 0.7rem;
      color: #4a5568;
      margin-bottom: 0.2rem;
    }
    
    .booking-reference .value, .sequence-number .value {
      font-size: 1rem;
      font-weight: 800;
      color: #2d3748;
    }
    
    .barcode {
      margin-bottom: 1rem;
    }
    
    .barcode-lines {
      display: flex;
      justify-content: center;
      gap: 2px;
      margin-bottom: 0.5rem;
    }
    
    .barcode-lines span {
      width: 2px;
      height: 40px;
      background: #2d3748;
    }
    
    .barcode-lines span:nth-child(odd) {
      height: 30px;
    }
    
    .barcode-text {
      font-family: 'Courier New', monospace;
      font-size: 0.7rem;
      color: #2d3748;
      margin-top: 0.5rem;
      letter-spacing: 1px;
    }
    
    .instructions {
      font-size: 0.8rem;
      color: #4a5568;
      margin: 0;
      font-style: italic;
    }
    
    .modal-actions {
      padding: 1.5rem 2rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .download-btn, .print-btn, .close-modal-btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .download-btn {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }
    
    .print-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .close-modal-btn {
      background: #e2e8f0;
      color: #4a5568;
    }
    
    .download-btn:hover, .print-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .close-modal-btn:hover {
      background: #cbd5e0;
    }
    
    @media (max-width: 768px) {
      .boarding-pass-modal {
        margin: 0.5rem;
        max-height: 95vh;
      }
      
      .boarding-passes-container {
        padding: 1rem;
      }
      
      .boarding-pass {
        padding: 1.5rem;
      }
      
      .flight-route {
        flex-direction: column;
        gap: 1rem;
      }
      
      .flight-path {
        margin: 0;
        order: 2;
      }
      
      .detail-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .modal-actions {
        flex-direction: column;
        padding: 1rem;
      }
    }
    
    @media print {
      .boarding-pass-modal-overlay {
        position: static;
        background: white;
        padding: 0;
      }
      
      .boarding-pass-modal {
        box-shadow: none;
        max-width: none;
        width: 100%;
        max-height: none;
      }
      
      .modal-header, .modal-actions {
        display: none;
      }
      
      .boarding-pass {
        page-break-after: always;
        margin: 0;
        border: 2px solid #333;
      }
      
      .boarding-pass:last-child {
        page-break-after: avoid;
      }
    }
  `]
})
export class BoardingPassModalComponent {
  @Input() show = false;
  @Input() boardingPasses: BoardingPass[] = [];
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
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
  
  printBoardingPass() {
    window.print();
  }
  
  downloadBoardingPass() {
    // Create a downloadable version of the boarding pass
    const boardingPassData = {
      boardingPasses: this.boardingPasses,
      generatedAt: new Date().toISOString(),
      type: 'boarding-pass'
    };
    
    const dataStr = JSON.stringify(boardingPassData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `boarding-pass-${this.boardingPasses[0]?.flightNumber || 'flight'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('✓ Boarding pass saved successfully!');
  }
}