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
    public Page<ProductResponse> getProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            ProductStatus status,
            Pageable pageable
    ) {
        String normalizedKeyword = keyword == null
                ? ""
                : keyword.trim().toLowerCase();

        return productRepository.searchAdminProducts(
                normalizedKeyword,
                categoryId,
                brandId,
                status,
                pageable
        ).map(this::toProductResponse);
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

        saveOrUpdateVariants(savedProduct, request.getVariants());

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

        saveOrUpdateVariants(savedProduct, request.getVariants());

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
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE)
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

        ProductStatus status = request.getStatus() != null
                ? request.getStatus()
                : ProductStatus.ACTIVE;

        variant.setName(request.getName().trim());
        variant.setSku(sku);
        variant.setPrice(request.getPrice());
        variant.setSalePrice(request.getSalePrice());
        variant.setStock(request.getStock());
        variant.setThumbnailUrl(request.getThumbnailUrl());
        variant.setStatus(status);

        if (status == ProductStatus.ACTIVE) {
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

    private void saveOrUpdateVariants(Product product, List<ProductVariantRequest> variantRequests) {
        List<ProductVariant> existingVariants =
                productVariantRepository.findByProductId(product.getId());

        if (variantRequests == null || variantRequests.isEmpty()) {
            for (ProductVariant variant : existingVariants) {
                variant.setStatus(ProductStatus.INACTIVE);
                variant.setDeletedAt(LocalDateTime.now());
                productVariantRepository.save(variant);
            }

            return;
        }

        List<Long> requestVariantIds = variantRequests.stream()
                .map(ProductVariantRequest::getId)
                .filter(id -> id != null)
                .toList();

        for (ProductVariantRequest request : variantRequests) {
            validateVariantRequest(request);

            String sku = normalizeSku(request.getSku());

            if (request.getId() == null) {
                createNewVariant(product, request, sku);
            } else {
                updateExistingVariant(product, request, sku);
            }
        }

        for (ProductVariant existingVariant : existingVariants) {
            if (!requestVariantIds.contains(existingVariant.getId())) {
                existingVariant.setStatus(ProductStatus.INACTIVE);
                existingVariant.setDeletedAt(LocalDateTime.now());
                productVariantRepository.save(existingVariant);
            }
        }
    }

    private void createNewVariant(
            Product product,
            ProductVariantRequest request,
            String sku
    ) {
        if (productVariantRepository.existsBySku(sku)) {
            throw new BadRequestException("SKU đã tồn tại: " + sku);
        }

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .name(request.getName().trim())
                .sku(sku)
                .price(request.getPrice())
                .salePrice(request.getSalePrice())
                .stock(request.getStock())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE)
                .build();

        productVariantRepository.save(variant);
    }

    private void updateExistingVariant(
            Product product,
            ProductVariantRequest request,
            String sku
    ) {
        ProductVariant variant = productVariantRepository.findById(request.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm"));

        if (!variant.getProduct().getId().equals(product.getId())) {
            throw new BadRequestException("Biến thể không thuộc sản phẩm này");
        }

        productVariantRepository.findBySku(sku)
                .ifPresent(existingVariant -> {
                    if (!existingVariant.getId().equals(variant.getId())) {
                        throw new BadRequestException("SKU đã tồn tại: " + sku);
                    }
                });

        ProductStatus status = request.getStatus() != null
                ? request.getStatus()
                : ProductStatus.ACTIVE;

        variant.setName(request.getName().trim());
        variant.setSku(sku);
        variant.setPrice(request.getPrice());
        variant.setSalePrice(request.getSalePrice());
        variant.setStock(request.getStock());
        variant.setThumbnailUrl(request.getThumbnailUrl());
        variant.setStatus(status);

        if (status == ProductStatus.ACTIVE) {
            variant.setDeletedAt(null);
        }

        productVariantRepository.save(variant);
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
                .status(product.getStatus())
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