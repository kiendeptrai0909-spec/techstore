package com.example.techstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {

    @NotBlank(message = "Google credential không được để trống")
    private String credential;
}