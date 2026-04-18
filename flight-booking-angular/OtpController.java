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
            
            String result = otpService.sendOtp(email, name);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send OTP");
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            
            boolean isValid = otpService.verifyOtp(email, otp);
            
            if (isValid) {
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid OTP");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Verification failed");
        }
    }
}