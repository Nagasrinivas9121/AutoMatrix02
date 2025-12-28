// src/main/java/com/automatrixai/backend/email/InboundEmailReader.java
package com.automatrixai.backend.email;

import com.automatrixai.backend.ticket.Ticket;
import com.automatrixai.backend.ticket.TicketRepository;
import com.automatrixai.backend.message.MessageRepository;
import jakarta.mail.*;
import jakarta.mail.search.FlagTerm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Properties;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class InboundEmailReader {

    private final TicketRepository ticketRepo;
    private final MessageRepository messageRepo;
    private final EmailService emailService; // ✅ ADD THIS

    @Value("${spring.mail.imap.host}")
    private String host;

    @Value("${spring.mail.imap.port}")
    private int port;

    @Value("${spring.mail.imap.username}")
    private String username;

    @Value("${spring.mail.imap.password}")
    private String password;

    @Scheduled(fixedDelay = 30000)
    public void readInbox() {

        try {
            Properties props = new Properties();
            props.put("mail.store.protocol", "imaps");
            props.put("mail.imaps.ssl.enable", "true");

            Session session = Session.getInstance(props);
            Store store = session.getStore("imaps");
            store.connect(host, port, username, password);

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            Message[] mails = inbox.search(
                    new FlagTerm(new Flags(Flags.Flag.SEEN), false)
            );

            for (Message mail : mails) {

                String from = mail.getFrom()[0].toString();
                String subject = mail.getSubject();
                String body = mail.getContent().toString();

                String customerEmail = extractEmail(from);

                String threadId = mail.getHeader("Message-ID") != null
                        ? mail.getHeader("Message-ID")[0]
                        : "<ticket-" + UUID.randomUUID() + "@automatrixx.ai>";

                // ------------------------
                // CREATE TICKET
                // ------------------------
                Ticket ticket = Ticket.builder()
                        .organizationId(1L)
                        .title(subject == null ? "Email Support" : subject)
                        .description(body)
                        .customerEmail(customerEmail)
                        .unsubscribed(false)
                        .emailThreadId(threadId)
                        .status("open")
                        .priority("low")
                        .createdAt(Instant.now())
                        .build();

                Ticket saved = ticketRepo.save(ticket);

                messageRepo.save(
                        com.automatrixai.backend.message.Message.builder()
                                .ticketId(saved.getId())
                                .organizationId(saved.getOrganizationId())
                                .sender(com.automatrixai.backend.message.Message.Sender.CUSTOMER)
                                .direction(com.automatrixai.backend.message.Message.Direction.IN)
                                .body(body)
                                .createdAt(Instant.now())
                                .build()
                );

                // ------------------------
                // AUTO REPLY (IMPORTANT)
                // ------------------------
                String aiReply = """
                        Hi 👋,

                        Thanks for contacting Automatrixx AI.
                        We’ve received your message and are working on it.

                        This is an automated reply.

                        — Automatrixx AI
                        """;

                emailService.sendReply(
                        customerEmail,
                        "Re: " + subject,
                        aiReply,
                        threadId
                );

                log.info("✅ Auto-reply sent to {}", customerEmail);

                mail.setFlag(Flags.Flag.SEEN, true);
            }

            inbox.close();
            store.close();

        } catch (Exception e) {
            log.error("❌ Inbound Email Error", e);
        }
    }

    private String extractEmail(String from) {
        if (from.contains("<")) {
            return from.substring(from.indexOf("<") + 1, from.indexOf(">"));
        }
        return from;
    }
}