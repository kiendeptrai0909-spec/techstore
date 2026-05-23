package com.example.techstore.controller;

import com.example.techstore.dto.request.EmployeeRequest;
import com.example.techstore.dto.request.EmployeeStatusRequest;
import com.example.techstore.dto.response.AdminEmployeeResponse;
import com.example.techstore.enums.UserRole;
import com.example.techstore.enums.UserStatus;
import com.example.techstore.service.AdminEmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/employees")
@RequiredArgsConstructor
public class AdminEmployeeController {

    private final AdminEmployeeService adminEmployeeService;

    @GetMapping
    public Page<AdminEmployeeResponse> getEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            Pageable pageable
    ) {
        return adminEmployeeService.getEmployees(keyword, role, status, pageable);
    }

    @GetMapping("/{employeeId}")
    public AdminEmployeeResponse getEmployeeById(@PathVariable Long employeeId) {
        return adminEmployeeService.getEmployeeById(employeeId);
    }

    @PostMapping
    public AdminEmployeeResponse createEmployee(
            @Valid @RequestBody EmployeeRequest request
    ) {
        return adminEmployeeService.createEmployee(request);
    }

    @PutMapping("/{employeeId}")
    public AdminEmployeeResponse updateEmployee(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeRequest request
    ) {
        return adminEmployeeService.updateEmployee(employeeId, request);
    }

    @PutMapping("/{employeeId}/status")
    public AdminEmployeeResponse updateEmployeeStatus(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeStatusRequest request
    ) {
        return adminEmployeeService.updateEmployeeStatus(employeeId, request);
    }
}