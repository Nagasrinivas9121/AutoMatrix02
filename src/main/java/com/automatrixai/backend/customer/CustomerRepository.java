// src/main/java/com/automatrixai/backend/customer/CustomerRepository.java
package com.automatrixai.backend.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // 1. READ: Filter findAll() to only return customers belonging to the organization
    // Used by CustomerController.loadCustomers()
    List<Customer> findByOrganizationId(Long organizationId);

    // 2. READ ONE: Filter findById() to ensure the customer belongs to the organization
    // Used by CustomerController.updateCustomer()
    Optional<Customer> findByIdAndOrganizationId(Long id, Long organizationId);

    // 3. EXISTENCE CHECK: Filter existsById() for deletion/validation
    // Used by CustomerController.deleteCustomer()
    boolean existsByIdAndOrganizationId(Long id, Long organizationId);

    // Note: save() and delete() methods inherited from JpaRepository will be called
    // by the controller after the 'organizationId' is correctly set or validated.
}