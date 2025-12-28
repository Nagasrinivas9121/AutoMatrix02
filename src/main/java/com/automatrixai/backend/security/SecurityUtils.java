// src/main/java/com.automatrixai.backend.security/SecurityUtils.java
package com.automatrixai.backend.security;

import com.automatrixai.backend.user.User;
import com.automatrixai.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityUtils {

    // Dependency to look up the organization ID linked to the user
    private final UserRepository userRepo;

    // Note: JwtService dependency is not needed here if the JWT filter
    // already places the User ID directly into the SecurityContext.

    /**
     * Retrieves the authenticated User's ID (which is the subject of the JWT).
     * @return The User ID (Long).
     */
    public Long getCurrentUserId() {
        // Retrieves the authenticated principal, which we assume is the User ID (as a String)
        // after processing by the JwtAuthenticationFilter.
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof String) {
            return Long.valueOf((String) principal);
        }

        // Fallback for an unauthenticated state (though usually handled by filters)
        throw new RuntimeException("User not authenticated or principal type unrecognized.");
    }

    /**
     * Retrieves the Organization ID for the current authenticated user.
     * This is critical for enforcing multi-tenancy rules (data isolation).
     * @return The Organization ID (Long).
     */
    public Long getCurrentOrganizationId() {
        Long userId = getCurrentUserId();

        // Looks up the User entity to find the linked organizationId.
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in DB."));

        return user.getOrganizationId();
    }
}