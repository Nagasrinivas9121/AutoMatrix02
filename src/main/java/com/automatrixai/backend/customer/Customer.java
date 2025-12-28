// src/main/java/com/automatrixai/backend/customer/Customer.java
package com.automatrixai.backend.customer;

import jakarta.persistence.Column; // <-- Import needed for @Column
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "customer")
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phone;

    private Instant created_at;

    @Column(nullable = false)
    private Long organizationId;
}