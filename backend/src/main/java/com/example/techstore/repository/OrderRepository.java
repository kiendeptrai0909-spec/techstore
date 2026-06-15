package com.example.techstore.repository;

import com.example.techstore.entity.Order;
import com.example.techstore.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderCode(String orderCode);

    boolean existsByOrderCode(String orderCode);

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findByOrderStatus(OrderStatus orderStatus, Pageable pageable);

    Page<Order> findByUserIdAndOrderStatus(Long userId, OrderStatus orderStatus, Pageable pageable);

    long countByOrderStatus(OrderStatus orderStatus);

    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("""
        select coalesce(sum(o.finalAmount), 0)
        from Order o
        where o.orderStatus in (
            com.example.techstore.enums.OrderStatus.CONFIRMED,
            com.example.techstore.enums.OrderStatus.SHIPPING,
            com.example.techstore.enums.OrderStatus.COMPLETED
        )
        """)
    BigDecimal sumCompletedRevenue();

    @Query(value = """
        select 
            to_char(o.created_at, 'YYYY-MM-DD') as label,
            coalesce(sum(o.final_amount), 0) as revenue,
            count(*) as order_count
        from orders o
        where o.deleted_at is null
          and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
          and o.created_at between :fromDate and :toDate
        group by to_char(o.created_at, 'YYYY-MM-DD')
        order by label
        """, nativeQuery = true)
    List<Object[]> revenueByDay(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );

    @Query(value = """
        select 
            to_char(o.created_at, 'YYYY-MM') as label,
            coalesce(sum(o.final_amount), 0) as revenue,
            count(*) as order_count
        from orders o
        where o.deleted_at is null
          and o.order_status in ('CONFIRMED', 'SHIPPING', 'COMPLETED')
          and o.created_at between :fromDate and :toDate
        group by to_char(o.created_at, 'YYYY-MM')
        order by label
        """, nativeQuery = true)
    List<Object[]> revenueByMonth(
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate
    );

    @Query(value = """
        select
            o.id as order_id,
            o.order_code as order_code,
            u.full_name as customer_name,
            o.final_amount as final_amount,
            o.order_status as order_status,
            p.method as payment_method,
            p.status as payment_status,
            o.created_at as created_at
        from orders o
        join users u on u.id = o.user_id
        left join payments p on p.order_id = o.id
        where o.deleted_at is null
        order by o.created_at desc
        limit :limit
        """, nativeQuery = true)
    List<Object[]> findRecentOrders(@Param("limit") int limit);
}