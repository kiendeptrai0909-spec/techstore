package com.example.techstore.repository;

import com.example.techstore.entity.Product;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByDeletedAtIsNull(Pageable pageable);

    Page<Product> findByStatusAndDeletedAtIsNull(ProductStatus status, Pageable pageable);

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
              and p.deletedAt is null
              and (:keyword = '' or lower(p.name) like concat('%', :keyword, '%'))
              and (:categoryId is null or c.id = :categoryId)
              and (:brandId is null or b.id = :brandId)
              and (:minPrice is null or v.price >= :minPrice)
              and (:maxPrice is null or v.price <= :maxPrice)
            """)
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") ProductStatus status,
            Pageable pageable
    );

    @Query("""
            select distinct p
            from Product p
            left join p.category c
            left join p.brand b
            left join ProductVariant v on v.product = p
            where p.deletedAt is null
              and (:keyword = ''
                   or lower(p.name) like concat('%', :keyword, '%')
                   or lower(p.slug) like concat('%', :keyword, '%')
                   or lower(v.sku) like concat('%', :keyword, '%'))
              and (:categoryId is null or c.id = :categoryId)
              and (:brandId is null or b.id = :brandId)
              and (:status is null or p.status = :status)
            """)
    Page<Product> searchAdminProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("status") ProductStatus status,
            Pageable pageable
    );
}