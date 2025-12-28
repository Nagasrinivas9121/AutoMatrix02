// src/main/java/com/automatrixai/backend/email/EmailController.java
package com.automatrixai.backend.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    // ------------------------------------
    // SMTP TEST ENDPOINT
    // ------------------------------------
    @PostMapping("/test")
    public ResponseEntity<String> sendTestEmail(
            @RequestParam String to
    ) {

        log.info("📧 SMTP test request for {}", to);

        emailService.sendEmail(
                to,
                "Automatrixx AI SMTP Test ✅",
                """
                Hello 👋

                Your SMTP email setup is working perfectly.

                — Automatrixx AI
                """
        );

        return ResponseEntity.ok("✅ Test email sent to " + to);
    }
}