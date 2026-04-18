# Flight Booking Angular Dashboard

A user dashboard for flight booking system built with Angular and TypeScript.

## Features

- **User Authentication**: Login and Register functionality
- **Flight Search**: Search flights by origin, destination, and date
- **Flight Booking**: Book available flights with passenger details
- **Payment Processing**: Process payments for bookings
- **Booking Management**: View and manage user bookings

## Demo Credentials

- **Username**: user
- **Password**: password

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login.component.ts
│   │   ├── register.component.ts
│   │   └── dashboard.component.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── flight.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── flight.service.ts
│   ├── app.component.ts
│   └── app.module.ts
├── index.html
├── main.ts
└── styles.css
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:4200`

## Backend Integration

This frontend is designed to work with your Spring Boot backend APIs:

- **Authentication**: `/auth/login`, `/auth/register`
- **Flights**: `/flight/**` (requires JWT token)
- **Bookings**: `/booking/**` (requires JWT token)
- **Profile**: `/profile/**` (requires JWT token)

## Current Implementation

The application currently uses dummy data for demonstration. To integrate with your actual backend:

1. Update the service methods in `auth.service.ts` and `flight.service.ts`
2. Replace dummy data with actual HTTP calls to your Spring Boot APIs
3. Add proper error handling and loading states
4. Implement JWT token management for authenticated requests

## Components

### LoginComponent
- User login form with validation
- Demo credentials provided
- Redirects to dashboard on successful login

### RegisterComponent
- User registration form
- Form validation for all fields
- Success message and redirect to login

### DashboardComponent
- Flight search functionality
- Display available flights
- Flight booking with modal
- Payment processing
- User bookings management
- Logout functionality

## Models

- **User**: User entity with role-based access
- **Flight**: Flight information and availability
- **Booking**: Booking details and status
- **Payment**: Payment processing information

## Services

- **AuthService**: Handles authentication and user management
- **FlightService**: Manages flight operations, bookings, and payments