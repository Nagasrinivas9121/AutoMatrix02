package com.automatrixai.backend.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String organizationName; // MUST match JSON field name
    private String email;
    private String password;
}
