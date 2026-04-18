# Email Setup Guide for OTP Verification

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to Google Account settings
2. Security → 2-Step Verification
3. Turn on 2-Step Verification

### Step 2: Generate App Password
1. Go to Google Account → Security
2. App passwords (under 2-Step Verification)
3. Select app: Mail
4. Select device: Other (Custom name)
5. Enter: "FlightHub App"
6. Copy the 16-character password

### Step 3: Update application.properties
```properties
spring.mail.username=your-gmail@gmail.com
spring.mail.password=your-16-char-app-password
```

## Alternative Email Providers

### Outlook/Hotmail
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

### Yahoo Mail
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

## Testing
1. Replace email credentials in application.properties
2. Restart Spring Boot application
3. Test registration with OTP verification

## Troubleshooting
- Use App Password, not regular password
- Check spam folder for OTP emails
- Ensure 2FA is enabled for Gmail
- Verify SMTP settings for your provider