import { Component, OnInit } from '@angular/core';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-simple-theme-toggle',
  template: `
    <div class="simple-theme-toggle">
      <button class="theme-btn" (click)="toggleTheme()" title="Toggle Theme">
        <span class="theme-icon">{{getCurrentIcon()}}</span>
        <span class="theme-name">{{currentTheme.displayName}}</span>
      </button>
    </div>
  `,
  styles: [`
    .simple-theme-toggle {
      position: relative;
      z-index: 1000;
    }
    
    .theme-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.2);
      border-radius: 12px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    
    .theme-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: rgba(255,255,255,0.4);
      transform: translateY(-2px);
    }
    
    .theme-icon {
      font-size: 1.2rem;
    }
    
    .theme-name {
      font-size: 0.9rem;
      white-space: nowrap;
    }
    
    @media (max-width: 768px) {
      .theme-name {
        display: none;
      }
    }
  `]
})
export class SimpleThemeToggleComponent implements OnInit {
  currentTheme!: Theme;
  themes: Theme[] = [];
  currentIndex = 0;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
      this.currentIndex = this.themes.findIndex(t => t.name === theme.name);
    });
  }

  toggleTheme(): void {
    console.log('Simple theme toggle clicked');
    this.currentIndex = (this.currentIndex + 1) % this.themes.length;
    const nextTheme = this.themes[this.currentIndex];
    console.log('Switching to theme:', nextTheme.name);
    this.themeService.setTheme(nextTheme);
  }

  getCurrentIcon(): string {
    return this.currentTheme?.icon || '🎨';
  }
}