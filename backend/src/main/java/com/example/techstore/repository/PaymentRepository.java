package com.example.techstore.repository;

import com.example.techstore.entity.Payment;
import com.example.techstore.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    boolean existsByOrderId(Long orderId);

    long countByStatus(PaymentStatus status);
}