package com.example.profilemanagement_service.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public void sendOtp(String email, String name) {
        String otp = String.format("%06d", random.nextInt(1000000));
        long expirationTime = System.currentTimeMillis() + (5 * 60 * 1000);
        otpStorage.put(email, new OtpData(otp, expirationTime));
        System.out.println("[DEV] OTP for " + email + ": " + otp);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData stored = otpStorage.get(email);

        if (stored == null) return false;

        if (System.currentTimeMillis() > stored.expirationTime) {
            otpStorage.remove(email);
            return false;
        }

        if (stored.otp.equals(otp)) {
            otpStorage.remove(email);
            return true;
        }

        return false;
    }

    private static class OtpData {
        final String otp;
        final long expirationTime;

        OtpData(String otp, long expirationTime) {
            this.otp = otp;
            this.expirationTime = expirationTime;
        }
    }
}
