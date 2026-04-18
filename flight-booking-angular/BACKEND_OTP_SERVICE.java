// Add this service to your Spring Boot backend:
// src/main/java/com/example/fare_service/service/OtpService.java

package com.example.fare_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily (in production, use Redis or database)
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String sendOtp(String email, String name) {
        try {
            // Generate 6-digit OTP
            String otp = String.format("%06d", random.nextInt(1000000));
            
            // Store OTP with expiration (5 minutes)
            long expirationTime = System.currentTimeMillis() + (5 * 60 * 1000);
            otpStorage.put(email, new OtpData(otp, expirationTime));
            
            // Send email
            sendOtpEmail(email, name, otp);
            
            return "OTP sent successfully to " + email;
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP: " + e.getMessage());
        }
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData storedOtp = otpStorage.get(email);
        
        if (storedOtp == null) {
            return false; // No OTP found
        }
        
        if (System.currentTimeMillis() > storedOtp.getExpirationTime()) {
            otpStorage.remove(email); // Remove expired OTP
            return false; // OTP expired
        }
        
        if (storedOtp.getOtp().equals(otp)) {
            otpStorage.remove(email); // Remove used OTP
            return true; // OTP is valid
        }
        
        return false; // Invalid OTP
    }

    private void sendOtpEmail(String email, String name, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("FlightHub - Email Verification OTP");
        message.setText(buildEmailContent(name, otp));
        message.setFrom("noreply@flighthub.com"); // Replace with your email
        
        mailSender.send(message);
    }

    private String buildEmailContent(String name, String otp) {
        return String.format(
            "Dear %s,\n\n" +
            "Welcome to FlightHub! 🛫\n\n" +
            "Your email verification OTP is: %s\n\n" +
            "This OTP is valid for 5 minutes only.\n\n" +
            "If you didn't request this verification, please ignore this email.\n\n" +
            "Happy Flying!\n" +
            "FlightHub Team",
            name, otp
        );
    }

    // Inner class to store OTP data
    private static class OtpData {
        private final String otp;
        private final long expirationTime;

        public OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpirationTime() {
            return expirationTime;
        }
    }
}