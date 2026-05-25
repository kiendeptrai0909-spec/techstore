package com.example.techstore.controller;

import com.example.techstore.dto.request.GoogleLoginRequest;
import com.example.techstore.dto.request.LoginRequest;
import com.example.techstore.dto.request.RegisterRequest;
import com.example.techstore.dto.response.AuthResponse;
import com.example.techstore.dto.response.UserResponse;
import com.example.techstore.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return authService.getCurrentUser();
    }

    @PostMapping("/google")
    public AuthResponse loginWithGoogle(
            @Valid @RequestBody GoogleLoginRequest request
    ) {
        return authService.loginWithGoogle(request);
    }
}