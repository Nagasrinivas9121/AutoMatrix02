// src/main/java/com/automatrixai/backend/customer/CustomerController.java
package com.automatrixai.backend.customer;

import com.automatrixai.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepo;
    private final SecurityUtils securityUtils;

    // GET /api/customers
    @GetMapping
    public List<Customer> loadCustomers() {
        Long orgId = securityUtils.getCurrentOrganizationId();
        return customerRepo.findByOrganizationId(orgId);
    }

    // POST /api/customers
    @PostMapping
    public ResponseEntity<Customer> saveCustomer(@RequestBody Customer customer) {
        Long orgId = securityUtils.getCurrentOrganizationId();
        customer.setOrganizationId(orgId);
        customer.setCreated_at(Instant.now());
        Customer savedCustomer = customerRepo.save(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    // PUT /api/customers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customerDetails
    ) {
        Long orgId = securityUtils.getCurrentOrganizationId();

        Optional<Customer> existingCustomer =
                customerRepo.findByIdAndOrganizationId(id, orgId);

        if (existingCustomer.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer customer = existingCustomer.get();
        customer.setName(customerDetails.getName());
        customer.setEmail(customerDetails.getEmail());
        customer.setPhone(customerDetails.getPhone());

        return ResponseEntity.ok(customerRepo.save(customer));
    }

    // DELETE /api/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        Long orgId = securityUtils.getCurrentOrganizationId();

        if (!customerRepo.existsByIdAndOrganizationId(id, orgId)) {
            return ResponseEntity.notFound().build();
        }

        customerRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}