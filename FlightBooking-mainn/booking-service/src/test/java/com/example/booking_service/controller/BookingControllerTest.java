package com.example.booking_service.controller;

import com.example.booking_service.dto.BookingDTO;
import com.example.booking_service.dto.PassengerDTO;
import com.example.booking_service.model.Booking;
import com.example.booking_service.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BookingController.class)
class BookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateBooking_Success() throws Exception {
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

        Booking booking = new Booking();
        booking.setId(1L);

        when(bookingService.createBooking(any(BookingDTO.class))).thenReturn(Optional.of(booking));

        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testCreateBooking_InvalidInput() throws Exception {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(); // Empty passengers

        when(bookingService.createBooking(any(BookingDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetBookingById_Success() throws Exception {
        Booking booking = new Booking();
        booking.setId(1L);

        when(bookingService.getBookingById(1L)).thenReturn(Optional.of(booking));

        mockMvc.perform(get("/booking/get/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void testGetBookingById_NotFound() throws Exception {
        when(bookingService.getBookingById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/booking/get/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCancelBooking_Success() throws Exception {
        when(bookingService.cancelBooking(1L)).thenReturn(true);

        mockMvc.perform(delete("/booking/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Your booking with ID 1 has been cancelled."));
    }

    @Test
    void testCancelBooking_NotFound() throws Exception {
        when(bookingService.cancelBooking(1L)).thenReturn(false);

        mockMvc.perform(delete("/booking/delete/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Booking with ID 1 not found."));
    }

    @Test
    void testConfirmBooking_Success() throws Exception {
        Booking booking = new Booking();
        booking.setId(1L);

        when(bookingService.confirmBooking(1L)).thenReturn(Optional.of(booking));

        mockMvc.perform(put("/booking/confirm/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking confirmed with ID: 1"));
    }

    @Test
    void testGetBookingsByUserId() throws Exception {
        Booking booking1 = new Booking();
        booking1.setId(1L);
        Booking booking2 = new Booking();
        booking2.setId(2L);

        List<Booking> bookings = Arrays.asList(booking1, booking2);

        when(bookingService.getBookingsByUserId(1L)).thenReturn(bookings);

        mockMvc.perform(get("/booking/get/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[1].id").value(2L));
    }

    @Test
    void testGetAllBookings() throws Exception {
        Booking booking1 = new Booking();
        booking1.setId(1L);
        List<Booking> bookings = Arrays.asList(booking1);

        when(bookingService.getAllBookings()).thenReturn(bookings);

        mockMvc.perform(get("/booking/admin/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1L));
    }

    @Test
    void testCreateBooking_NullPassengers() throws Exception {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = null;

        when(bookingService.createBooking(any(BookingDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateBooking_InvalidFlightId() throws Exception {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = -1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(new PassengerDTO());

        when(bookingService.createBooking(any(BookingDTO.class))).thenReturn(Optional.empty());

        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateBooking_ServiceException() throws Exception {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.flightId = 1L;
        bookingDTO.userId = 1L;
        bookingDTO.passengers = Arrays.asList(new PassengerDTO());

        when(bookingService.createBooking(any(BookingDTO.class)))
                .thenThrow(new RuntimeException("Service error"));

        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookingDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testConfirmBooking_NotFound() throws Exception {
        when(bookingService.confirmBooking(1L)).thenReturn(Optional.empty());

        mockMvc.perform(put("/booking/confirm/1"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Booking not found with ID: 1"));
    }

    @Test
    void testGetBookingsByUserId_EmptyList() throws Exception {
        when(bookingService.getBookingsByUserId(1L)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/booking/get/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testGetBookingById_InvalidId() throws Exception {
        mockMvc.perform(get("/booking/get/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCancelBooking_InvalidId() throws Exception {
        mockMvc.perform(delete("/booking/delete/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateBookingStatus_Success() throws Exception {
        when(bookingService.updateBookingStatus(1L, "CONFIRMED")).thenReturn(true);

        mockMvc.perform(put("/booking/status/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking status updated successfully"));
    }

    @Test
    void testUpdateBookingStatus_NotFound() throws Exception {
        when(bookingService.updateBookingStatus(1L, "CONFIRMED")).thenReturn(false);

        mockMvc.perform(put("/booking/status/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONFIRMED\"}"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Booking not found with ID: 1"));
    }

    @Test
    void testCreateBooking_MalformedJson() throws Exception {
        mockMvc.perform(post("/booking/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetAllBookings_EmptyList() throws Exception {
        when(bookingService.getAllBookings()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/booking/admin/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void testConfirmBooking_InvalidId() throws Exception {
        mockMvc.perform(put("/booking/confirm/invalid"))
                .andExpect(status().isBadRequest());
    }
}