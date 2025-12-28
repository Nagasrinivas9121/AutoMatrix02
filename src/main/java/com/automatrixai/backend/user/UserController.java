// src/main/java/com/automatrixai/backend.user/UserController.java
package com.automatrixai.backend.user;

import com.automatrixai.backend.auth.AuthService;
import com.automatrixai.backend.Organization.Organization;
import com.automatrixai.backend.Organization.OrganizationRepository; // Corrected import
import com.automatrixai.backend.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepo;
    private final AuthService authService;
    private final SecurityUtils securityUtils;
    private final OrganizationRepository organizationRepo;


    // DTO for profile update request
    @Data
    public static class ProfileUpdateRequest {
        private String name;
        private String orgName;
    }

    // DTO for password change request
    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;
    }


    // -----------------------------------------------------------
    // PUT /api/users/update-profile
    // Updates user's name and their organization's name
    // -----------------------------------------------------------
    @PutMapping("/update-profile")
    public ResponseEntity<Void> updateProfile(@RequestBody ProfileUpdateRequest req) {

        Long userId = securityUtils.getCurrentUserId();
        Long orgId = securityUtils.getCurrentOrganizationId();

        // 1. Update User Details (Name)
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(req.getName());
        userRepo.save(user);

        // 2. Update Organization Name (Securely filtered by orgId)
        Organization organization = organizationRepo.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (req.getOrgName() != null && !req.getOrgName().isBlank()) {
            organization.setName(req.getOrgName());
            organizationRepo.save(organization);
        }

        return ResponseEntity.ok().build();
    }


    // -----------------------------------------------------------
    // PUT /api/users/change-password
    // Updates the user's password using AuthService for hashing/verification
    // -----------------------------------------------------------
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest req) {

        // Basic validation
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            return ResponseEntity.badRequest().build(); // Passwords don't match
        }

        Long userId = securityUtils.getCurrentUserId();
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // AuthService handles the password verification and update logic
        authService.changePassword(user, req.getCurrentPassword(), req.getNewPassword());

        return ResponseEntity.ok().build();
    }
}