package com.automatrixai.backend.config;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStreamReader;
import java.util.List;

@Configuration
public class GoogleAuthConfig {

    @Bean
    public GoogleAuthorizationCodeFlow googleAuthFlow() throws Exception {

        GoogleClientSecrets secrets = GoogleClientSecrets.load(
                JacksonFactory.getDefaultInstance(),
                new InputStreamReader(
                        getClass().getResourceAsStream("/google-oauth.json")
                )
        );

        return new GoogleAuthorizationCodeFlow.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                secrets,
                List.of(
                        "https://www.googleapis.com/auth/gmail.readonly",
                        "https://www.googleapis.com/auth/gmail.send"
                )
        )
                .setAccessType("offline")
                .setDataStoreFactory(
                        new FileDataStoreFactory(new java.io.File("tokens"))
                )
                .build();
    }
}