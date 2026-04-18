# OAuth Setup Instructions

## Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins: `http://localhost:4200`
   - Add authorized redirect URIs: `http://localhost:4200`
5. **Copy your Client ID** and replace in:
   - `src/app/components/register.component.ts` line with Google Client ID
   - Format: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

## Facebook OAuth Setup

1. **Go to Facebook Developers**: https://developers.facebook.com/
2. **Create a new app**:
   - Choose "Consumer" app type
   - Enter app name and contact email
3. **Add Facebook Login product**:
   - Go to "Products" > "Facebook Login" > "Settings"
   - Add Valid OAuth Redirect URIs: `http://localhost:4200`
4. **Get your App ID**:
   - Go to "Settings" > "Basic"
   - Copy your App ID
5. **Replace App ID** in:
   - `src/index.html` in the Facebook SDK initialization
   - Format: `1234567890123456`

## Current Placeholder IDs (Replace These):

### Google Client ID:
```
1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

### Facebook App ID:
```
1234567890123456
```

## Testing:

1. Replace the placeholder IDs with your real OAuth credentials
2. Run `ng serve`
3. Go to register page
4. Click Google/Facebook buttons
5. Complete OAuth flow with real accounts
6. User will be registered with real email and name

## Security Notes:

- Never commit real OAuth credentials to version control
- Use environment variables for production
- Set up proper redirect URIs for production domains
- Enable only necessary OAuth scopes