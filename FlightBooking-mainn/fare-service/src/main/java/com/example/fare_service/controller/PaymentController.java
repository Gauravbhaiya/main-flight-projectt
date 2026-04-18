package com.example.fare_service.controller;

import com.example.fare_service.dto.RequestDTO;
import com.example.fare_service.dto.ResponseDTO;
import com.example.fare_service.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/create-order")
    public ResponseEntity<?> createOrderGet(@RequestParam Long bookingId, @RequestParam Double amount) {
        try {
            ResponseDTO response = paymentService.createOrder(bookingId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam Long bookingId, @RequestParam Double amount) {
        try {
            ResponseDTO response = paymentService.createOrder(bookingId, amount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Payment order creation failed: " + e.getMessage());
            return ResponseEntity.status(500).body("Failed to create payment order: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("razorpay_order_id");
            String paymentId = data.get("razorpay_payment_id");
            String signature = data.get("razorpay_signature");
            double amount = Double.parseDouble(data.get("amount"));

            boolean isValid = paymentService.verifySignature(orderId, paymentId, signature);

            if (isValid) {
                return ResponseEntity.ok("Payment Verified Successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment Verification Failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment verification error: " + e.getMessage());
        }
    }

    @PostMapping("/payment-success")
    public ResponseEntity<String> handlePaymentSuccess(@RequestParam("bookingId") String bookingId) {
        try {
            String responseMessage = paymentService.handlePaymentSuccess(bookingId);
            System.out.println("message is " + responseMessage);
            if (responseMessage.contains("Failed")) {
                return ResponseEntity.status(500).body(responseMessage);
            } else {
                return ResponseEntity.ok(responseMessage);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Payment success handling failed: " + e.getMessage());
        }
    }
}
