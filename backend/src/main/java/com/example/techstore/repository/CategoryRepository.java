package com.example.techstore.repository;

import com.example.techstore.entity.Category;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findByStatusOrderBySortOrderAsc(ProductStatus status);

    List<Category> findByParentIdAndStatusOrderBySortOrderAsc(Long parentId, ProductStatus status);

    Optional<Category> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);
}