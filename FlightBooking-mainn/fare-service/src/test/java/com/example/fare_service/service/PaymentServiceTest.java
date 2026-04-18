package com.example.fare_service.service;

import com.example.fare_service.dto.ResponseDTO;
import com.example.fare_service.feign.BookingInterface;
import com.example.fare_service.model.Payment;
import com.example.fare_service.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingInterface bookingInterface;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void testCreateOrder_InvalidInput() {
        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(null, 1000.0);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(1L, null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(1L, -100.0);
        });
    }

    @Test
    void testSavePayment() {
        Payment payment = new Payment();
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        paymentService.savePayment("order_123", 1000.0, "INR", "created");

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void testHandlePaymentSuccess_Success() {
        when(bookingInterface.confirmBooking(1L)).thenReturn("Booking confirmed successfully");

        String result = paymentService.handlePaymentSuccess("1");

        assertEquals("Booking confirmed successfully", result);
        verify(bookingInterface).confirmBooking(1L);
    }

    @Test
    void testHandlePaymentSuccess_BookingFailure() {
        when(bookingInterface.confirmBooking(1L)).thenThrow(new RuntimeException("Booking service error"));

        String result = paymentService.handlePaymentSuccess("1");

        assertTrue(result.contains("Payment Done, but Booking Confirmation Failed"));
    }

    @Test
    void testCreateOrder_ValidInput() throws Exception {
        ResponseDTO result = paymentService.createOrder(1L, 1000.0);
        
        assertNotNull(result);
    }

    @Test
    void testCreateOrder_ZeroAmount() {
        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(1L, 0.0);
        });
    }

    @Test
    void testCreateOrder_NullBookingId() {
        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(null, 1000.0);
        });
    }

    @Test
    void testSavePayment_ValidData() {
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());

        paymentService.savePayment("order_123", 1000.0, "INR", "created");

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void testSavePayment_NullOrderId() {
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());

        paymentService.savePayment(null, 1000.0, "INR", "created");

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void testSavePayment_EmptyStatus() {
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());

        paymentService.savePayment("order_123", 1000.0, "INR", "");

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void testHandlePaymentSuccess_InvalidBookingId() {
        String result = paymentService.handlePaymentSuccess("invalid");

        assertTrue(result.contains("Invalid booking ID") || result.contains("Payment Done, but Booking Confirmation Failed"));
    }

    @Test
    void testHandlePaymentSuccess_EmptyBookingId() {
        String result = paymentService.handlePaymentSuccess("");

        assertTrue(result.contains("Invalid booking ID") || result.contains("Payment Done, but Booking Confirmation Failed"));
    }

    @Test
    void testHandlePaymentSuccess_NullBookingId() {
        String result = paymentService.handlePaymentSuccess(null);

        assertTrue(result.contains("Invalid booking ID") || result.contains("Payment Done, but Booking Confirmation Failed"));
    }

    @Test
    void testCreateOrder_LargeAmount() throws Exception {
        ResponseDTO result = paymentService.createOrder(1L, 999999.99);
        
        assertNotNull(result);
    }

    @Test
    void testSavePayment_DifferentCurrency() {
        when(paymentRepository.save(any(Payment.class))).thenReturn(new Payment());

        paymentService.savePayment("order_123", 100.0, "USD", "completed");

        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void testSavePayment_RepositoryException() {
        when(paymentRepository.save(any(Payment.class)))
                .thenThrow(new RuntimeException("Database error"));

        assertThrows(RuntimeException.class, () -> {
            paymentService.savePayment("order_123", 1000.0, "INR", "created");
        });
    }

    @Test
    void testHandlePaymentSuccess_BookingServiceTimeout() {
        when(bookingInterface.confirmBooking(1L))
                .thenThrow(new RuntimeException("Connection timeout"));

        String result = paymentService.handlePaymentSuccess("1");

        assertTrue(result.contains("Payment Done, but Booking Confirmation Failed"));
        assertTrue(result.contains("Connection timeout"));
    }

    @Test
    void testCreateOrder_NegativeBookingId() {
        assertThrows(IllegalArgumentException.class, () -> {
            paymentService.createOrder(-1L, 1000.0);
        });
    }
}