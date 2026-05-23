package com.example.techstore.dto.response;

import com.example.techstore.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminEmployeeResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String role;

    private UserStatus status;

    private LocalDateTime createdAt;
}