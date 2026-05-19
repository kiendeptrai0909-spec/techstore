package com.example.techstore.service;

import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.dto.response.ProductResponse;
import com.example.techstore.dto.response.ProductVariantResponse;
import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;

    public Page<ProductResponse> getProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        String normalizedKeyword = "";

        if (keyword != null && !keyword.trim().isEmpty()) {
            normalizedKeyword = keyword.trim().toLowerCase();
        }

        return productRepository.searchProducts(
                        normalizedKeyword,
                        categoryId,
                        brandId,
                        minPrice,
                        maxPrice,
                        ProductStatus.ACTIVE,
                        pageable
                )
                .map(this::toResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        return toResponse(product);
    }

    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        return toResponse(product);
    }

    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable)
                .map(this::toResponse);
    }

    private ProductResponse toResponse(Product product) {
        List<ProductVariantResponse> variants = productVariantRepository
                .findByProductIdAndStatus(product.getId(), ProductStatus.ACTIVE)
                .stream()
                .map(this::toVariantResponse)
                .toList();

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .featured(product.getFeatured())
                .category(toCategoryResponse(product.getCategory()))
                .brand(toBrandResponse(product.getBrand()))
                .variants(variants)
                .build();
    }

    private ProductVariantResponse toVariantResponse(ProductVariant variant) {
        return ProductVariantResponse.builder()
                .id(variant.getId())
                .name(variant.getName())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .salePrice(variant.getSalePrice())
                .stock(variant.getStock())
                .thumbnailUrl(variant.getThumbnailUrl())
                .build();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .sortOrder(category.getSortOrder())
                .build();
    }

    private BrandResponse toBrandResponse(Brand brand) {
        if (brand == null) {
            return null;
        }

        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .logoUrl(brand.getLogoUrl())
                .description(brand.getDescription())
                .build();
    }
}