package com.example.techstore.service;

import com.example.techstore.dto.request.CategoryRequest;
import com.example.techstore.dto.response.CategoryResponse;
import com.example.techstore.entity.Category;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminCategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<CategoryResponse> getCategories(
            String keyword,
            ProductStatus status,
            Pageable pageable
    ) {
        String normalizedKeyword = keyword == null
                ? ""
                : keyword.trim().toLowerCase();

        return categoryRepository.searchAdminCategories(
                normalizedKeyword,
                status,
                pageable
        ).map(this::toCategoryResponse);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        return toCategoryResponse(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = normalizeSlug(request.getSlug());

        if (categoryRepository.existsBySlug(slug)) {
            throw new BadRequestException("Slug danh mục đã tồn tại");
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .sortOrder(request.getSortOrder())
                .status(request.getStatus())
                .build();

        Category savedCategory = categoryRepository.save(category);

        return toCategoryResponse(savedCategory);
    }

    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        String slug = normalizeSlug(request.getSlug());

        categoryRepository.findBySlug(slug)
                .ifPresent(existingCategory -> {
                    if (!existingCategory.getId().equals(categoryId)) {
                        throw new BadRequestException("Slug danh mục đã tồn tại");
                    }
                });

        category.setName(request.getName().trim());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setSortOrder(request.getSortOrder());
        category.setStatus(request.getStatus());

        if (request.getStatus() == ProductStatus.ACTIVE) {
            category.setDeletedAt(null);
        }

        Category savedCategory = categoryRepository.save(category);

        return toCategoryResponse(savedCategory);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        if (productRepository.existsByCategoryIdAndDeletedAtIsNull(categoryId)) {
            throw new BadRequestException("Không thể xóa danh mục đang có sản phẩm");
        }

        category.setStatus(ProductStatus.INACTIVE);
        category.setDeletedAt(LocalDateTime.now());

        categoryRepository.save(category);
    }

    private String normalizeSlug(String slug) {
        return slug.trim().toLowerCase();
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .sortOrder(category.getSortOrder())
                .status(category.getStatus())
                .build();
    }
}