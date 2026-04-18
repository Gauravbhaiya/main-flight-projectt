// Add this controller to your Spring Boot backend:
// src/main/java/com/example/fare_service/controller/OtpController.java

package com.example.fare_service.controller;

import com.example.fare_service.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "http://localhost:4200")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String name = request.get("name");
            
            if (email == null || name == null) {
                return ResponseEntity.badRequest().body("Email and name are required");
            }
            
            String result = otpService.sendOtp(email, name);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            if (email == null || otp == null) {
                return ResponseEntity.badRequest().body("Email and OTP are required");
            }
            
            boolean isValid = otpService.verifyOtp(email, otp);
            
            if (isValid) {
                return ResponseEntity.ok("OTP verified successfully");
            } else {return ResponseEntity.badRequest().body("OTP verification failed: " + e.getMessage());
        }
    }
}}