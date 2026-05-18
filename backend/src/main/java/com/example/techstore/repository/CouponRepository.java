package com.example.techstore.repository;

import com.example.techstore.entity.Coupon;
import com.example.techstore.enums.CouponStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {

    Optional<Coupon> findByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCase(String code);

    List<Coupon> findByStatus(CouponStatus status);
}