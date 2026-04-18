package com.example.booking_service.service;

import com.example.booking_service.dto.BookingDTO;
import com.example.booking_service.dto.FlightResponseDTO;
import com.example.booking_service.dto.PassengerDTO;
import com.example.booking_service.exception.BookingException;
import com.example.booking_service.exception.FlightNotFoundException;
import com.example.booking_service.exception.PassengerSaveException;
import com.example.booking_service.feign.FlightInterface;
import com.example.booking_service.feign.ProfileInterface;
import com.example.booking_service.model.Booking;
import com.example.booking_service.model.Passenger;
import com.example.booking_service.repository.BookingRepository;
import com.example.booking_service.repository.PassengerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    private BookingDTO validBookingDTO;
    private PassengerDTO validPassengerDTO;
    private FlightResponseDTO validFlightResponse;
    private Booking validBooking;

    @BeforeEach
    void setUp() {
        validPassengerDTO = new PassengerDTO();
        validPassengerDTO.firstName = "John";
        validPassengerDTO.lastName = "Doe";
        validPassengerDTO.email = "john@example.com";
        validPassengerDTO.gender = "Male";
        validPassengerDTO.aadharNumber = "123456789012";

        validBookingDTO = new BookingDTO();
        validBookingDTO.flightId = 1L;
        validBookingDTO.userId = 1L;
        validBookingDTO.passengers = Arrays.asList(validPassengerDTO);

        validFlightResponse = new FlightResponseDTO();
        validFlightResponse.availableSeats = 100;
        validFlightResponse.fare = 5000.0;

        validBooking = new Booking();
        validBooking.setId(1L);
        validBooking.setFlightId(1L);
        validBooking.setUserId(1L);
        validBooking.setStatus("PENDING");
    }

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PassengerRepository passengerRepository;

    @Mock
    private FlightInterface flightInterface;

    @Mock
    private ProfileInterface profileInterface;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void testCreateBooking_Success() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        
        PassengerDTO passengerDTO = new PassengerDTO();
        passengerDTO.firstName = "John";
        passengerDTO.lastName = "Doe";
        passengerDTO.email = "john@example.com";
        passengerDTO.gender = "Male";
        passengerDTO.aadharNumber = "123456789012";
        
        bookingDTO.passengers = Arrays.asList(passengerDTO);

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 100;
        flightResponse.fare = 5000.0;

        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);
        when(bookingRepository.findByFlightIdAndAadharNumber(1L, "123456789012"))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenReturn(new Booking());

        Optional<Booking> result = bookingService.createBooking(bookingDTO);

        assertTrue(result.isPresent());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_InsufficientSeats() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        
        PassengerDTO passengerDTO1 = new PassengerDTO();
        PassengerDTO passengerDTO2 = new PassengerDTO();
        bookingDTO.passengers = Arrays.asList(passengerDTO1, passengerDTO2);

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 1; // Less than required

        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);

        assertThrows(BookingException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testCreateBooking_DuplicatePassenger() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        
        PassengerDTO passengerDTO = new PassengerDTO();
        passengerDTO.aadharNumber = "123456789012";
        bookingDTO.passengers = Arrays.asList(passengerDTO);

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 100;

        Booking existingBooking = new Booking();
        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);
        when(bookingRepository.findByFlightIdAndAadharNumber(1L, "123456789012"))
                .thenReturn(Optional.of(existingBooking));

        assertThrows(BookingException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testConfirmBooking_Success() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus("PENDING");
        booking.setFlightId(1L);
        
        Passenger passenger = new Passenger();
        booking.setPassengers(Arrays.asList(passenger));

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Optional<Booking> result = bookingService.confirmBooking(1L);

        assertTrue(result.isPresent());
        assertEquals("CONFIRMED", result.get().getStatus());
        verify(flightInterface).updateSeats(1L, 1);
    }

    @Test
    void testConfirmBooking_AlreadyConfirmed() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus("CONFIRMED");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.confirmBooking(1L);

        assertTrue(result.isPresent());
        assertEquals("CONFIRMED", result.get().getStatus());
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void testGetBookingById_Success() {
        Booking booking = new Booking();
        booking.setId(1L);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.getBookingById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testCancelBooking_Success() {
        when(bookingRepository.existsById(1L)).thenReturn(true);

        boolean result = bookingService.cancelBooking(1L);

        assertTrue(result);
        verify(bookingRepository).deleteById(1L);
    }

    @Test
    void testCancelBooking_NotFound() {
        when(bookingRepository.existsById(1L)).thenReturn(false);

        boolean result = bookingService.cancelBooking(1L);

        assertFalse(result);
        verify(bookingRepository, never()).deleteById(1L);
    }

    @Test
    void testGetBookingsByUserId() {
        Booking booking1 = new Booking();
        Booking booking2 = new Booking();
        List<Booking> bookings = Arrays.asList(booking1, booking2);

        when(bookingRepository.findByUserId(1L)).thenReturn(bookings);

        List<Booking> result = bookingService.getBookingsByUserId(1L);

        assertEquals(2, result.size());
        verify(bookingRepository).findByUserId(1L);
    }

    @Test
    void testUpdateBookingStatus_Success() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus("PENDING");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        boolean result = bookingService.updateBookingStatus(1L, "CONFIRMED");

        assertTrue(result);
        verify(bookingRepository).save(booking);
        assertEquals("CONFIRMED", booking.getStatus());
    }

    @Test
    void testUpdateBookingStatus_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = bookingService.updateBookingStatus(1L, "CONFIRMED");

        assertFalse(result);
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_NullFlightResponse() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(new PassengerDTO());

        when(flightInterface.getFlightById(1L)).thenReturn(null);

        assertThrows(FlightNotFoundException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testCreateBooking_EmptyPassengerList() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Collections.emptyList();

        assertThrows(BookingException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testCreateBooking_MultiplePassengers() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        
        PassengerDTO passenger1 = new PassengerDTO();
        passenger1.firstName = "John";
        passenger1.lastName = "Doe";
        passenger1.aadharNumber = "123456789012";
        
        PassengerDTO passenger2 = new PassengerDTO();
        passenger2.firstName = "Jane";
        passenger2.lastName = "Smith";
        passenger2.aadharNumber = "123456789013";
        
        bookingDTO.passengers = Arrays.asList(passenger1, passenger2);

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 100;
        flightResponse.fare = 5000.0;

        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);
        when(bookingRepository.findByFlightIdAndAadharNumber(anyLong(), anyString()))
                .thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenReturn(new Booking());

        Optional<Booking> result = bookingService.createBooking(bookingDTO);

        assertTrue(result.isPresent());
        verify(bookingRepository).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_ZeroAvailableSeats() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(new PassengerDTO());

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 0;

        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);

        assertThrows(BookingException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testCreateBooking_PassengerSaveFailure() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        
        PassengerDTO passengerDTO = new PassengerDTO();
        passengerDTO.aadharNumber = "123456789012";
        bookingDTO.passengers = Arrays.asList(passengerDTO);

        FlightResponseDTO flightResponse = new FlightResponseDTO();
        flightResponse.availableSeats = 100;
        flightResponse.fare = 5000.0;

        when(flightInterface.getFlightById(1L)).thenReturn(flightResponse);
        when(bookingRepository.findByFlightIdAndAadharNumber(1L, "123456789012"))
                .thenReturn(Optional.empty());
        when(passengerRepository.save(any(Passenger.class)))
                .thenThrow(new RuntimeException("Database error"));

        assertThrows(PassengerSaveException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }

    @Test
    void testConfirmBooking_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Booking> result = bookingService.confirmBooking(1L);

        assertFalse(result.isPresent());
        verify(flightInterface, never()).updateSeats(anyLong(), anyInt());
    }

    @Test
    void testConfirmBooking_CancelledBooking() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus("CANCELLED");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.confirmBooking(1L);

        assertTrue(result.isPresent());
        assertEquals("CANCELLED", result.get().getStatus());
        verify(bookingRepository, never()).save(any(Booking.class));
    }

    @Test
    void testGetBookingById_NotFound() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.empty());

        Optional<Booking> result = bookingService.getBookingById(1L);

        assertFalse(result.isPresent());
    }

    @Test
    void testGetBookingsByUserId_EmptyList() {
        when(bookingRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        List<Booking> result = bookingService.getBookingsByUserId(1L);

        assertTrue(result.isEmpty());
        verify(bookingRepository).findByUserId(1L);
    }

    @Test
    void testGetAllBookings() {
        Booking booking1 = new Booking();
        booking1.setId(1L);
        Booking booking2 = new Booking();
        booking2.setId(2L);
        List<Booking> bookings = Arrays.asList(booking1, booking2);

        when(bookingRepository.findAll()).thenReturn(bookings);

        List<Booking> result = bookingService.getAllBookings();

        assertEquals(2, result.size());
        verify(bookingRepository).findAll();
    }

    @Test
    void testUpdateBookingStatus_InvalidStatus() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus("PENDING");

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        boolean result = bookingService.updateBookingStatus(1L, "");

        assertTrue(result);
        assertEquals("", booking.getStatus());
    }

    @Test
    void testCreateBooking_FlightInterfaceException() {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(new PassengerDTO());

        when(flightInterface.getFlightById(1L))
                .thenThrow(new RuntimeException("Flight service unavailable"));

        assertThrows(FlightNotFoundException.class, () -> {
            bookingService.createBooking(bookingDTO);
        });
    }
}