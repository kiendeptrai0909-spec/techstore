package com.example.techstore.repository;

import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);

    List<ProductVariant> findByProductIdAndStatus(Long productId, ProductStatus status);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    @Query(value = """
        select
            p.id as product_id,
            p.name as product_name,
            v.id as product_variant_id,
            v.name as variant_name,
            v.sku as product_sku,
            v.stock as stock,
            v.price as price,
            v.sale_price as sale_price
        from product_variants v
        join products p on p.id = v.product_id
        where v.deleted_at is null
          and p.deleted_at is null
          and v.status = 'ACTIVE'
          and p.status = 'ACTIVE'
          and v.stock <= :threshold
        order by v.stock asc, p.name asc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findLowStockProducts(
            @Param("limit") int limit,
            @Param("threshold") int threshold
    );
}