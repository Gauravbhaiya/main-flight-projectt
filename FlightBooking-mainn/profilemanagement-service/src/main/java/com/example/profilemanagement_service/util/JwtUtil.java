package com.example.profilemanagement_service.util;

import com.example.profilemanagement_service.model.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final String secretKey = "supersecretkeythatisverylong123456";

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String username, Role role) {
        return Jwts.builder()
                .subject(username)
                .claim("roles", role.name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractClaims(token).get("roles", String.class);
    }

    public boolean isTokenValid(String token, String username) {
        return extractUsername(token).equals(username) &&
                extractClaims(token).getExpiration().after(new Date());
    }
}
