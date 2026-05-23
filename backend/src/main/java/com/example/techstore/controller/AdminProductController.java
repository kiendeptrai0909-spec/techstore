package com.example.techstore.controller;

import com.example.techstore.dto.request.ProductRequest;
import com.example.techstore.dto.request.ProductVariantRequest;
import com.example.techstore.dto.response.ProductResponse;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.service.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    /*
     * Admin lấy danh sách sản phẩm.
     *
     * Ví dụ:
     * GET /api/v1/admin/products?page=0&size=10
     * GET /api/v1/admin/products?status=ACTIVE&page=0&size=10
     */
    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) ProductStatus status,
            Pageable pageable
    ) {
        return adminProductService.getProducts(
                keyword,
                categoryId,
                brandId,
                status,
                pageable
        );
    }

    /*
     * Admin xem chi tiết sản phẩm.
     */
    @GetMapping("/{productId}")
    public ProductResponse getProductById(@PathVariable Long productId) {
        return adminProductService.getProductById(productId);
    }

    /*
     * Admin tạo sản phẩm mới.
     */
    @PostMapping
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return adminProductService.createProduct(request);
    }

    /*
     * Admin cập nhật sản phẩm.
     */
    @PutMapping("/{productId}")
    public ProductResponse updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request
    ) {
        return adminProductService.updateProduct(productId, request);
    }

    /*
     * Admin xóa mềm sản phẩm.
     */
    @DeleteMapping("/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        adminProductService.deleteProduct(productId);
    }

    /*
     * Admin tạo biến thể cho sản phẩm.
     */
    @PostMapping("/{productId}/variants")
    public ProductResponse createVariant(
            @PathVariable Long productId,
            @Valid @RequestBody ProductVariantRequest request
    ) {
        return adminProductService.createVariant(productId, request);
    }

    /*
     * Admin cập nhật biến thể.
     */
    @PutMapping("/variants/{variantId}")
    public ProductResponse updateVariant(
            @PathVariable Long variantId,
            @Valid @RequestBody ProductVariantRequest request
    ) {
        return adminProductService.updateVariant(variantId, request);
    }

    /*
     * Admin xóa mềm biến thể.
     */
    @DeleteMapping("/variants/{variantId}")
    public ProductResponse deleteVariant(@PathVariable Long variantId) {
        return adminProductService.deleteVariant(variantId);
    }
}