package com.example.techstore.controller;

import com.example.techstore.dto.request.CustomerStatusRequest;
import com.example.techstore.dto.response.AdminCustomerResponse;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.service.AdminCustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/customers")
@RequiredArgsConstructor
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    @GetMapping
    public Page<AdminCustomerResponse> getCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserStatus status,
            Pageable pageable
    ) {
        return adminCustomerService.getCustomers(keyword, status, pageable);
    }

    @GetMapping("/{customerId}")
    public AdminCustomerResponse getCustomerById(@PathVariable Long customerId) {
        return adminCustomerService.getCustomerById(customerId);
    }

    @PutMapping("/{customerId}/status")
    public AdminCustomerResponse updateCustomerStatus(
            @PathVariable Long customerId,
            @Valid @RequestBody CustomerStatusRequest request
    ) {
        return adminCustomerService.updateCustomerStatus(customerId, request);
    }
}