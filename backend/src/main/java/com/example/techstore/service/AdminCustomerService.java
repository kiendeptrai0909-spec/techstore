package com.example.techstore.service;

import com.example.techstore.dto.request.CustomerStatusRequest;
import com.example.techstore.dto.response.AdminCustomerResponse;
import com.example.techstore.entity.User;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<AdminCustomerResponse> getCustomers(
            String keyword,
            UserStatus status,
            Pageable pageable
    ) {
        String normalizedKeyword = keyword == null
                ? ""
                : keyword.trim().toLowerCase();

        return userRepository.searchAdminCustomers(
                UserRole.ROLE_CUSTOMER,
                normalizedKeyword,
                status,
                pageable
        ).map(this::toCustomerResponse);
    }

    @Transactional(readOnly = true)
    public AdminCustomerResponse getCustomerById(Long customerId) {
        User user = findCustomerById(customerId);

        return toCustomerResponse(user);
    }

    @Transactional
    public AdminCustomerResponse updateCustomerStatus(
            Long customerId,
            CustomerStatusRequest request
    ) {
        User user = findCustomerById(customerId);

        user.setStatus(request.getStatus());

        User savedUser = userRepository.save(user);

        return toCustomerResponse(savedUser);
    }

    private User findCustomerById(Long customerId) {
        User user = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng"));

        if (user.getRole() != UserRole.ROLE_CUSTOMER) {
            throw new ResourceNotFoundException("Không tìm thấy khách hàng");
        }

        return user;
    }

    private AdminCustomerResponse toCustomerResponse(User user) {
        return AdminCustomerResponse.builder()
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