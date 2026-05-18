package com.example.techstore.repository;

import com.example.techstore.entity.Order;
import com.example.techstore.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

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
}