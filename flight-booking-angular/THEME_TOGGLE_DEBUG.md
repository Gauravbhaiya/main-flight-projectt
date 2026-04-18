# Theme Toggle Debug Guide

## Issue: Theme toggle button not working

## Debugging Steps:

### 1. Check Browser Console
Open your browser's developer tools (F12) and check the console for any errors or debug messages when clicking the theme toggle button.

### 2. Verify Component Loading
Check if the theme toggle component is properly loaded:
- Look for console messages like "Theme dropdown toggled: true/false"
- Check if the ThemeService is initialized

### 3. Check CSS Z-Index Issues
The theme dropdown might be hidden behind other elements:
- Inspect the theme dropdown element in browser dev tools
- Verify z-index values are correct (should be 1001)

### 4. Test Click Events
- Click the theme toggle button and check console for "Theme dropdown toggled" message
- Click outside the dropdown and check for "Theme dropdown closed" message
- Click a theme option and check for "Theme selected: [theme-name]" message

### 5. Verify Theme Application
- Check console for "Applying theme: [theme-name]" message
- Check if CSS custom properties are being updated in the document root
- Verify body class changes (should see theme-[name] classes)

## Quick Fixes to Try:

### Fix 1: Clear Browser Cache
- Hard refresh the page (Ctrl+F5)
- Clear browser cache and cookies

### Fix 2: Check Angular Module
Ensure ThemeToggleComponent and ClickOutsideDirective are properly declared in app.module.ts

### Fix 3: Restart Development Server
```bash
ng serve --port 4200
```

### Fix 4: Check for JavaScript Errors
Look for any JavaScript errors that might be preventing the component from working.

## Expected Behavior:
1. Click theme toggle button → dropdown should appear
2. Click theme option → theme should change and dropdown should close
3. Click outside dropdown → dropdown should close
4. Visual theme changes should be immediately visible

## Common Issues:
1. **Z-index problems** - Dropdown hidden behind other elements
2. **Event propagation** - Click events being prevented by parent elements
3. **CSS conflicts** - Theme styles not being applied due to CSS specificity
4. **Service not initialized** - ThemeService not properly injected

## Test Commands:
Open browser console and run:
```javascript
// Check if theme service is working
document.body.classList.add('theme-dark');
document.body.classList.remove('theme-light');

// Check CSS custom properties
document.documentElement.style.setProperty('--primary-color', '#ff0000');
```

If manual commands work but the component doesn't, the issue is with the component logic.
If manual commands don't work, the issue is with CSS or theme system setup.