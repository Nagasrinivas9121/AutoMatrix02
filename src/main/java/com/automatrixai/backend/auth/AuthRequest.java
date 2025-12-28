package com.automatrixai.backend.auth;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
