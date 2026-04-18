package com.example.fare_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String sendOtp(String email, String name) {
        String otp = String.format("%06d", random.nextInt(1000000));
        long expirationTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5 minutes
        
        otpStorage.put(email, new OtpData(otp, expirationTime));
        sendOtpEmail(email, name, otp);
        
        return "OTP sent to " + email;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData storedOtp = otpStorage.get(email);
        
        if (storedOtp == null || System.currentTimeMillis() > storedOtp.expirationTime) {
            otpStorage.remove(email);
            return false;
        }
        
        if (storedOtp.otp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }
        
        return false;
    }

    private void sendOtpEmail(String email, String name, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("FlightHub - Email Verification");
        message.setText("Dear " + name + ",\n\nYour OTP is: " + otp + "\n\nValid for 5 minutes.\n\nFlightHub Team");
        message.setFrom("noreply@flighthub.com");
        
        mailSender.send(message);
    }

    private static class OtpData {
        String otp;
        long expirationTime;

        OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
    }
}