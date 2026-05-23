package com.example.techstore.service;

import com.example.techstore.dto.request.EmployeeRequest;
import com.example.techstore.dto.request.EmployeeStatusRequest;
import com.example.techstore.dto.response.AdminEmployeeResponse;
import com.example.techstore.entity.User;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminEmployeeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<AdminEmployeeResponse> getEmployees(
            String keyword,
            UserRole role,
            UserStatus status,
            Pageable pageable
    ) {
        validateEmployeeRoleIfPresent(role);

        String normalizedKeyword = keyword == null
                ? ""
                : keyword.trim().toLowerCase();

        return userRepository.searchAdminEmployees(
                List.of(UserRole.ROLE_ADMIN, UserRole.ROLE_STAFF),
                role,
                normalizedKeyword,
                status,
                pageable
        ).map(this::toEmployeeResponse);
    }

    @Transactional(readOnly = true)
    public AdminEmployeeResponse getEmployeeById(Long employeeId) {
        User user = findEmployeeById(employeeId);

        return toEmployeeResponse(user);
    }

    @Transactional
    public AdminEmployeeResponse createEmployee(EmployeeRequest request) {
        validateEmployeeRole(request.getRole());

        if (request.getPassword() == null || request.getPassword().trim().isBlank()) {
            throw new BadRequestException("Mật khẩu không được để trống");
        }

        if (request.getPassword().length() < 6) {
            throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            throw new BadRequestException("Email đã tồn tại");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(normalizeBlankToNull(request.getPhone()))
                .role(request.getRole())
                .status(request.getStatus())
                .build();

        User savedUser = userRepository.save(user);

        return toEmployeeResponse(savedUser);
    }

    @Transactional
    public AdminEmployeeResponse updateEmployee(Long employeeId, EmployeeRequest request) {
        validateEmployeeRole(request.getRole());

        User user = findEmployeeById(employeeId);

        String email = request.getEmail().trim().toLowerCase();

        userRepository.findByEmailIgnoreCase(email)
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(employeeId)) {
                        throw new BadRequestException("Email đã tồn tại");
                    }
                });

        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPhone(normalizeBlankToNull(request.getPhone()));
        user.setRole(request.getRole());
        user.setStatus(request.getStatus());

        if (request.getPassword() != null && !request.getPassword().trim().isBlank()) {
            if (request.getPassword().length() < 6) {
                throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
            }

            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        User savedUser = userRepository.save(user);

        return toEmployeeResponse(savedUser);
    }

    @Transactional
    public AdminEmployeeResponse updateEmployeeStatus(
            Long employeeId,
            EmployeeStatusRequest request
    ) {
        User user = findEmployeeById(employeeId);

        user.setStatus(request.getStatus());

        User savedUser = userRepository.save(user);

        return toEmployeeResponse(savedUser);
    }

    private User findEmployeeById(Long employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên"));

        if (user.getRole() != UserRole.ROLE_ADMIN && user.getRole() != UserRole.ROLE_STAFF) {
            throw new ResourceNotFoundException("Không tìm thấy nhân viên");
        }

        return user;
    }

    private void validateEmployeeRoleIfPresent(UserRole role) {
        if (role == null) {
            return;
        }

        validateEmployeeRole(role);
    }

    private void validateEmployeeRole(UserRole role) {
        if (role != UserRole.ROLE_ADMIN && role != UserRole.ROLE_STAFF) {
            throw new BadRequestException("Vai trò nhân viên không hợp lệ");
        }
    }

    private String normalizeBlankToNull(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }

        return value.trim();
    }

    private AdminEmployeeResponse toEmployeeResponse(User user) {
        return AdminEmployeeResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}