package com.example.profilemanagement_service.controller;

import com.example.profilemanagement_service.service.OtpService;
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
                return ResponseEntity.badRequest().body("Email and name required");
            }

            otpService.sendOtp(email, name);
            return ResponseEntity.ok("OTP sent successfully");
        } catch (Exception e) {
            System.err.println("OTP send error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to send OTP: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");

            if (email == null || otp == null) {
                return ResponseEntity.badRequest().body("Email and OTP required");
            }

            boolean isValid = otpService.verifyOtp(email, otp);

            if (isValid) {
                return ResponseEntity.ok("OTP verified successfully");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
        } catch (Exception e) {
            System.err.println("OTP verify error: " + e.getMessage());
            return ResponseEntity.status(500).body("Verification failed");
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("OTP Controller is working");
    }
}
