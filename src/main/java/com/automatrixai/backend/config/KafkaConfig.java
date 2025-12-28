// src/main/java/com/automatrixai/backend/config/KafkaConfig.java
package com.automatrixai.backend.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // 🚩 FIX: Import and add annotation

@Configuration // 🚩 CRITICAL FIX: Tell Spring to process this class for @Bean definitions
public class KafkaConfig {

    // Constant for the topic name
    public static final String AI_TOPIC = "ai-replies";

    /**
     * Creates the Kafka topic "ai-replies" with 3 partitions and a replication factor of 1.
     */
    @Bean
    public NewTopic aiRepliesTopic() {
        return new NewTopic(AI_TOPIC, 3, (short) 1);
    }
}