package com.example.techstore.dto.response;

import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private UserRole role;

    private UserStatus status;
}