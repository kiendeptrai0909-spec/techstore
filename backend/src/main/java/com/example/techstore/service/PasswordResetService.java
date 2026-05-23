package com.example.techstore.service;

import com.example.techstore.dto.request.ForgotPasswordRequest;
import com.example.techstore.dto.request.ResetPasswordRequest;
import com.example.techstore.entity.PasswordResetToken;
import com.example.techstore.entity.User;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.repository.PasswordResetTokenRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender javaMailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.password-reset-expiration-minutes:15}")
    private Long expirationMinutes;

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        userRepository.findByEmailIgnoreCase(email)
                .ifPresent(this::createTokenAndSendEmail);
    }

    private void createTokenAndSendEmail(User user) {
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String token = UUID.randomUUID() + "-" + UUID.randomUUID();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiredAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        sendResetPasswordEmail(user, resetLink);
    }

    private void sendResetPasswordEmail(User user, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(user.getEmail());
        message.setSubject("Đặt lại mật khẩu TechStore");
        message.setText("""
                Xin chào %s,

                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản TechStore của bạn.

                Vui lòng bấm vào liên kết bên dưới để đặt lại mật khẩu:
                %s

                Liên kết này sẽ hết hạn sau %d phút.

                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

                Trân trọng,
                TechStore
                """.formatted(
                user.getFullName(),
                resetLink,
                expirationMinutes
        ));

        javaMailSender.send(message);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu xác nhận không khớp");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Liên kết đặt lại mật khẩu không hợp lệ"));

        if (Boolean.TRUE.equals(resetToken.getUsed())) {
            throw new BadRequestException("Liên kết đặt lại mật khẩu đã được sử dụng");
        }

        if (resetToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Liên kết đặt lại mật khẩu đã hết hạn");
        }

        User user = resetToken.getUser();

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));

        resetToken.setUsed(true);

        passwordResetTokenRepository.save(resetToken);
        userRepository.save(user);
    }
}