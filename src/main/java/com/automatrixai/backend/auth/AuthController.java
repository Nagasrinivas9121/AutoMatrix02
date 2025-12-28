// src/main/java/com.automatrixai.backend.auth/AuthController.java
package com.automatrixai.backend.auth;

import com.automatrixai.backend.Organization.Organization;
import com.automatrixai.backend.Organization.OrganizationRepository; // <-- FIX: Corrected package to lowercase 'organization'
import com.automatrixai.backend.security.JwtService;
import com.automatrixai.backend.user.User;
import com.automatrixai.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwt;
    private final UserRepository userRepo;
    private final OrganizationRepository organizationRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@RequestHeader("Authorization") String header) {
        try {
            String token = header.substring(7);
            Long userId = jwt.extractUserId(token);

            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Organization organization = organizationRepository.findById(user.getOrganizationId())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            // This DTO must be created next!
            AuthResponse response = AuthResponse.from(user, organization);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Authentication error in /me: " + e.getMessage());
            return ResponseEntity.status(401).build(); // 401 Unauthorized
        }
    }
}