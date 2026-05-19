package com.example.techstore.dto.response;

import com.example.techstore.enums.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String accessToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;

    private String fullName;

    private String email;

    private UserRole role;
}