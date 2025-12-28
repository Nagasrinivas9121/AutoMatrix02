package com.automatrixai.backend.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/oauth/google")
@RequiredArgsConstructor
public class GoogleOAuthController {

    private final GoogleAuthorizationCodeFlow flow;

    // STEP 1: Redirect user to Google
    @GetMapping
    public void googleLogin(HttpServletResponse response) throws IOException {

        String authUrl = flow.newAuthorizationUrl()
                .setRedirectUri("http://localhost:8081/api/oauth/google/callback")
                .setAccessType("offline")
                .setApprovalPrompt("force")
                .build();

        response.sendRedirect(authUrl);
    }

    // STEP 2: Google redirects back here
    @GetMapping("/callback")
    public void callback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {

        GoogleTokenResponse tokenResponse =
                flow.newTokenRequest(code)
                        .setRedirectUri("http://localhost:8081/api/oauth/google/callback")
                        .execute();

        // TODO: replace "automatrixx-user" with real userId
        flow.createAndStoreCredential(tokenResponse, "automatrixx-user");

        // ✅ Redirect BACK to frontend
        response.sendRedirect(
                "http://localhost:5173/app/settings?email=connected"
        );
    }
}