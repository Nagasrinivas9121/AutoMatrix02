package com.automatrixai.backend.auth;

import com.automatrixai.backend.Organization.Organization;
import com.automatrixai.backend.Organization.OrganizationRepository;
import com.automatrixai.backend.security.JwtService;
import com.automatrixai.backend.user.User;
import com.automatrixai.backend.user.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final OrganizationRepository organizationRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    // ---------------- REGISTER ----------------
    public AuthResponse register(RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // 1. Create Organization
        Organization newOrg = new Organization();
        newOrg.setName(req.getOrganizationName());
        newOrg.setPlan("trial");
        newOrg.setTrialEndsAt(Instant.now().plus(7, ChronoUnit.DAYS));
        newOrg.setAiReplyUsed(0);

        Organization savedOrg = organizationRepo.save(newOrg);

        // 2. Create User
        User user = User.builder()
                .name(req.getName())
                .organizationId(savedOrg.getId())
                .email(req.getEmail())
                .password(encoder.encode(req.getPassword()))
                .build();

        userRepo.save(user);

        // 3. Generate JWT + return AuthResponse
        String token = jwt.generate(user.getId());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .orgId(savedOrg.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    // ---------------- LOGIN ----------------
    public AuthResponse login(AuthRequest req) {

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwt.generate(user.getId());

        Organization org = organizationRepo.findById(user.getOrganizationId())
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .orgId(org.getId())
                .email(user.getEmail())
                .name(user.getName())
                .build();
    }

    // ---------------- CHANGE PASSWORD ----------------
    public void changePassword(User user, String currentPassword, String newPassword) {

        if (!encoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect.");
        }

        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);
    }
}