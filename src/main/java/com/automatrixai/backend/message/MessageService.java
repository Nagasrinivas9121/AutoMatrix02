// src/main/java/com/automatrixai/backend/message/MessageService.java
package com.automatrixai.backend.message;

import com.automatrixai.backend.security.SecurityUtils;
import com.automatrixai.backend.ticket.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepo;
    private final SecurityUtils securityUtils;
    private final TicketRepository ticketRepo;

    public Message create(Long ticketId, Message.Sender sender, String body) {

        Long orgId = securityUtils.getCurrentOrganizationId();

        if (!ticketRepo.existsByIdAndOrganizationId(ticketId, orgId)) {
            throw new RuntimeException("Ticket not found or access denied");
        }

        Message message = Message.builder()
                .ticketId(ticketId)
                .organizationId(orgId)
                .sender(sender)
                .direction(
                        sender == Message.Sender.CUSTOMER
                                ? Message.Direction.IN
                                : Message.Direction.OUT
                )
                .body(body)
                .aiGenerated(sender == Message.Sender.AI)
                .createdAt(Instant.now())
                .build();

        ticketRepo.findByIdAndOrganizationId(ticketId, orgId)
                .ifPresent(t -> {
                    t.setUpdatedAt(Instant.now());
                    ticketRepo.save(t);
                });

        return messageRepo.save(message);
    }

    public List<Message> getForTicket(Long ticketId) {
        return messageRepo.findByTicketIdAndOrganizationIdOrderByCreatedAtAsc(
                ticketId,
                securityUtils.getCurrentOrganizationId()
        );
    }
}