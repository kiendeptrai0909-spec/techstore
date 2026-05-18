package com.example.techstore.repository;

import com.example.techstore.entity.CouponUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponUsageRepository extends JpaRepository<CouponUsage, Long> {

    Optional<CouponUsage> findByOrderId(Long orderId);

    List<CouponUsage> findByUserId(Long userId);

    List<CouponUsage> findByCouponId(Long couponId);

    long countByCouponId(Long couponId);

    boolean existsByOrderId(Long orderId);
}