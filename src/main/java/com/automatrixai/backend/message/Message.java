// src/main/java/com/automatrixai/backend/message/Message.java
package com.automatrixai.backend.message;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "messages",
        indexes = {
                @Index(name = "idx_message_ticket", columnList = "ticketId"),
                @Index(name = "idx_message_org", columnList = "organizationId")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ticketId;

    @Column(nullable = false)
    private Long organizationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sender sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Direction direction;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(nullable = false)
    private Boolean aiGenerated = false;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        if (aiGenerated == null) aiGenerated = false;
    }

    public enum Sender {
        CUSTOMER,
        AGENT,
        AI
    }

    public enum Direction {
        IN,
        OUT
    }
}