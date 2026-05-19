package com.example.techstore.dto.response;

import com.example.techstore.enums.ContactStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ContactMessageResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String subject;

    private String message;

    private ContactStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}