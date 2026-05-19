package com.example.techstore.service;

import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.entity.Brand;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<BrandResponse> getActiveBrands() {
        return brandRepository.findByStatus(ProductStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .slug(brand.getSlug())
                .logoUrl(brand.getLogoUrl())
                .description(brand.getDescription())
                .build();
    }
}