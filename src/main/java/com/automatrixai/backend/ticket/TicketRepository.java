// src/main/java/com.automatrixai.backend.ticket/TicketRepository.java
package com.automatrixai.backend.ticket;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository // 🚩 Added @Repository annotation
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // -----------------------------------------------------
    // 🚩 CRITICAL FIX: Multi-Tenancy Read Filter (Used by list() endpoint)
    // -----------------------------------------------------
    List<Ticket> findByOrganizationId(Long organizationId);

    // -----------------------------------------------------
    // 🚩 CRITICAL FIX: Secure Single Read (Used by get(id) endpoint)
    // Ensures a user can only view a ticket they own.
    // -----------------------------------------------------
    Optional<Ticket> findByIdAndOrganizationId(Long id, Long organizationId);

    // -----------------------------------------------------
    // Helper Methods (Now secure because they include the Organization ID)
    // -----------------------------------------------------
    List<Ticket> findByCustomerIdAndOrganizationId(Long customerId, Long organizationId);

    // Existence check (Useful for data validation before saving messages/updates)
    boolean existsByIdAndOrganizationId(Long id, Long organizationId);


    // If you still need the original methods, they must be filtered:
    // List<Ticket> findByCreatedByAndOrganizationId(Long userId, Long organizationId);
}