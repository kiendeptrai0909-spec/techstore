package com.example.techstore.controller;

import com.example.techstore.dto.request.CategoryRequest;
import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.service.AdminCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @GetMapping
    public Page<CategoryResponse> getCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            Pageable pageable
    ) {
        return adminCategoryService.getCategories(keyword, status, pageable);
    }

    @GetMapping("/{categoryId}")
    public CategoryResponse getCategoryById(@PathVariable Long categoryId) {
        return adminCategoryService.getCategoryById(categoryId);
    }

    @PostMapping
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return adminCategoryService.createCategory(request);
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryRequest request
    ) {
        return adminCategoryService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    public void deleteCategory(@PathVariable Long categoryId) {
        adminCategoryService.deleteCategory(categoryId);
    }
}