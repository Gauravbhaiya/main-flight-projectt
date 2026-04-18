package com.example.flight_and_search_service.service;

import com.example.flight_and_search_service.dto.FlightDTO;
import com.example.flight_and_search_service.exception.FlightCreationException;
import com.example.flight_and_search_service.exception.FlightNotFoundException;
import com.example.flight_and_search_service.model.Flight;
import com.example.flight_and_search_service.repository.FlightRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private FlightService flightService;

    @Test
    void testCreateFlight_Success() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.airline = "Air India";
        flightDTO.source = "Delhi";
        flightDTO.destination = "Mumbai";
        flightDTO.departureDate = LocalDate.now().plusDays(1);
        flightDTO.departureTime = "10:00";
        flightDTO.arrivalTime = "12:00";
        flightDTO.availableSeats = 100;
        flightDTO.fare = 5000.0;

        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.empty());
        when(flightRepository.save(any(Flight.class))).thenReturn(new Flight());

        Flight result = flightService.createFlight(flightDTO);

        assertNotNull(result);
        verify(flightRepository).save(any(Flight.class));
    }

    @Test
    void testCreateFlight_DuplicateFlightNumber() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";

        Flight existingFlight = new Flight();
        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.of(existingFlight));

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testGetById_Success() {
        Flight flight = new Flight();
        flight.setId(1L);
        flight.setFlightNumber("AI123");

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));

        Flight result = flightService.getById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("AI123", result.getFlightNumber());
    }

    @Test
    void testGetById_NotFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FlightNotFoundException.class, () -> {
            flightService.getById(1L);
        });
    }

    @Test
    void testSearchFlight() {
        Flight flight1 = new Flight();
        flight1.setSource("Delhi");
        flight1.setDestination("Mumbai");
        flight1.setDepartureDate(LocalDate.now());

        when(flightRepository.findBySourceAndDestinationAndDepartureDate(
                "Delhi", "Mumbai", LocalDate.now()))
                .thenReturn(Arrays.asList(flight1));

        List<Flight> results = flightService.searchFlight("Delhi", "Mumbai", LocalDate.now().toString());

        assertEquals(1, results.size());
        assertEquals("Delhi", results.get(0).getSource());
        assertEquals("Mumbai", results.get(0).getDestination());
    }

    @Test
    void testUpdateSeats_Success() {
        Flight flight = new Flight();
        flight.setId(1L);
        flight.setAvailableSeats(100);

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        boolean result = flightService.updateSeats(1L, 10);

        assertTrue(result);
        verify(flightRepository).save(flight);
        assertEquals(90, flight.getAvailableSeats());
    }

    @Test
    void testUpdateSeats_InsufficientSeats() {
        Flight flight = new Flight();
        flight.setId(1L);
        flight.setAvailableSeats(5);

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));

        assertThrows(Exception.class, () -> {
            flightService.updateSeats(1L, 10);
        });
    }

    @Test
    void testDeleteFlight_Success() {
        when(flightRepository.existsById(1L)).thenReturn(true);

        boolean result = flightService.deleteFlight(1L);

        assertTrue(result);
        verify(flightRepository).deleteById(1L);
    }

    @Test
    void testDeleteFlight_NotFound() {
        when(flightRepository.existsById(1L)).thenReturn(false);

        assertThrows(FlightNotFoundException.class, () -> {
            flightService.deleteFlight(1L);
        });
    }

    @Test
    void testCreateFlight_PastDepartureDate() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.departureDate = LocalDate.now().minusDays(1);

        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.empty());

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testCreateFlight_NullFlightNumber() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = null;
        flightDTO.departureDate = LocalDate.now().plusDays(1);

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testCreateFlight_EmptyFlightNumber() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "";
        flightDTO.departureDate = LocalDate.now().plusDays(1);

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testCreateFlight_NegativeSeats() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.availableSeats = -10;
        flightDTO.departureDate = LocalDate.now().plusDays(1);

        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.empty());

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testCreateFlight_NegativeFare() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.fare = -1000.0;
        flightDTO.departureDate = LocalDate.now().plusDays(1);

        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.empty());

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testUpdateFlight_Success() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.airline = "Air India Updated";
        flightDTO.availableSeats = 150;
        flightDTO.fare = 6000.0;

        Flight existingFlight = new Flight();
        existingFlight.setId(1L);
        existingFlight.setFlightNumber("AI123");

        when(flightRepository.findById(1L)).thenReturn(Optional.of(existingFlight));
        when(flightRepository.save(any(Flight.class))).thenReturn(existingFlight);

        Flight result = flightService.updateFlight(1L, flightDTO);

        assertNotNull(result);
        verify(flightRepository).save(existingFlight);
    }

    @Test
    void testUpdateFlight_NotFound() {
        FlightDTO flightDTO = new FlightDTO();
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FlightNotFoundException.class, () -> {
            flightService.updateFlight(1L, flightDTO);
        });
    }

    @Test
    void testGetAllFlight() {
        Flight flight1 = new Flight();
        flight1.setId(1L);
        Flight flight2 = new Flight();
        flight2.setId(2L);

        when(flightRepository.findAll()).thenReturn(Arrays.asList(flight1, flight2));

        List<Flight> result = flightService.getAllFlight();

        assertEquals(2, result.size());
        verify(flightRepository).findAll();
    }

    @Test
    void testSearchFlight_NoResults() {
        when(flightRepository.findBySourceAndDestinationAndDepartureDate(
                "Delhi", "Mumbai", LocalDate.now()))
                .thenReturn(Arrays.asList());

        List<Flight> results = flightService.searchFlight("Delhi", "Mumbai", LocalDate.now().toString());

        assertTrue(results.isEmpty());
    }

    @Test
    void testSearchFlight_InvalidDateFormat() {
        assertThrows(Exception.class, () -> {
            flightService.searchFlight("Delhi", "Mumbai", "invalid-date");
        });
    }

    @Test
    void testUpdateSeats_FlightNotFound() {
        when(flightRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FlightNotFoundException.class, () -> {
            flightService.updateSeats(1L, 10);
        });
    }

    @Test
    void testUpdateSeats_ZeroSeatsToReduce() {
        Flight flight = new Flight();
        flight.setId(1L);
        flight.setAvailableSeats(100);

        when(flightRepository.findById(1L)).thenReturn(Optional.of(flight));
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        boolean result = flightService.updateSeats(1L, 0);

        assertTrue(result);
        assertEquals(100, flight.getAvailableSeats());
    }

    @Test
    void testCreateFlight_RepositoryException() {
        FlightDTO flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.departureDate = LocalDate.now().plusDays(1);
        flightDTO.availableSeats = 100;
        flightDTO.fare = 5000.0;

        when(flightRepository.findByFlightNumber("AI123")).thenReturn(Optional.empty());
        when(flightRepository.save(any(Flight.class)))
                .thenThrow(new RuntimeException("Database error"));

        assertThrows(FlightCreationException.class, () -> {
            flightService.createFlight(flightDTO);
        });
    }

    @Test
    void testSearchFlight_MultipleResults() {
        Flight flight1 = new Flight();
        flight1.setSource("Delhi");
        flight1.setDestination("Mumbai");
        Flight flight2 = new Flight();
        flight2.setSource("Delhi");
        flight2.setDestination("Mumbai");

        when(flightRepository.findBySourceAndDestinationAndDepartureDate(
                "Delhi", "Mumbai", LocalDate.now()))
                .thenReturn(Arrays.asList(flight1, flight2));

        List<Flight> results = flightService.searchFlight("Delhi", "Mumbai", LocalDate.now().toString());

        assertEquals(2, results.size());
    }
}