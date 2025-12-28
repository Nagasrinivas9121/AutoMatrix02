// src/main/java/com/automatrixai/backend/ticket/TicketResponse.java
package com.automatrixai.backend.ticket;

import lombok.Data;
import java.time.Instant;

@Data
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;

    private Long customerId;
    private String customerEmail; // ✅ REQUIRED

    private Long organizationId;
    private Long createdBy;

    private Instant createdAt;
    private Instant updatedAt;

    public static TicketResponse from(Ticket t) {
        TicketResponse r = new TicketResponse();

        r.setId(t.getId());
        r.setTitle(t.getTitle());
        r.setDescription(t.getDescription());
        r.setPriority(t.getPriority());
        r.setStatus(t.getStatus());

        r.setCustomerId(t.getCustomerId());
        r.setCustomerEmail(t.getCustomerEmail()); // ✅ MISSING FIX

        r.setOrganizationId(t.getOrganizationId());
        r.setCreatedBy(t.getCreatedBy());

        r.setCreatedAt(t.getCreatedAt());
        r.setUpdatedAt(t.getUpdatedAt());

        return r;
    }
}