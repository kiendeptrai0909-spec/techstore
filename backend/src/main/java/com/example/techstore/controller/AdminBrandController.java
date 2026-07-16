package com.example.techstore.controller;

import com.example.techstore.dto.request.BrandRequest;
import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.service.AdminBrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/brands")
@RequiredArgsConstructor
public class AdminBrandController {

    private final AdminBrandService adminBrandService;

    @GetMapping
    public Page<BrandResponse> getBrands(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ProductStatus status,
            Pageable pageable
    ) {
        return adminBrandService.getBrands(keyword, status, pageable);
    }

    @GetMapping("/{brandId}")
    public BrandResponse getBrandById(@PathVariable Long brandId) {
        return adminBrandService.getBrandById(brandId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse createBrand(@Valid @RequestBody BrandRequest request) {
        return adminBrandService.createBrand(request);
    }

    @PutMapping("/{brandId}")
    public BrandResponse updateBrand(
            @PathVariable Long brandId,
            @Valid @RequestBody BrandRequest request
    ) {
        return adminBrandService.updateBrand(brandId, request);
    }

    @DeleteMapping("/{brandId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBrand(@PathVariable Long brandId) {
        adminBrandService.deleteBrand(brandId);
    }
}
