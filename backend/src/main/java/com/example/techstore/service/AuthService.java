package com.example.techstore.service;

import com.example.techstore.dto.request.GoogleLoginRequest;
import com.example.techstore.dto.request.LoginRequest;
import com.example.techstore.dto.request.RegisterRequest;
import com.example.techstore.dto.response.AuthResponse;
import com.example.techstore.dto.response.UserResponse;
import com.example.techstore.entity.User;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.security.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${google.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new BadRequestException("Email đã được sử dụng");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_CUSTOMER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return toAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException exception) {
            throw new BadRequestException("Email hoặc mật khẩu không đúng");
        }

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Email hoặc mật khẩu không đúng"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Tài khoản đã bị khóa hoặc ngừng hoạt động");
        }

        String token = jwtService.generateToken(user);

        return toAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request) {
        GoogleIdToken.Payload payload = verifyGoogleCredential(request.getCredential());

        String email = payload.getEmail();
        Boolean emailVerified = payload.getEmailVerified();

        if (email == null || !Boolean.TRUE.equals(emailVerified)) {
            throw new BadRequestException("Email Google chưa được xác thực");
        }

        String normalizedEmail = email.toLowerCase();
        String fullName = (String) payload.get("name");
        String avatar = (String) payload.get("picture");

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .fullName(fullName != null && !fullName.isBlank() ? fullName : normalizedEmail)
                            .email(normalizedEmail)
                            .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .role(UserRole.ROLE_CUSTOMER)
                            .status(UserStatus.ACTIVE)
                            .avatar(avatar)
                            .build();

                    return userRepository.save(newUser);
                });

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadRequestException("Tài khoản đã bị khóa hoặc ngừng hoạt động");
        }

        if ((user.getAvatar() == null || user.getAvatar().isBlank()) && avatar != null) {
            user.setAvatar(avatar);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);

        return toAuthResponse(user, token);
    }

    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản"));

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    private GoogleIdToken.Payload verifyGoogleCredential(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new BadRequestException("Google token không hợp lệ");
            }

            return idToken.getPayload();
        } catch (BadRequestException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BadRequestException("Không thể xác thực Google token");
        }
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .accessToken(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}