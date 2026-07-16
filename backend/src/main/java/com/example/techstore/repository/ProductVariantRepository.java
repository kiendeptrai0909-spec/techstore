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

    boolean existsBySkuAndIdNot(String sku, Long id);

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

    @Query(value = """
        select
            p.id as product_id,
            p.name as product_name,
            v.id as product_variant_id,
            v.name as variant_name,
            v.sku as product_sku,
            v.thumbnail_url as thumbnail_url,
            v.stock as stock,
            v.price as price,
            v.sale_price as sale_price,
            v.created_at as created_at,
            max(o.created_at) as last_sold_at,
            cast(current_date - cast(v.created_at as date) as integer) as days_in_stock,
            case
                when max(o.created_at) is null then null
                else cast(current_date - cast(max(o.created_at) as date) as integer)
            end as days_since_last_sold
        from product_variants v
        join products p on p.id = v.product_id
        left join order_items oi on oi.product_variant_id = v.id
        left join orders o on o.id = oi.order_id
            and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
            and o.deleted_at is null
        where v.deleted_at is null
          and p.deleted_at is null
          and v.status = 'ACTIVE'
          and p.status = 'ACTIVE'
          and v.stock > 0
          and v.created_at <= now() - (:days * interval '1 day')
        group by
            p.id,
            p.name,
            v.id,
            v.name,
            v.sku,
            v.thumbnail_url,
            v.stock,
            v.price,
            v.sale_price,
            v.created_at
        order by days_in_stock desc, v.stock desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findOldStockProducts(
            @Param("limit") int limit,
            @Param("days") int days
    );

    @Query(value = """
        select
            p.id as product_id,
            p.name as product_name,
            v.id as product_variant_id,
            v.name as variant_name,
            v.sku as product_sku,
            v.thumbnail_url as thumbnail_url,
            v.stock as stock,
            v.price as price,
            v.sale_price as sale_price,
            v.created_at as created_at,
            max(o.created_at) as last_sold_at,
            cast(current_date - cast(v.created_at as date) as integer) as days_in_stock,
            case
                when max(o.created_at) is null then null
                else cast(current_date - cast(max(o.created_at) as date) as integer)
            end as days_since_last_sold
        from product_variants v
        join products p on p.id = v.product_id
        left join order_items oi on oi.product_variant_id = v.id
        left join orders o on o.id = oi.order_id
            and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
            and o.deleted_at is null
        where v.deleted_at is null
          and p.deleted_at is null
          and v.status = 'ACTIVE'
          and p.status = 'ACTIVE'
          and v.stock > 0
        group by
            p.id,
            p.name,
            v.id,
            v.name,
            v.sku,
            v.thumbnail_url,
            v.stock,
            v.price,
            v.sale_price,
            v.created_at
        having max(o.created_at) is null
            or max(o.created_at) <= now() - (:days * interval '1 day')
        order by
            days_since_last_sold desc nulls first,
            v.stock desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findStagnantProducts(
            @Param("limit") int limit,
            @Param("days") int days
    );
}