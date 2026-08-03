package com.example.techstore.repository;

import com.example.techstore.entity.Brand;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    List<Brand> findByStatus(ProductStatus status);

    Optional<Brand> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p.brand FROM Product p WHERE p.category.id = :categoryId AND p.brand.status = 'ACTIVE' AND p.deletedAt IS NULL")
    List<Brand> findActiveBrandsByCategoryId(@org.springframework.data.repository.query.Param("categoryId") Long categoryId);//lấy danh sách các brand đang được active của các product thuộc 1 category

    @org.springframework.data.jpa.repository.Query("""
            SELECT b FROM Brand b
            WHERE b.deletedAt IS NULL
              AND (:keyword = '' OR LOWER(b.name) LIKE CONCAT('%', :keyword, '%') OR LOWER(b.slug) LIKE CONCAT('%', :keyword, '%'))
              AND (:status IS NULL OR b.status = :status)
            """)
    org.springframework.data.domain.Page<Brand> searchAdminBrands(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("status") ProductStatus status,
            org.springframework.data.domain.Pageable pageable
    );//tìm kiếm brands dành cho quản trị viên
}