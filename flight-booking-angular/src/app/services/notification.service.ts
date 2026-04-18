import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showSuccess(message: string): void {
    console.log('Success:', message);
  }

  showError(message: string): void {
    console.log('Error:', message);
  }

  showInfo(message: string): void {
    console.log('Info:', message);
  }
}