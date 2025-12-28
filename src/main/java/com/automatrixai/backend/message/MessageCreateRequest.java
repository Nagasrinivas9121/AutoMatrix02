// src/main/java/com/automatrixai/backend/message/MessageCreateRequest.java
package com.automatrixai.backend.message;

import lombok.Data;

@Data
public class MessageCreateRequest {

    // Ticket to which this message belongs
    private Long ticketId;

    // Message text/content
    private String body;

    // Who sent the message
    // CUSTOMER | AGENT | AI
    private Message.Sender sender;
}