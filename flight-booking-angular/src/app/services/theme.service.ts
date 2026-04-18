import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Theme {
  name: string;
  displayName: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Theme[] = [
    {
      name: 'light',
      displayName: 'Light',
      icon: '☀️',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2'
      }
    },
    {
      name: 'dark',
      displayName: 'Dark',
      icon: '🌙',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2'
      }
    }
  ];

  private currentThemeSubject = new BehaviorSubject<Theme>(this.themes[0]);
  public currentTheme$ = this.currentThemeSubject.asObservable();

  constructor() {
    this.loadTheme();
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      const theme = this.themes.find(t => t.name === savedTheme);
      if (theme) {
        this.setTheme(theme);
      }
    }
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('selectedTheme', theme.name);
    this.applyTheme(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme.name === 'dark' ? this.themes[0] : this.themes[1];
    this.setTheme(newTheme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Remove existing theme classes
    document.body.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme.name}`);
    document.documentElement.classList.add(`theme-${theme.name}`);
    
    // Update dashboard data-theme attribute
    const dashboard = document.querySelector('.modern-dashboard');
    if (dashboard) {
      dashboard.setAttribute('data-theme', theme.name);
    }
  }
}