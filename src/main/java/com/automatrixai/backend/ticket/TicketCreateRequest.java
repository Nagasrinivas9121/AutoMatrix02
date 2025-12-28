package com.automatrixai.backend.ticket;


import lombok.Data;

@Data
public class TicketCreateRequest {
    private String title;
    private String description;
    private String priority;
    private Long customerId;
    private String Subject;
    private String customerEmail;
}
