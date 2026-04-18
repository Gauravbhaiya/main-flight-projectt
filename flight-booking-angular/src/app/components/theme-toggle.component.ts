import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <div class="theme-toggle-container">
      <button class="theme-toggle-btn" (click)="toggleThemeDropdown(); $event.stopPropagation()" [class.active]="showDropdown">
        <span class="theme-icon">{{currentTheme.icon}}</span>
        <span class="theme-text">{{currentTheme.displayName}}</span>
        <span class="dropdown-arrow" [class.rotated]="showDropdown">▼</span>
      </button>
      
      <div class="theme-dropdown" *ngIf="showDropdown" (clickOutside)="closeDropdown()">
        <div class="dropdown-header">
          <span class="header-icon">🎨</span>
          <span class="header-text">Choose Theme</span>
        </div>
        
        <div class="theme-options">
          <button 
            *ngFor="let theme of themes" 
            class="theme-option"
            [class.active]="theme.name === currentTheme.name"
            (click)="selectTheme(theme); $event.stopPropagation()">
            <div class="theme-preview" [style.background]="getThemePreview(theme)"></div>
            <div class="theme-info">
              <span class="theme-icon">{{theme.icon}}</span>
              <span class="theme-name">{{theme.displayName}}</span>
            </div>
            <div class="check-icon" *ngIf="theme.name === currentTheme.name">✓</div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-toggle-container {
      position: relative;
      z-index: 1000;
    }

    .theme-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--surface-color);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      color: var(--text-color);
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      box-shadow: var(--card-shadow);
    }

    .theme-toggle-btn:hover {
      border-color: var(--primary-color);
      box-shadow: var(--card-shadow-hover);
      transform: translateY(-2px);
    }

    .theme-toggle-btn.active {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .theme-icon {
      font-size: 1.2rem;
    }

    .theme-text {
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .dropdown-arrow {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
      margin-left: 0.25rem;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    .theme-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: var(--bg-color);
      border: 2px solid var(--border-color);
      border-radius: 16px;
      padding: 1rem;
      min-width: 280px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      animation: dropdownSlide 0.3s ease-out;
      z-index: 1001;
    }

    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-color);
    }

    .header-icon {
      font-size: 1.2rem;
    }

    .header-text {
      font-weight: 700;
      color: var(--text-color);
      font-size: 1rem;
    }

    .theme-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .theme-option {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border: 2px solid transparent;
      border-radius: 12px;
      background: var(--surface-color);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .theme-option:hover {
      border-color: var(--primary-color);
      transform: translateX(4px);
    }

    .theme-option.active {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .theme-preview {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--border-color);
      flex-shrink: 0;
    }

    .theme-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex: 1;
    }

    .theme-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .check-icon {
      font-size: 1rem;
      font-weight: bold;
      color: white;
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .theme-text {
        display: none;
      }
      
      .theme-dropdown {
        right: -50px;
        min-width: 250px;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme!: Theme;
  themes: Theme[] = [];
  showDropdown = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleThemeDropdown(): void {
    this.showDropdown = !this.showDropdown;
    console.log('Theme dropdown toggled:', this.showDropdown);
  }

  closeDropdown(): void {
    this.showDropdown = false;
    console.log('Theme dropdown closed');
  }

  selectTheme(theme: Theme): void {
    console.log('Theme selected:', theme.name);
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }

  getThemePreview(theme: Theme): string {
    return `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`;
  }
}