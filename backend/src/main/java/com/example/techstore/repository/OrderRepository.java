package com.example.techstore.repository;

import com.example.techstore.entity.Order;
import com.example.techstore.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDateTime;
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
        where o.orderStatus = com.example.techstore.enums.OrderStatus.COMPLETED
        """)
    BigDecimal sumCompletedRevenue();

    @Query(value = """
        select 
            to_char(o.created_at, 'YYYY-MM-DD') as label,
            coalesce(sum(o.final_amount), 0) as revenue,
            count(*) as order_count
        from orders o
        where o.order_status = 'COMPLETED'
          and o.created_at between :fromDate and :toDate
        group by to_char(o.created_at, 'YYYY-MM-DD')
        order by label
        """, nativeQuery = true)
    List<Object[]> revenueByDay(
            @Param("fromDate") java.time.LocalDateTime fromDate,
            @Param("toDate") java.time.LocalDateTime toDate
    );

    @Query(value = """
        select 
            to_char(o.created_at, 'YYYY-MM') as label,
            coalesce(sum(o.final_amount), 0) as revenue,
            count(*) as order_count
        from orders o
        where o.order_status = 'COMPLETED'
          and o.created_at between :fromDate and :toDate
        group by to_char(o.created_at, 'YYYY-MM')
        order by label
        """, nativeQuery = true)
    List<Object[]> revenueByMonth(
            @Param("fromDate") java.time.LocalDateTime fromDate,
            @Param("toDate") java.time.LocalDateTime toDate
    );
}