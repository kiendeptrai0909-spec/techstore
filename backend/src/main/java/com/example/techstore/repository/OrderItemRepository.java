package com.example.techstore.repository;

import com.example.techstore.entity.OrderItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
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
            coalesce(sum(oi.total_price), 0) as total_revenue
        from order_items oi
        join orders o on o.id = oi.order_id
        where o.order_status = 'COMPLETED'
        group by 
            oi.product_id,
            oi.product_name,
            oi.product_variant_id,
            oi.variant_name,
            oi.product_sku
        order by total_quantity_sold desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findTopProducts(@Param("limit") int limit);
}