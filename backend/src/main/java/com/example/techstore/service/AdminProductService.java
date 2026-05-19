package com.example.techstore.service;

import com.example.techstore.dto.request.ProductRequest;
import com.example.techstore.dto.request.ProductVariantRequest;
import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.dto.response.ProductResponse;
import com.example.techstore.dto.response.ProductVariantResponse;
import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.BrandRepository;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getProducts(ProductStatus status, Pageable pageable) {
        if (status != null) {
            return productRepository.findByStatus(status, pageable)
                    .map(this::toProductResponse);
        }

        return productRepository.findAll(pageable)
                .map(this::toProductResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        return toProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        String slug = normalizeSlug(request.getSlug());

        if (productRepository.existsBySlug(slug)) {
            throw new BadRequestException("Slug sản phẩm đã tồn tại");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));

        Product product = Product.builder()
                .category(category)
                .brand(brand)
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .status(request.getStatus())
                .build();

        Product savedProduct = productRepository.save(product);

        return toProductResponse(savedProduct);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        String slug = normalizeSlug(request.getSlug());

        productRepository.findBySlug(slug)
                .ifPresent(existingProduct -> {
                    if (!existingProduct.getId().equals(productId)) {
                        throw new BadRequestException("Slug sản phẩm đã tồn tại");
                    }
                });

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));

        product.setCategory(category);
        product.setBrand(brand);
        product.setName(request.getName().trim());
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        product.setStatus(request.getStatus());

        if (request.getStatus() == ProductStatus.ACTIVE) {
            product.setDeletedAt(null);
        }

        Product savedProduct = productRepository.save(product);

        return toProductResponse(savedProduct);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        product.setStatus(ProductStatus.INACTIVE);
        product.setDeletedAt(LocalDateTime.now());

        List<ProductVariant> variants = productVariantRepository.findByProductId(productId);

        for (ProductVariant variant : variants) {
            variant.setStatus(ProductStatus.INACTIVE);
            variant.setDeletedAt(LocalDateTime.now());
            productVariantRepository.save(variant);
        }

        productRepository.save(product);
    }

    @Transactional
    public ProductResponse createVariant(Long productId, ProductVariantRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        validateVariantRequest(request);

        String sku = normalizeSku(request.getSku());

        if (productVariantRepository.existsBySku(sku)) {
            throw new BadRequestException("SKU đã tồn tại");
        }

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .name(request.getName().trim())
                .sku(sku)
                .price(request.getPrice())
                .salePrice(request.getSalePrice())
                .stock(request.getStock())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(request.getStatus())
                .build();

        productVariantRepository.save(variant);

        return toProductResponse(product);
    }

    @Transactional
    public ProductResponse updateVariant(Long variantId, ProductVariantRequest request) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm"));

        validateVariantRequest(request);

        String sku = normalizeSku(request.getSku());

        productVariantRepository.findBySku(sku)
                .ifPresent(existingVariant -> {
                    if (!existingVariant.getId().equals(variantId)) {
                        throw new BadRequestException("SKU đã tồn tại");
                    }
                });

        variant.setName(request.getName().trim());
        variant.setSku(sku);
        variant.setPrice(request.getPrice());
        variant.setSalePrice(request.getSalePrice());
        variant.setStock(request.getStock());
        variant.setThumbnailUrl(request.getThumbnailUrl());
        variant.setStatus(request.getStatus());

        if (request.getStatus() == ProductStatus.ACTIVE) {
            variant.setDeletedAt(null);
        }

        ProductVariant savedVariant = productVariantRepository.save(variant);

        return toProductResponse(savedVariant.getProduct());
    }

    @Transactional
    public ProductResponse deleteVariant(Long variantId) {
        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm"));

        variant.setStatus(ProductStatus.INACTIVE);
        variant.setDeletedAt(LocalDateTime.now());

        ProductVariant savedVariant = productVariantRepository.save(variant);

        return toProductResponse(savedVariant.getProduct());
    }

    private void validateVariantRequest(ProductVariantRequest request) {
        if (request.getSalePrice() != null
                && request.getSalePrice().compareTo(BigDecimal.ZERO) > 0
                && request.getSalePrice().compareTo(request.getPrice()) > 0) {
            throw new BadRequestException("Giá khuyến mãi không được lớn hơn giá gốc");
        }
    }

    private String normalizeSlug(String slug) {
        return slug.trim().toLowerCase();
    }

    private String normalizeSku(String sku) {
        return sku.trim().toUpperCase();
    }

    private ProductResponse toProductResponse(Product product) {
        List<ProductVariantResponse> variants = productVariantRepository.findByProductId(product.getId())
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