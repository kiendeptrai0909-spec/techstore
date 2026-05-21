package com.example.techstore.controller;

import com.example.techstore.dto.request.ChangePasswordRequest;
import com.example.techstore.dto.request.UserProfileRequest;
import com.example.techstore.dto.response.UserProfileResponse;
import com.example.techstore.entity.User;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.repository.UserRepository;
import com.example.techstore.service.CloudinaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        return ResponseEntity.ok(UserProfileResponse.from(user));
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @Valid @RequestBody UserProfileRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setAddress(request.getAddress());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(UserProfileResponse.from(savedUser));
    }

    @PatchMapping("/avatar")
    public ResponseEntity<?> updateAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        String avatarUrl = cloudinaryService.uploadUserAvatar(file, user.getId());

        user.setAvatar(avatarUrl);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật avatar thành công",
                "avatar", avatarUrl
        ));
    }

    @PatchMapping("/password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Xác nhận mật khẩu không khớp");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu mới không được trùng mật khẩu hiện tại");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Đổi mật khẩu thành công"
        ));
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Bạn cần đăng nhập");
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy người dùng: " + email));
    }
}