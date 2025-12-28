// src/main/java/com/automatrixai/backend/organization/OrganizationRepository.java
package com.automatrixai.backend.Organization; // 🚩 FIX 1: Corrected package to lowercase 'organization'

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Import the Organization entity (which is now in the same package)
import com.automatrixai.backend.Organization.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    // Basic CRUD inherited

    // You may need a findBy method later for security or lookup,
    // but the basic implementation is ready for compilation.
}