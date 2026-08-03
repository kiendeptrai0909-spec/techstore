package com.example.techstore.service;

import com.example.techstore.dto.request.BrandRequest;
import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.entity.Brand;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminBrandService {

    private final BrandRepository brandRepository;

    @Transactional(readOnly = true)
    public Page<BrandResponse> getBrands(String keyword, ProductStatus status, Pageable pageable) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase();// chuẩn hóa keyword
        return brandRepository.searchAdminBrands(normalizedKeyword, status, pageable)
                .map(this::toBrandResponse);
    }// lấy danh sách thương hiệu

    @Transactional(readOnly = true)
    public BrandResponse getBrandById(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
        if (brand.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Thương hiệu đã bị xóa");
        }
        return toBrandResponse(brand);
    }// lấy thương hiệu theo id

    @Transactional
    public BrandResponse createBrand(BrandRequest request) {
        String slug = normalizeSlug(request.getSlug());

        if (brandRepository.existsBySlug(slug)) {
            throw new BadRequestException("Slug thương hiệu đã tồn tại");
        }

        Brand brand = Brand.builder()
                .name(request.getName().trim())
                .slug(slug)
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE)
                .build();

        return toBrandResponse(brandRepository.save(brand));
    }

    @Transactional
    public BrandResponse updateBrand(Long brandId, BrandRequest request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));

        if (brand.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không thể cập nhật thương hiệu đã bị xóa");
        }

        String slug = normalizeSlug(request.getSlug());
        brandRepository.findBySlug(slug)
                .ifPresent(existingBrand -> {
                    if (!existingBrand.getId().equals(brandId)) {
                        throw new BadRequestException("Slug thương hiệu đã tồn tại");
                    }
                });

        brand.setName(request.getName().trim());
        brand.setSlug(slug);
        brand.setLogoUrl(request.getLogoUrl());
        brand.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            brand.setStatus(request.getStatus());
            if (request.getStatus() == ProductStatus.ACTIVE) {
                brand.setDeletedAt(null);
            }
        }

        return toBrandResponse(brandRepository.save(brand));
    }

    @Transactional
    public void deleteBrand(Long brandId) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));

        brand.setStatus(ProductStatus.INACTIVE);
        brand.setDeletedAt(LocalDateTime.now());
        brandRepository.save(brand);
    }

    private String normalizeSlug(String slug) {
        return slug.trim().toLowerCase();
    }

    private BrandResponse toBrandResponse(Brand brand) {
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
