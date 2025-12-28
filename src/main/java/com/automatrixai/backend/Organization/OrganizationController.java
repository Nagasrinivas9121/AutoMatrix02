// src/main/java/com/automatrixai/backend/organization/OrganizationController.java
package com.automatrixai.backend.Organization; // 🚩 FIX 2: Corrected package to lowercase 'organization'

import com.automatrixai.backend.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/organization") // Base URL: /api/organization
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationRepository organizationRepo; // <-- Correctly injected field
    private final SecurityUtils securityUtils;

    // DTO for updating organization information (optional fields for update)
    @Data
    public static class OrganizationUpdateRequest {
        private String name;
    }

    // -----------------------------------------------------------
    // GET /api/organization/me : Retrieve current organization details
    // -----------------------------------------------------------
    @GetMapping("/me")
    public ResponseEntity<Organization> getOrganizationDetails() {
        // 1. Get the organization ID from the authenticated user
        Long orgId = securityUtils.getCurrentOrganizationId();

        // 2. Fetch and return the organization data
        Optional<Organization> organization = organizationRepo.findById(orgId);

        return organization
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // -----------------------------------------------------------
    // PUT /api/organization/me : Update general organization details
    // -----------------------------------------------------------
    @PutMapping("/me")
    public ResponseEntity<Organization> updateOrganizationDetails(
            @RequestBody OrganizationUpdateRequest updateRequest)
    {
        // 1. Get the organization ID from the authenticated user
        Long orgId = securityUtils.getCurrentOrganizationId();

        // 2. Find the existing organization
        Optional<Organization> optionalOrg = organizationRepo.findById(orgId);

        if (optionalOrg.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Organization organization = optionalOrg.get();

        // 3. Apply updates (only allowed fields)
        if (updateRequest.getName() != null && !updateRequest.getName().isBlank()) {
            organization.setName(updateRequest.getName());
        }

        // 4. Save and return the updated entity
        Organization updatedOrg = organizationRepo.save(organization); // 🚩 FIX 1: Used the correct injected field
        return ResponseEntity.ok(updatedOrg);
    }
}