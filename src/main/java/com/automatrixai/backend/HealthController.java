// src/main/java/com/automatrixai/backend/HealthController.java

package com.automatrixai.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health") // 🚩 FIX: Changed endpoint to avoid conflict with /auth routes
    public Map<String, Object> health() {
        Map<String, Object> res = new HashMap<>();
        res.put("status", "Healthy");
        res.put("time", Instant.now().toString());
        res.put("message", "Automatrixx AI Backend Service");
        return res;
    }
}