package com.automatrixai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class OpenAIService implements AIService {

    @Value("${ai.openai.api-key}")
    private String apiKey;

    @Value("${ai.openai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String generateReply(String userMessage) {

        try {
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            String body = """
            {
              "model": "%s",
              "messages": [
                {
                  "role": "system",
                  "content": "You are a professional customer support AI. Reply politely, clearly, and concisely."
                },
                {
                  "role": "user",
                  "content": "%s"
                }
              ],
              "temperature": 0.3
            }
            """.formatted(model, userMessage);

            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            return root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        } catch (Exception e) {
            return "Thanks for reaching out. Our support team will get back to you shortly.";
        }
    }
}