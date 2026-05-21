package com.example.techstore.controller;

import com.example.techstore.dto.response.ProductDetailResponse;
import com.example.techstore.dto.response.ProductResponse;
import com.example.techstore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public Page<ProductResponse> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable
    ) {
        return productService.getProducts(
                keyword,
                categoryId,
                brandId,
                minPrice,
                maxPrice,
                pageable
        );
    }

    @GetMapping("/featured")
    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        return productService.getFeaturedProducts(pageable);
    }

    @GetMapping("/slug/{slug}")
    public ProductDetailResponse getProductBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug);
    }

    @GetMapping("/{id}")
    public ProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }
}