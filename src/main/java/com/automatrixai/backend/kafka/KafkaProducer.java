// src/main/java/com/automatrixai/backend/kafka/KafkaProducer.java
package com.automatrixai.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static com.automatrixai.backend.config.KafkaConfig.AI_TOPIC;

@Component
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Publish AI processing job
     */
    public void sendAiRequest(Long ticketId, Map<String, Object> payload) {

        try {
            // --------------------------------
            // Build safe message payload
            // --------------------------------
            Map<String, Object> message = new HashMap<>();
            message.put("ticketId", ticketId);
            message.putAll(payload);

            String json = objectMapper.writeValueAsString(message);

            // --------------------------------
            // Publish to Kafka
            // --------------------------------
            kafkaTemplate.send(
                    AI_TOPIC,
                    String.valueOf(ticketId), // partition key
                    json
            );

            System.out.println("📤 AI job sent for ticket " + ticketId);

        } catch (Exception ex) {
            System.err.println("❌ Kafka AI publish failed for ticket " + ticketId);
            throw new RuntimeException("Failed to publish AI request", ex);
        }
    }
}