// src/main/java/com/automatrixai/backend/ticket/Ticket.java
package com.automatrixai.backend.ticket;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "ticket")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔐 Multi-tenant isolation
    @Column(nullable = false, updatable = false)
    private Long organizationId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // open | in_progress | closed
    @Column(nullable = false)
    private String status;

    // low | medium | high
    @Column(nullable = false)
    private String priority;

    // 📧 Required for outbound automation
    @Column(nullable = false)
    private String customerEmail;

    // 🚫 Compliance (CAN-SPAM / GDPR)
    @Column(nullable = false)
    private Boolean unsubscribed;

    // 🧵 Email threading (RFC compliant)
    @Column(nullable = false, unique = true)
    private String emailThreadId;

    private Long customerId;
    private Long assigneeId;
    private Long createdBy;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    // --------------------
    // Lifecycle Hooks
    // --------------------
    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();

        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;

        if (status == null) status = "open";
        if (priority == null) priority = "low";
        if (unsubscribed == null) unsubscribed = false;

        if (emailThreadId == null) {
            emailThreadId = "<ticket-" + UUID.randomUUID() + "@automatrixx.ai>";
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}