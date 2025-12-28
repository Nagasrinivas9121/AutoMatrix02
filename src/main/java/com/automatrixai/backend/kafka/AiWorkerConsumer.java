// src/main/java/com/automatrixai/backend/kafka/AiWorkerConsumer.java
package com.automatrixai.backend.kafka;

import com.automatrixai.backend.email.EmailService;
import com.automatrixai.backend.message.Message;
import com.automatrixai.backend.message.MessageRepository;
import com.automatrixai.backend.service.AIService;
import com.automatrixai.backend.ticket.Ticket;
import com.automatrixai.backend.ticket.TicketRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

import static com.automatrixai.backend.config.KafkaConfig.AI_TOPIC;

@Component
@RequiredArgsConstructor
public class AiWorkerConsumer {

    private final ObjectMapper objectMapper;
    private final AIService aiService;
    private final MessageRepository messageRepository;
    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    @KafkaListener(topics = AI_TOPIC, groupId = "automatrix-ai-workers")
    public void consume(String payload) {

        try {
            JsonNode node = objectMapper.readTree(payload);

            Long ticketId = node.get("ticketId").asLong();
            Long organizationId = node.get("organizationId").asLong();
            String prompt = node.has("prompt") ? node.get("prompt").asText() : "";

            // 🛑 PREVENT DUPLICATE AI REPLY
            if (messageRepository.existsByTicketIdAndSender(
                    ticketId, Message.Sender.AI)) {
                System.out.println("⚠️ AI reply already exists for ticket " + ticketId);
                return;
            }

            // 🔮 Generate AI reply
            String aiReply = aiService.generateReply(prompt);

            // 💾 Save AI message
            messageRepository.save(
                    Message.builder()
                            .ticketId(ticketId)
                            .organizationId(organizationId)
                            .sender(Message.Sender.AI)
                            .direction(Message.Direction.OUT)
                            .body(aiReply)
                            .aiGenerated(true)
                            .createdAt(Instant.now())
                            .build()
            );

            // 📬 Email delivery
            ticketRepository.findByIdAndOrganizationId(ticketId, organizationId)
                    .ifPresent(ticket -> {

                        // 🛑 Respect unsubscribe
                        if (Boolean.TRUE.equals(ticket.getUnsubscribed())) {
                            System.out.println("🔕 Email skipped (unsubscribed)");
                            return;
                        }

                        // ✅ ENSURE THREAD ID
                        if (ticket.getEmailThreadId() == null) {
                            ticket.setEmailThreadId(
                                    "<ticket-" + ticket.getId() + "@automatrixx.ai>"
                            );
                        }

                        emailService.sendReply(
                                ticket.getCustomerEmail(),
                                "Re: " + ticket.getTitle(),
                                aiReply,
                                ticket.getEmailThreadId()
                        );

                        ticket.setUpdatedAt(Instant.now());
                        ticketRepository.save(ticket);
                    });

            System.out.println("✅ AI reply sent for ticket " + ticketId);

        } catch (Exception ex) {
            System.err.println("❌ AI Worker Error: " + ex.getMessage());
        }
    }
}