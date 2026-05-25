package com.example.techstore.repository;

import com.example.techstore.entity.Payment;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByTransactionCode(String transactionCode);

    @Query("""
        select count(p)
        from Payment p
        where p.order.user.id = :userId
          and p.order.orderStatus = :orderStatus
          and p.method = :method
          and p.status = :paymentStatus
        """)
    long countPendingBankTransferOrdersByUser(
            @Param("userId") Long userId,
            @Param("orderStatus") OrderStatus orderStatus,
            @Param("method") PaymentMethod method,
            @Param("paymentStatus") PaymentStatus paymentStatus
    );

    @Query("""
        select p
        from Payment p
        join fetch p.order o
        where p.method = :method
          and p.status = :paymentStatus
          and o.orderStatus = :orderStatus
          and o.createdAt < :expiredAt
        """)
    List<Payment> findExpiredPendingBankTransfers(
            @Param("method") PaymentMethod method,
            @Param("paymentStatus") PaymentStatus paymentStatus,
            @Param("orderStatus") OrderStatus orderStatus,
            @Param("expiredAt") LocalDateTime expiredAt
    );
}