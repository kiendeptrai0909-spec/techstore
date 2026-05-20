package com.example.techstore.config;

import com.example.techstore.entity.User;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfNotExists(
                "Admin TechStore",
                "admin@techstore.vn",
                "0909000001",
                UserRole.ROLE_ADMIN
        );

        createUserIfNotExists(
                "User Demo",
                "user@techstore.vn",
                "0909000002",
                UserRole.ROLE_CUSTOMER
        );
    }

    private void createUserIfNotExists(
            String fullName,
            String email,
            String phone,
            UserRole role
    ) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .passwordHash(passwordEncoder.encode("123456"))
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }
}