package com.example.techstore.service;

import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.dto.response.SpecificationKeyResponse;
import com.example.techstore.entity.Category;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.SpecificationKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SpecificationKeyRepository specificationKeyRepository;

    public List<SpecificationKeyResponse> getSpecificationKeys(Long categoryId) {
        return specificationKeyRepository.findByCategoryIdAndDeletedAtIsNullOrderBySortOrderAsc(categoryId)
                .stream()
                .map(key -> SpecificationKeyResponse.builder()
                        .id(key.getId())
                        .name(key.getName())
                        .unit(key.getUnit())
                        .sortOrder(key.getSortOrder())
                        .build())
                .toList();
    }

    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByStatusOrderBySortOrderAsc(ProductStatus.ACTIVE)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .sortOrder(category.getSortOrder())
                .build();
    }
}