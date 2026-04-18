package com.example.flight_and_search_service.controller;

import com.example.flight_and_search_service.dto.FlightDTO;
import com.example.flight_and_search_service.dto.FlightResponseDTO;
import com.example.flight_and_search_service.model.Flight;
import com.example.flight_and_search_service.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FlightControllerTest {

    @Mock
    private FlightService flightService;

    @InjectMocks
    private FlightController flightController;

    private FlightDTO flightDTO;
    private Flight flight;
    private Long flightId = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        flightDTO = new FlightDTO();
        flightDTO.flightNumber = "AI123";
        flightDTO.airline = "Air India";
        flightDTO.source = "Mumbai";
        flightDTO.destination = "Delhi";
        flightDTO.departureDate = LocalDate.of(2024, 12, 25);
        flightDTO.departureTime = "10:00 AM";
        flightDTO.arrivalTime = "12:00 PM";
        flightDTO.availableSeats = 100;
        flightDTO.fare = 5000.0;

        flight = new Flight();
        flight.setFlightNumber("AI123");
        flight.setAirline("Air India");
        flight.setSource("Mumbai");
        flight.setDestination("Delhi");
        flight.setDepartureDate(LocalDate.of(2024, 12, 25));
        flight.setDepartureTime("10:00 AM");
        flight.setArrivalTime("12:00 PM");
        flight.setAvailableSeats(100);
        flight.setFare(5000.0);
        flight.setId(flightId);
    }

    @Test
    void getAllFlights() {
        // Arrange
        List<Flight> flights = new ArrayList<>();
        flights.add(flight);
        when(flightService.getAllFlight()).thenReturn(flights);

        // Act
        List<Flight> result = flightController.getAll();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(flight, result.get(0));
        verify(flightService, times(1)).getAllFlight();
    }

    @Test
    void createFlight() {
        // Arrange
        when(flightService.createFlight(flightDTO)).thenReturn(flight);

        // Act
        Flight result = flightController.create(flightDTO);

        // Assert
        assertNotNull(result);
        assertEquals(flight, result);
        verify(flightService, times(1)).createFlight(flightDTO);
    }

    @Test
    void getFlightById() {
        // Arrange
        when(flightService.getById(flightId)).thenReturn(flight);
        ResponseEntity<Flight> expectedResponse = ResponseEntity.ok(flight);

        // Act
        ResponseEntity<Flight> result = flightController.getById(flightId);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result);
        verify(flightService, times(1)).getById(flightId);
    }

    @Test
    void updateFlight() {
        // Arrange
        when(flightService.updateFlight(flightId, flightDTO)).thenReturn(flight);
        ResponseEntity<Flight> expectedResponse = ResponseEntity.ok(flight);

        // Act
        ResponseEntity<Flight> result = flightController.update(flightId, flightDTO);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result);
        verify(flightService, times(1)).updateFlight(flightId, flightDTO);
    }

    @Test
    void deleteFlight() {
        // Arrange
        when(flightService.deleteFlight(flightId)).thenReturn(true);
        ResponseEntity<Void> expectedResponse = ResponseEntity.noContent().build();

        // Act
        ResponseEntity<Void> result = flightController.delete(flightId);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.NO_CONTENT, result.getStatusCode());
        assertEquals(expectedResponse, result);
        verify(flightService, times(1)).deleteFlight(flightId);
    }

    @Test
    void searchFlight() {
        // Arrange
        String source = "Mumbai";
        String destination = "Delhi";
        String departureDate = "2024-12-25";
        List<Flight> flights = new ArrayList<>();
        flights.add(flight);
        List<FlightResponseDTO> flightResponseDTOs = new ArrayList<>();
        flightResponseDTOs.add(new FlightResponseDTO(flight));

        when(flightService.searchFlight(source, destination, departureDate)).thenReturn(flights);

        // Act
        List<FlightResponseDTO> result = flightController.search(source, destination, departureDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        FlightResponseDTO actual = result.get(0);
        FlightResponseDTO expected = flightResponseDTOs.get(0);
        verify(flightService, times(1)).searchFlight(source, destination, departureDate);
    }

    @Test
    void updateSeats() {
        // Arrange
        Long flightId = 1L;
        int seatsToReduce = 30;
        when(flightService.updateSeats(flightId, seatsToReduce)).thenReturn(true);
        ResponseEntity<Void> expectedResponse = ResponseEntity.ok().build();

        // Act
        ResponseEntity<Void> result = flightController.updateSeats(flightId, seatsToReduce);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result);
        verify(flightService, times(1)).updateSeats(flightId, seatsToReduce);
    }

    @Test
    void createFlight_InvalidData() {
        // Arrange
        FlightDTO invalidFlightDTO = new FlightDTO();
        invalidFlightDTO.flightNumber = null;
        when(flightService.createFlight(invalidFlightDTO))
                .thenThrow(new RuntimeException("Invalid flight data"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.create(invalidFlightDTO);
        });
    }

    @Test
    void getFlightById_NotFound() {
        // Arrange
        when(flightService.getById(999L))
                .thenThrow(new RuntimeException("Flight not found"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.getById(999L);
        });
    }

    @Test
    void updateFlight_NotFound() {
        // Arrange
        when(flightService.updateFlight(999L, flightDTO))
                .thenThrow(new RuntimeException("Flight not found"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.update(999L, flightDTO);
        });
    }

    @Test
    void deleteFlight_NotFound() {
        // Arrange
        when(flightService.deleteFlight(999L))
                .thenThrow(new RuntimeException("Flight not found"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.delete(999L);
        });
    }

    @Test
    void searchFlight_EmptyResults() {
        // Arrange
        String source = "Delhi";
        String destination = "Chennai";
        String departureDate = "2024-12-25";
        List<Flight> emptyFlights = new ArrayList<>();

        when(flightService.searchFlight(source, destination, departureDate))
                .thenReturn(emptyFlights);

        // Act
        List<FlightResponseDTO> result = flightController.search(source, destination, departureDate);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(flightService, times(1)).searchFlight(source, destination, departureDate);
    }

    @Test
    void updateSeats_InsufficientSeats() {
        // Arrange
        Long flightId = 1L;
        int seatsToReduce = 200;
        when(flightService.updateSeats(flightId, seatsToReduce))
                .thenThrow(new RuntimeException("Insufficient seats"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.updateSeats(flightId, seatsToReduce);
        });
    }

    @Test
    void updateSeats_NegativeSeats() {
        // Arrange
        Long flightId = 1L;
        int negativeSeats = -10;
        when(flightService.updateSeats(flightId, negativeSeats)).thenReturn(true);

        // Act
        ResponseEntity<Void> result = flightController.updateSeats(flightId, negativeSeats);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(flightService, times(1)).updateSeats(flightId, negativeSeats);
    }

    @Test
    void getAllFlights_EmptyList() {
        // Arrange
        when(flightService.getAllFlight()).thenReturn(new ArrayList<>());

        // Act
        List<Flight> result = flightController.getAll();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(flightService, times(1)).getAllFlight();
    }

    @Test
    void searchFlight_InvalidDate() {
        // Arrange
        String source = "Mumbai";
        String destination = "Delhi";
        String invalidDate = "invalid-date";
        when(flightService.searchFlight(source, destination, invalidDate))
                .thenThrow(new RuntimeException("Invalid date format"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.search(source, destination, invalidDate);
        });
    }

    @Test
    void createFlight_DuplicateFlightNumber() {
        // Arrange
        when(flightService.createFlight(flightDTO))
                .thenThrow(new RuntimeException("Flight number already exists"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            flightController.create(flightDTO);
        });
    }

    @Test
    void updateSeats_ZeroSeats() {
        // Arrange
        Long flightId = 1L;
        int zeroSeats = 0;
        when(flightService.updateSeats(flightId, zeroSeats)).thenReturn(true);

        // Act
        ResponseEntity<Void> result = flightController.updateSeats(flightId, zeroSeats);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        verify(flightService, times(1)).updateSeats(flightId, zeroSeats);
    }
}
