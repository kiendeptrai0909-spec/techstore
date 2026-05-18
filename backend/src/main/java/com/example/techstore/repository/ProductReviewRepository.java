package com.example.techstore.repository;

import com.example.techstore.entity.ProductReview;
import com.example.techstore.enums.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

import java.util.Optional;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    Page<ProductReview> findByProductIdAndStatus(
            Long productId,
            ReviewStatus status,
            Pageable pageable
    );

    Page<ProductReview> findByUserId(Long userId, Pageable pageable);

    Optional<ProductReview> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    boolean existsByOrderItemId(Long orderItemId);

    @Query("""
            select coalesce(avg(r.rating), 0)
            from ProductReview r
            where r.product.id = :productId
              and r.status = com.example.techstore.enums.ReviewStatus.VISIBLE
            """)
    Double getAverageRatingByProductId(Long productId);
}