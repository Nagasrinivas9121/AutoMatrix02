
package com.automatrixai.backend.Organization;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "organization")
@Data
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String plan = "trial";

    private Integer aiReplyUsed = 0;

    // Stored as an Instant for consistency and easy manipulation
    private Instant trialEndsAt = Instant.parse("2025-12-31T00:00:00Z");

    private Instant createdAt = Instant.now();
}