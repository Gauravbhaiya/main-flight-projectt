package com.example.booking_service.controller;

import com.example.booking_service.dto.BookingDTO;
import com.example.booking_service.dto.FlightBookingDetailsDTO;
import com.example.booking_service.dto.PaymentResponseDTO;
import com.example.booking_service.dto.UserDTO;
import com.example.booking_service.exception.BookingException;
import com.example.booking_service.model.Booking;
import com.example.booking_service.service.BookingService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/booking")
//gaurav
public class BookingController {
    @Autowired
    BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody @Valid BookingDTO dto) {
        try {
            System.out.println("Received booking request: " + dto);
            Optional<Booking> booking = bookingService.createBooking(dto);
            if (booking.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Flight ID or No Seats Available");
            }
            return ResponseEntity.ok(booking.get());
        } catch (Exception e) {
            System.err.println("Booking creation error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Booking> getById(@PathVariable Long id) {
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            return booking.isPresent() ? ResponseEntity.ok(booking.get()) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error fetching booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> cancel(@PathVariable Long id) {
        try {
            boolean isCancelled = bookingService.cancelBooking(id);
            return isCancelled
                    ? ResponseEntity.ok("Your booking with ID " + id + " has been cancelled.")
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking with ID " + id + " not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error cancelling booking: " + e.getMessage());
        }
    }

    @GetMapping("/viewPassengers/{flightId}")
    @CircuitBreaker(name = "FLIGHT-AND-SEARCH-SERVICE", fallbackMethod = "flightFallback")
    public ResponseEntity<FlightBookingDetailsDTO> viewPassengersByFlight(@PathVariable Long flightId) {
        try {
            FlightBookingDetailsDTO response = bookingService.getPassengersByFlightId(flightId);
            return (response == null) ? ResponseEntity.notFound().build() : ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/confirm/{bookingId}")
    public ResponseEntity<String> confirmBooking(@PathVariable Long bookingId) {
        try {
            Optional<Booking> bookingOpt = bookingService.confirmBooking(bookingId);
            if (bookingOpt.isPresent()) {
                return ResponseEntity.ok("Booking confirmed with ID: " + bookingOpt.get().getId());
            } else {
                return ResponseEntity.badRequest().body("Booking confirmation failed. Please check the booking ID.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error confirming booking: " + e.getMessage());
        }
    }

    @GetMapping("/get/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingByUserId(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Error fetching user bookings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Admin endpoints
    @GetMapping("/admin/getAll")

    public ResponseEntity<List<Booking>> getAllBookings() {
        try {
            List<Booking> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            System.err.println("Error fetching all bookings: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/admin/updateStatus/{bookingId}")

    public ResponseEntity<String> updateBookingStatus(@PathVariable Long bookingId, @RequestBody StatusRequest request) {
        try {
            boolean updated = bookingService.updateBookingStatus(bookingId, request.getStatus());
            return updated
                    ? ResponseEntity.ok("Booking status updated successfully")
                    : ResponseEntity.badRequest().body("Failed to update booking status");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating booking status: " + e.getMessage());
        }
    }

    public static class StatusRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public ResponseEntity<String> flightFallback(Exception e) {
        System.out.println("Flight service is down, fallback triggered " + e.getMessage());
        return ResponseEntity.status(503).body("Flight service is down");
    }
}