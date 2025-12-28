// src/main/java/com/automatrixai/backend.user/User.java (SaaS-Ready)
package com.automatrixai.backend.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user") // Renamed 'user' to 'app_user' to avoid SQL keyword conflicts
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // 🚩 FIX 1: Removed organizationName (will move to Organization entity)

    // 🚩 ADDED: Link user directly to their organization ID
    // This ID is used throughout the application for data filtering.
    @Column(name = "organization_id", nullable = false)
    private Long organizationId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;


}