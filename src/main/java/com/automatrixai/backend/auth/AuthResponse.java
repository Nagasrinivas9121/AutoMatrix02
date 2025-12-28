// src/main/java/com.automatrixai.backend.auth/AuthResponse.java
package com.automatrixai.backend.auth;

import com.automatrixai.backend.Organization.Organization;
import com.automatrixai.backend.user.User;
import lombok.Builder;
import lombok.Data;
import lombok.AllArgsConstructor; // Recommended when using @Builder
import lombok.NoArgsConstructor; // Recommended when using @Builder
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    // User fields
    private String token;
    private Long id;
    private String name;
    private String email;

    // Organization fields (Mapped directly from Organization entity)
    private Long orgId;
    private String orgName;
    private String planName; // Renamed to planName for clarity
    private Integer aiReplyUsed;
    private String trialEndsAt; // Keeping as String/Instant for consistency with FE needs

    public static AuthResponse from(User user, Organization org) {
        // NOTE: The 'plan' field mapping assumes the Organization entity has a getPlanName() or getPlan() method that returns the name.
        return AuthResponse.builder()
                // User Data
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())

                // Organization Data
                .orgId(org.getId())
                .orgName(org.getName())
                .planName(org.getPlan()) // ASSUMPTION: Getter is getPlanName()
                .aiReplyUsed(org.getAiReplyUsed())
                .trialEndsAt(org.getTrialEndsAt().toString())
                .build();
    }
}