// src/main/java/com/automatrixai/backend/message/MessageRepository.java
package com.automatrixai.backend.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByTicketIdAndOrganizationIdOrderByCreatedAtAsc(
            Long ticketId,
            Long organizationId
    );

    // ✅ Prevent duplicate AI replies
    boolean existsByTicketIdAndSender(Long ticketId, Message.Sender sender);
}