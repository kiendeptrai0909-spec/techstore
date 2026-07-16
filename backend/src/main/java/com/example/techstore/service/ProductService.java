package com.example.techstore.service;

import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.dto.response.ProductDetailResponse;
import com.example.techstore.dto.response.ProductResponse;
import com.example.techstore.dto.response.ProductReviewResponse;
import com.example.techstore.dto.response.ProductSpecificationResponse;
import com.example.techstore.dto.response.ProductVariantResponse;
import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductImage;
import com.example.techstore.entity.ProductSpecification;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.ProductImageRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductSpecificationRepository;
import com.example.techstore.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSpecificationRepository productSpecificationRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (product.getStatus() != ProductStatus.ACTIVE || product.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        return toResponse(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (product.getStatus() != ProductStatus.ACTIVE || product.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        return toDetailResponse(product);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByFeaturedTrueAndStatus(ProductStatus.ACTIVE, pageable)
                .map(this::toResponse);
    }

    private ProductResponse toResponse(Product product) {
        List<ProductVariantResponse> variants = productVariantRepository
                .findByProductIdAndStatus(product.getId(), ProductStatus.ACTIVE)
                .stream()
                .filter(variant -> variant.getDeletedAt() == null)
                .map(this::toVariantResponse)
                .toList();

        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .featured(product.getFeatured())
                .status(product.getStatus())
                .category(toCategoryResponse(product.getCategory()))
                .brand(toBrandResponse(product.getBrand()))
                .variants(variants)
                .build();
    }

    private ProductDetailResponse toDetailResponse(Product product) {
        List<ProductVariantResponse> variants = productVariantRepository
                .findByProductIdAndStatus(product.getId(), ProductStatus.ACTIVE)
                .stream()
                .filter(variant -> variant.getDeletedAt() == null)
                .map(this::toVariantResponse)
                .toList();

        List<ProductDetailResponse.ImageResponse> images = productImageRepository
                .findByProductIdOrderBySortOrderAsc(product.getId())
                .stream()
                .filter(image -> image.getDeletedAt() == null)
                .map(ProductDetailResponse.ImageResponse::from)
                .toList();

        List<ProductSpecificationResponse> specifications = List.of();

        List<ProductReviewResponse> reviews = List.of();

        return ProductDetailResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .featured(product.getFeatured())
                .status(product.getStatus().name())
                .category(toCategoryResponse(product.getCategory()))
                .brand(toBrandResponse(product.getBrand()))
                .variants(variants)
                .images(images)
                .specifications(specifications)
                .reviews(reviews)
                .build();
    }

    private ProductVariantResponse toVariantResponse(ProductVariant variant) {
        List<ProductSpecificationResponse> specifications = productSpecificationRepository
                .findByProductVariantIdAndDeletedAtIsNullOrderBySpecificationKeySortOrderAsc(variant.getId())
                .stream()
                .filter(s -> s.getSpecificationKey() != null && s.getSpecificationKey().getDeletedAt() == null)
                .map(ProductSpecificationResponse::from)
                .toList();

        return ProductVariantResponse.builder()
                .id(variant.getId())
                .name(variant.getName())
                .sku(variant.getSku())
                .price(variant.getPrice())
                .salePrice(variant.getSalePrice())
                .stock(variant.getStock())
                .thumbnailUrl(variant.getThumbnailUrl())
                .description(variant.getDescription())
                .specifications(specifications)
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
                .status(brand.getStatus())
                .build();
    }
}