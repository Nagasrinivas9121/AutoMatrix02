// src/main/java/com/automatrixai/backend/message/MessageResponse.java
package com.automatrixai.backend.message;

import lombok.Data;
import java.time.Instant;

@Data
public class MessageResponse {

    private Long id;
    private Long ticketId;
    private Long organizationId;
    private String content;     // maps from Message.body
    private Instant createdAt;  // ✅ clean API field

    public static MessageResponse from(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setTicketId(message.getTicketId());
        response.setOrganizationId(message.getOrganizationId());
        response.setContent(message.getBody());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}