package com.example.techstore.repository;

import com.example.techstore.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    boolean existsByOrderUserIdAndProductId(Long userId, Long productId);

    @Query("""
        select coalesce(sum(oi.totalPrice), 0)
        from OrderItem oi
        join oi.order o
        where o.orderStatus = com.example.techstore.enums.OrderStatus.COMPLETED
          and o.createdAt between :from and :to
        """)
    BigDecimal sumCompletedRevenue(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
        select oi.productName, sum(oi.quantity), sum(oi.totalPrice)
        from OrderItem oi
        join oi.order o
        where o.orderStatus = com.example.techstore.enums.OrderStatus.COMPLETED
          and o.createdAt between :from and :to
        group by oi.productName
        order by sum(oi.totalPrice) desc
        """)
    List<Object[]> revenueByProduct(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
        select c.name, sum(oi.quantity), sum(oi.totalPrice)
        from OrderItem oi
        join oi.order o
        join oi.product p
        join p.category c
        where o.orderStatus = com.example.techstore.enums.OrderStatus.COMPLETED
          and o.createdAt between :from and :to
        group by c.name
        order by sum(oi.totalPrice) desc
        """)
    List<Object[]> revenueByCategory(
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query(value = """
        select
            oi.product_id,
            oi.product_name,
            oi.product_variant_id,
            oi.variant_name,
            oi.product_sku,
            sum(oi.quantity) as total_quantity_sold,
            coalesce(sum(oi.total_price), 0) as total_revenue,
            pv.thumbnail_url
        from order_items oi
        join orders o on o.id = oi.order_id
        left join product_variants pv on pv.id = oi.product_variant_id
        where o.deleted_at is null
          and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
        group by 
            oi.product_id,
            oi.product_name,
            oi.product_variant_id,
            oi.variant_name,
            oi.product_sku,
            pv.thumbnail_url
        order by total_quantity_sold desc, total_revenue desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findTopProducts(@Param("limit") int limit);

    @Query(value = """
    select
        c.id as category_id,
        c.name as category_name,
        coalesce(sum(oi.quantity), 0) as total_quantity_sold,
        count(distinct oi.order_id) as total_orders,
        coalesce(sum(oi.total_price), 0) as total_revenue
    from order_items oi
    join orders o on o.id = oi.order_id
    join products p on p.id = oi.product_id
    join categories c on c.id = p.category_id
    where o.deleted_at is null
      and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
      and (cast(:fromDate as timestamp) is null or o.created_at >= cast(:fromDate as timestamp))
      and (cast(:toDate as timestamp) is null or o.created_at <= cast(:toDate as timestamp))
    group by c.id, c.name
    order by total_revenue desc, total_quantity_sold desc
    limit :limit
    """, nativeQuery = true)
    List<Object[]> findCategoryStatistics(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("limit") int limit
    );

    @Query(value = """
    select
        b.id as brand_id,
        b.name as brand_name,
        coalesce(sum(oi.quantity), 0) as total_quantity_sold,
        count(distinct oi.order_id) as total_orders,
        coalesce(sum(oi.total_price), 0) as total_revenue
    from order_items oi
    join orders o on o.id = oi.order_id
    join products p on p.id = oi.product_id
    join brands b on b.id = p.brand_id
    where o.deleted_at is null
      and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
      and (cast(:fromDate as timestamp) is null or o.created_at >= cast(:fromDate as timestamp))
      and (cast(:toDate as timestamp) is null or o.created_at <= cast(:toDate as timestamp))
    group by b.id, b.name
    order by total_revenue desc, total_quantity_sold desc
    limit :limit
    """, nativeQuery = true)
    List<Object[]> findBrandStatistics(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            @Param("limit") int limit
    );
}