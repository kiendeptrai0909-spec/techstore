package com.example.techstore.controller;

import com.example.techstore.dto.request.ForgotPasswordRequest;
import com.example.techstore.dto.request.ResetPasswordRequest;
import com.example.techstore.service.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/password-reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    @PostMapping("/forgot")
    public Map<String, String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {
        passwordResetService.forgotPassword(request);

        return Map.of(
                "message",
                "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu"
        );
    }

    @PostMapping("/reset")
    public Map<String, String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {
        passwordResetService.resetPassword(request);

        return Map.of(
                "message",
                "Đặt lại mật khẩu thành công"
        );
    }
}