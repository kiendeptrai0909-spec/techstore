package com.example.techstore.config;

import com.example.techstore.entity.User;
import com.example.techstore.enums.Gender;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Order(1)
public class DemoUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createUserIfNotExists(
                "Quản trị viên TechStore",
                "admin@techstore.vn",
                "123456",
                UserRole.ROLE_ADMIN,
                "0909000001",
                Gender.MALE,
                LocalDate.of(1995, 1, 15),
                "Tòa nhà TechStore, 123 Nguyễn Trãi, Quận 1, TP.HCM",
                "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png",
                UserStatus.ACTIVE
        );

        createUserIfNotExists(
                "Nhân viên hỗ trợ TechStore",
                "staff@techstore.vn",
                "123456",
                UserRole.ROLE_STAFF,
                "0909000002",
                Gender.FEMALE,
                LocalDate.of(1998, 8, 12),
                "Chi nhánh TechStore, 456 Lê Văn Việt, TP. Thủ Đức, TP.HCM",
                "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png",
                UserStatus.ACTIVE
        );

        createUserIfNotExists(
                "Nguyễn Minh Quân",
                "customer@techstore.vn",
                "123456",
                UserRole.ROLE_CUSTOMER,
                "0909000003",
                Gender.MALE,
                LocalDate.of(2001, 3, 10),
                "25 Lê Văn Việt, TP. Thủ Đức, TP.HCM",
                "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png",
                UserStatus.ACTIVE
        );
    }

    private void createUserIfNotExists(
            String fullName,
            String email,
            String rawPassword,
            UserRole role,
            String phone,
            Gender gender,
            LocalDate dateOfBirth,
            String address,
            String avatar,
            UserStatus status
    ) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return;
        }

        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .phone(phone)
                .gender(gender)
                .dateOfBirth(dateOfBirth)
                .address(address)
                .avatar(avatar)
                .status(status)
                .build();

        userRepository.save(user);
    }
}