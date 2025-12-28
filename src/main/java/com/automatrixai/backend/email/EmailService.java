// src/main/java/com/automatrixai/backend/email/EmailService.java
package com.automatrixai.backend.email;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // ------------------------------------
    // SMTP TEST EMAIL (TEXT)
    // ------------------------------------
    public void sendEmail(String to, String subject, String body) {

        log.info("📤 Sending test email to {}", to);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Automatrixx AI <automatrixxai@gmail.com>");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        log.info("✅ Test email sent");
    }

    // ------------------------------------
    // AI AUTO-REPLY (HTML + THREAD SAFE)
    // ------------------------------------
    public void sendReply(
            String to,
            String subject,
            String body,
            String originalMessageId
    ) {
        try {
            log.info("🤖 Sending AI reply to {}", to);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Automatrixx AI <automatrixxai@gmail.com>");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtml(body), true);

            // ✅ Threading (VERY IMPORTANT)
            if (originalMessageId != null && !originalMessageId.isBlank()) {
                message.setHeader("In-Reply-To", originalMessageId);
                message.setHeader("References", originalMessageId);
            }

            mailSender.send(message);

            log.info("✅ AI reply sent successfully");

        } catch (Exception e) {
            log.error("❌ Email send failed", e);
            throw new RuntimeException("Email send failed", e);
        }
    }

    private String buildHtml(String body) {
        return """
            <div style="font-family:Arial,sans-serif;font-size:14px">
                <p>%s</p>
                <hr>
                <small style="color:gray">
                    Powered by <b>Automatrixx AI</b><br>
                    This is an automated reply
                </small>
            </div>
        """.formatted(body);
    }
}