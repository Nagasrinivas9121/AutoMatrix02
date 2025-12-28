// src/main/java/com/automatrixai/backend/ticket/TicketController.java
package com.automatrixai.backend.ticket;

import com.automatrixai.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final SecurityUtils securityUtils;

    // -------------------------------
    // CREATE TICKET (API + EMAIL SAFE)
    // -------------------------------
    @PostMapping
    public ResponseEntity<Ticket> create(@RequestBody TicketCreateRequest req) {

        Long userId = securityUtils.getCurrentUserId();

        // ✅ BASIC VALIDATION (CRITICAL)
        if (req.getCustomerEmail() == null || req.getCustomerEmail().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(null);
        }

        if (req.getSubject() == null || req.getSubject().isBlank()) {
            req.setSubject("Customer Support Request");
        }

        Ticket saved = ticketService.create(userId, req);
        return ResponseEntity.ok(saved);
    }

    // -------------------------------
    // LIST TICKETS (ORG SAFE)
    // -------------------------------
    @GetMapping
    public ResponseEntity<List<Ticket>> list() {
        return ResponseEntity.ok(
                ticketService.listAllForOrganization()
        );
    }

    // -------------------------------
    // GET SINGLE TICKET
    // -------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> get(@PathVariable Long id) {

        Ticket t = ticketService.getSecure(id);
        return t == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(t);
    }

    // -------------------------------
    // UPDATE STATUS
    // -------------------------------
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestBody String status
    ) {
        Ticket t = ticketService.updateStatus(id, status);
        return ResponseEntity.ok(t);
    }
}