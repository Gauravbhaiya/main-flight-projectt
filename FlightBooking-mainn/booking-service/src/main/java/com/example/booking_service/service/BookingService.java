package com.example.booking_service.service;

import com.example.booking_service.dto.*;
import com.example.booking_service.exception.BookingException;
import com.example.booking_service.exception.PassengerSaveException;
import com.example.booking_service.feign.FareInterface;
import com.example.booking_service.feign.FlightInterface;
import com.example.booking_service.feign.ProfileInterface;
import com.example.booking_service.kafka.BookingProducer;
import com.example.booking_service.model.Booking;
import com.example.booking_service.model.Passenger;
import com.example.booking_service.repository.BookingRepository;
import com.example.booking_service.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    FlightInterface flightInterface;

    @Autowired
    PassengerRepository passengerRepository;

    @Autowired
    FareInterface fareInterface;

    @Autowired
    ProfileInterface profileInterface;

    @Autowired
    BookingProducer bookingProducer;

    public Optional<Booking> createBooking(BookingDTO bookingDTO) {
        FlightResponseDTO flightResponseDTO = null;

        // Try to fetch flight details, but don't fail if service is down
        try {
            flightResponseDTO = flightInterface.getFlightById(bookingDTO.flightId);
            System.out.println("Fetched flight: " + flightResponseDTO);
        } catch (Exception e) {
            System.err.println("Flight service unavailable: " + e.getMessage());
            System.out.println("Proceeding with booking using default fare");
        }

        // Validate seats only if flight data is available
        if (flightResponseDTO != null && flightResponseDTO.availableSeats < bookingDTO.passengers.size()) {
            throw new BookingException("Invalid Flight ID or No Seats Available");
        }

        // Check for duplicate bookings
        for (PassengerDTO passengerDTO : bookingDTO.passengers) {
            try {
                Optional<Booking> existing = bookingRepository.findByFlightIdAndAadharNumber(
                        bookingDTO.flightId,
                        passengerDTO.aadharNumber
                );
                if (existing.isPresent()) {
                    throw new BookingException("Passenger is already booked on this flight.");
                }
            } catch (Exception e) {
                System.err.println("Error checking duplicate booking: " + e.getMessage());
                // Continue with booking creation
            }
        }

        Booking booking = new Booking();
        booking.setFlightId(bookingDTO.flightId);
        booking.setUserId(bookingDTO.userId);
        booking.setNumberOfPassenegers(bookingDTO.passengers.size());
        booking.setBookingDate(LocalDateTime.now().toString());
        booking.setStatus("PENDING");

        // Calculate total fare - use flight fare if available, otherwise default
        double totalFare = (flightResponseDTO != null)
                ? flightResponseDTO.fare * bookingDTO.passengers.size()
                : 15000.0 * bookingDTO.passengers.size(); // Default fare per passenger
        booking.setTotalFare(totalFare);

        List<Passenger> passengers = new ArrayList<>();
        for (PassengerDTO passengerDTO : bookingDTO.passengers) {
            Passenger passenger = new Passenger();
            passenger.setFirstName(passengerDTO.firstName);
            passenger.setLastName(passengerDTO.lastName);
            passenger.setEmail(passengerDTO.email);
            passenger.setGender(passengerDTO.gender);
            passenger.setAadharNumber(passengerDTO.aadharNumber);
            passenger.setFlightId(bookingDTO.flightId);
            passengers.add(passenger);
        }

        try {
            booking.setPassengers(passengers);
            return Optional.of(bookingRepository.save(booking));

        } catch (Exception e) {
            throw new BookingException("Failed to save booking: " + e.getMessage());
        }
    }

    public Optional<Booking> confirmBooking(Long bookingId) {
        Optional<Booking> bookingOpt;
        try {
            bookingOpt = bookingRepository.findById(bookingId);
        } catch (Exception e) {
            System.out.println("Error fetching booking " + e.getMessage());
            return Optional.empty();
        }

        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            if ("CONFIRMED".equals(booking.getStatus())) {
                return Optional.of(booking);
            }

            booking.setStatus("CONFIRMED");

            // Try to update flight seats, but don't fail if service is down
            try {
                int seatsToBook = booking.getPassengers().size();
                flightInterface.updateSeats(booking.getFlightId(), seatsToBook);
            } catch (Exception e) {
                System.err.println("Failed to update flight seats: " + e.getMessage());
                // Continue with booking confirmation
            }

            try {
                Booking savedBooking = bookingRepository.save(booking);
                // Send Kafka event to fare-service
                bookingProducer.sendBookingConfirmed(
                    "BookingId:" + savedBooking.getId() +
                    ",FlightId:" + savedBooking.getFlightId() +
                    ",UserId:" + savedBooking.getUserId() +
                    ",TotalFare:" + savedBooking.getTotalFare()
                );
                return Optional.of(savedBooking);
            } catch (Exception e) {
                throw new BookingException("Failed to update booking status: " + e.getMessage());
            }
        }

        return Optional.empty();
    }

    public Optional<Booking> getBookingById(Long id) {
        try {
            return bookingRepository.findById(id);
        } catch (Exception e) {
            throw new BookingException("Error fetching booking by ID: " + e.getMessage());
        }
    }

    public boolean cancelBooking(Long id) {
        try {
            if (!bookingRepository.existsById(id)) return false;
            bookingRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new BookingException("Error cancelling booking: " + e.getMessage());
        }
    }

    public FlightBookingDetailsDTO getPassengersByFlightId(Long flightId) {
        try {
            FlightResponseDTO flightResponseDTO = flightInterface.getFlightById(flightId);
            if (flightResponseDTO == null) return null;
        } catch (Exception e) {
            System.err.println("Flight service unavailable: " + e.getMessage());
            // Continue to get passengers even if flight service is down
        }

        List<Passenger> passengers;
        try {
            passengers = passengerRepository.findByFlightId(flightId);
        } catch (Exception e) {
            throw new PassengerSaveException("Error fetching passengers: " + e.getMessage());
        }

        List<PassengerDTO> passengerDTOs = passengers.stream().map(p -> {
            PassengerDTO dto = new PassengerDTO();
            dto.firstName = p.getFirstName();
            dto.lastName = p.getLastName();
            dto.email = p.getEmail();
            dto.gender = p.getGender();
            dto.aadharNumber = p.getAadharNumber();
            return dto;
        }).toList();

        return new FlightBookingDetailsDTO(passengerDTOs);
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        // Try to validate user, but don't fail if profile service is down
        try {
            UserDTO userDTO = profileInterface.getUserByUserId(userId).getBody();
            if (userDTO == null) {
                System.err.println("User not found with user id: " + userId);
            }
        } catch (Exception e) {
            System.err.println("Profile service unavailable: " + e.getMessage());
            // Continue to get bookings even if profile service is down
        }

        List<Booking> bookings;
        try {
            bookings = bookingRepository.findByUserId(userId);
        } catch (Exception e) {
            throw new BookingException("Error fetching bookings: " + e.getMessage());
        }
        return bookings;
    }
    // Add these methods to your BookingService class
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public boolean updateBookingStatus(Long bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            bookingRepository.save(booking);
            return true;
        }
        return false;
    }

}
