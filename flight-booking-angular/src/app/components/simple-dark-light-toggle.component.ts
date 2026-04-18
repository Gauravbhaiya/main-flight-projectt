import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-simple-dark-light-toggle',
  template: `
    <div class="simple-toggle">
      <button class="toggle-btn" (click)="toggleTheme()" [title]="getTooltip()">
        <span class="toggle-icon">{{currentTheme.icon}}</span>
      </button>
    </div>
  `,
  styles: [`
    .simple-toggle {
      position: relative;
      z-index: 1000;
    }
    
    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(15px);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }
    
    .toggle-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.3);
    }
    
    .toggle-btn:active {
      transform: translateY(-1px) scale(1.02);
    }
    
    .toggle-icon {
      font-size: 1.4rem;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      transition: transform 0.3s ease;
    }
    
    .toggle-btn:hover .toggle-icon {
      transform: rotate(15deg) scale(1.1);
    }
    
    @media (max-width: 768px) {
      .toggle-btn {
        width: 40px;
        height: 40px;
      }
      
      .toggle-icon {
        font-size: 1.2rem;
      }
    }
  `]
})
export class SimpleDarkLightToggleComponent implements OnInit {
  currentTheme!: Theme;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getTooltip(): string {
    return `Switch to ${this.currentTheme.name === 'light' ? 'Dark' : 'Light'} Mode`;
  }
}