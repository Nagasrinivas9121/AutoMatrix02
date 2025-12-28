// src/main/java/com/automatrixai/backend/ticket/TicketService.java
package com.automatrixai.backend.ticket;

import com.automatrixai.backend.kafka.KafkaProducer;
import com.automatrixai.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepo;
    private final KafkaProducer kafkaProducer;
    private final SecurityUtils securityUtils;

    // --------------------------------------------------
    // CREATE TICKET (SELLABLE FLOW)
    // --------------------------------------------------
    public Ticket create(Long userId, TicketCreateRequest req) {

        Long orgId = securityUtils.getCurrentOrganizationId();

        Ticket ticket = Ticket.builder()
                .organizationId(orgId)
                .title(req.getTitle())
                .description(req.getDescription())
                .priority(req.getPriority() == null ? "low" : req.getPriority())
                .customerId(req.getCustomerId())
                .customerEmail(req.getCustomerEmail()) // ✅ FIX
                .createdBy(userId)
                .status("open")
                .build();

        Ticket saved = ticketRepo.save(ticket);

        // 🔥 SEND AI JOB
        kafkaProducer.sendAiRequest(
                saved.getId(),
                Map.of(
                        "ticketId", saved.getId(),
                        "organizationId", orgId,
                        "prompt", saved.getDescription()
                )
        );

        return saved;
    }

    // --------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------
    public Ticket updateStatus(Long ticketId, String status) {

        Long orgId = securityUtils.getCurrentOrganizationId();

        Ticket t = ticketRepo.findByIdAndOrganizationId(ticketId, orgId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        t.setStatus(status);
        return ticketRepo.save(t);
    }

    // --------------------------------------------------
    // LIST ALL TICKETS
    // --------------------------------------------------
    public List<Ticket> listAllForOrganization() {
        return ticketRepo.findByOrganizationId(
                securityUtils.getCurrentOrganizationId()
        );
    }

    // --------------------------------------------------
    // GET SINGLE TICKET
    // --------------------------------------------------
    public Ticket getSecure(Long id) {
        return ticketRepo.findByIdAndOrganizationId(
                id,
                securityUtils.getCurrentOrganizationId()
        ).orElse(null);
    }
}