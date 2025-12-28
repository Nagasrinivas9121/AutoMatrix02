package com.automatrixai.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;

    public JwtService(@Value("${jwt.secret-base64}") String secretBase64) {
        // Decode Base64 secret and generate secure key
        this.signingKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretBase64));
    }

    private SecretKey getSigningKey() {
        return this.signingKey;
    }

    // FIX #1 - JwtService MUST return String token, NOT AuthResponse
    public String generate(Long userId) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24 * 7))) // 7 days
                .signWith(getSigningKey())
                .compact();
    }

    public Long extractUserId(String token) {
        return Long.valueOf(
                Jwts.parser()
                        .verifyWith(getSigningKey()) // FIX #2 - No casting required
                        .build()
                        .parseSignedClaims(token)
                        .getPayload()
                        .getSubject()
        );
    }
}