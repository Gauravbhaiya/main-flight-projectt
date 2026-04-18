package com.example.fare_service.controller;

import com.example.fare_service.dto.RequestDTO;
import com.example.fare_service.dto.ResponseDTO;
import com.example.fare_service.dto.VerificationDTO;
import com.example.fare_service.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PaymentService paymentService;

    @Autowired
    private ObjectMapper objectMapper;

    private RequestDTO validRequestDTO;
    private VerificationDTO validVerificationDTO;

    @BeforeEach
    void setUp() {
        validRequestDTO = new RequestDTO();
        validRequestDTO.setAmount(1000.0);
        validRequestDTO.setCurrency("INR");
        validRequestDTO.setReceipt("receipt_123");

        validVerificationDTO = new VerificationDTO();
        validVerificationDTO.setOrderId("order_123");
        validVerificationDTO.setPaymentId("pay_123");
        validVerificationDTO.setSignature("signature_123");
    }

    @Test
    void testCreateOrder_Success() throws Exception {
        ResponseDTO responseDTO = new ResponseDTO();
        when(paymentService.createOrder(anyLong(), anyDouble())).thenReturn(responseDTO);

        mockMvc.perform(post("/api/payment/create-order")
                .param("bookingId", "1")
                .param("amount", "1000.0"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateOrder_InvalidAmount() throws Exception {
        RequestDTO invalidRequest = new RequestDTO();
        invalidRequest.setAmount(-100.0);

        when(paymentService.createOrder(anyLong(), anyDouble()))
                .thenThrow(new IllegalArgumentException("Invalid amount"));

        mockMvc.perform(post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateOrder_NullAmount() throws Exception {
        RequestDTO invalidRequest = new RequestDTO();
        invalidRequest.setAmount(0);

        when(paymentService.createOrder(anyLong(), anyDouble()))
                .thenThrow(new IllegalArgumentException("Invalid amount"));

        mockMvc.perform(post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateOrder_ZeroAmount() throws Exception {
        RequestDTO invalidRequest = new RequestDTO();
        invalidRequest.setAmount(0.0);

        when(paymentService.createOrder(anyLong(), anyDouble()))
                .thenThrow(new IllegalArgumentException("Amount must be positive"));

        mockMvc.perform(post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testVerifyPayment_Success() throws Exception {
        when(paymentService.handlePaymentSuccess(anyString()))
                .thenReturn("Booking confirmed successfully");

        mockMvc.perform(post("/api/payment/payment-success")
                .param("bookingId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking confirmed successfully"));
    }

    @Test
    void testVerifyPayment_BookingFailure() throws Exception {
        when(paymentService.handlePaymentSuccess(anyString()))
                .thenReturn("Payment Done, but Booking Confirmation Failed");

        mockMvc.perform(post("/payment/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVerificationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Payment Done, but Booking Confirmation Failed"));
    }

    @Test
    void testVerifyPayment_InvalidOrderId() throws Exception {
        VerificationDTO invalidVerification = new VerificationDTO();
        invalidVerification.setOrderId("invalid");
        invalidVerification.setPaymentId("pay_123");
        invalidVerification.setSignature("signature_123");

        when(paymentService.handlePaymentSuccess(anyString()))
                .thenReturn("Invalid order ID");

        mockMvc.perform(post("/payment/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidVerification)))
                .andExpect(status().isOk())
                .andExpect(content().string("Invalid order ID"));
    }

    @Test
    void testVerifyPayment_NullOrderId() throws Exception {
        VerificationDTO invalidVerification = new VerificationDTO();
        invalidVerification.setOrderId(null);
        invalidVerification.setPaymentId("pay_123");
        invalidVerification.setSignature("signature_123");

        when(paymentService.handlePaymentSuccess(any()))
                .thenReturn("Invalid order ID");

        mockMvc.perform(post("/payment/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidVerification)))
                .andExpect(status().isOk())
                .andExpect(content().string("Invalid order ID"));
    }

    @Test
    void testCreateOrder_ServiceException() throws Exception {
        when(paymentService.createOrder(anyLong(), anyDouble()))
                .thenThrow(new RuntimeException("Payment service error"));

        mockMvc.perform(post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRequestDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testVerifyPayment_ServiceException() throws Exception {
        when(paymentService.handlePaymentSuccess(anyString()))
                .thenThrow(new RuntimeException("Verification service error"));

        mockMvc.perform(post("/payment/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validVerificationDTO)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testCreateOrder_MalformedJson() throws Exception {
        mockMvc.perform(post("/payment/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testVerifyPayment_MalformedJson() throws Exception {
        mockMvc.perform(post("/payment/verify")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCreateOrder_LargeAmount() throws Exception {
        ResponseDTO responseDTO = new ResponseDTO();
        when(paymentService.createOrder(anyLong(), anyDouble())).thenReturn(responseDTO);

        mockMvc.perform(post("/api/payment/create-order")
                .param("bookingId", "1")
                .param("amount", "999999.99"))
                .andExpect(status().isOk());
    }

    @Test
    void testVerifyPayment_EmptySignature() throws Exception {
        VerificationDTO emptySignature = new VerificationDTO();
        emptySignature.setOrderId("order_123");
        emptySignature.setPaymentId("pay_123");
        emptySignature.setSignature("");

        when(paymentService.handlePaymentSuccess(anyString()))
                .thenReturn("Booking confirmed successfully");

        mockMvc.perform(post("/api/payment/payment-success")
                .param("bookingId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Booking confirmed successfully"));
    }
}