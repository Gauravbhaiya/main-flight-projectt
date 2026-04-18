import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'flight-booking-angular';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service will automatically load saved theme
  }
}