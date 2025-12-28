// src/main/java/com/automatrixai/backend/message/MessageController.java
package com.automatrixai.backend.message;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @Data
    public static class CreateRequest {
        private Long ticketId;
        private String body;
        private Message.Sender sender;
    }

    @PostMapping
    public ResponseEntity<Message> create(@RequestBody CreateRequest req) {
        return ResponseEntity.ok(
                messageService.create(
                        req.getTicketId(),
                        req.getSender(),
                        req.getBody()
                )
        );
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Message>> getForTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(messageService.getForTicket(ticketId));
    }
}