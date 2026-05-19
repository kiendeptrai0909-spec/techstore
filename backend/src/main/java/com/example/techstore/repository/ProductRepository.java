package com.example.techstore.repository;

import com.example.techstore.entity.Product;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByFeaturedTrueAndStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    Page<Product> findByBrandIdAndStatus(Long brandId, ProductStatus status, Pageable pageable);

    @Query("""
            select distinct p
            from Product p
            left join p.category c
            left join p.brand b
            left join ProductVariant v on v.product = p
            where p.status = :status
              and (:keyword = '' or lower(p.name) like concat('%', :keyword, '%'))
              and (:categoryId is null or c.id = :categoryId)
              and (:brandId is null or b.id = :brandId)
              and (:minPrice is null or v.price >= :minPrice)
              and (:maxPrice is null or v.price <= :maxPrice)
            """)
    Page<Product> searchProducts(
            String keyword,
            Long categoryId,
            Long brandId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            ProductStatus status,
            Pageable pageable
    );
}