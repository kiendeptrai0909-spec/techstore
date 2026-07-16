package com.example.techstore.controller;

import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.dto.response.SpecificationKeyResponse;
import com.example.techstore.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryService.getActiveCategories();
    }

    /*
     * GET /api/v1/categories/{categoryId}/specification-keys
     * Lấy danh sách các loại thông số kỹ thuật theo danh mục.
     */
    @GetMapping("/{categoryId}/specification-keys")
    public List<SpecificationKeyResponse> getSpecificationKeys(@PathVariable Long categoryId) {
        return categoryService.getSpecificationKeys(categoryId);
    }
}