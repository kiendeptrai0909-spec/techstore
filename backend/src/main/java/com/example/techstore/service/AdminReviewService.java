package com.example.techstore.service;

import com.example.techstore.dto.response.ProductReviewResponse;
import com.example.techstore.entity.ProductReview;
import com.example.techstore.enums.ReviewStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.ProductReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminReviewService {

    private final ProductReviewRepository productReviewRepository;

    @Transactional(readOnly = true)
    public Page<ProductReviewResponse> getReviews(ReviewStatus status, String keyword, Pageable pageable) {
        String normalizedKeyword = keyword == null ? null : keyword.trim().toLowerCase();
        
        if (normalizedKeyword == null || normalizedKeyword.isEmpty()) {
            if (status == null) {
                return productReviewRepository.findAll(pageable).map(this::toResponse);
            }
            return productReviewRepository.findByStatus(status, pageable).map(this::toResponse);
        }
        
        return productReviewRepository.searchReviews(status, normalizedKeyword, pageable).map(this::toResponse);
    }

    @Transactional
    public ProductReviewResponse approveReview(Long reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        review.setStatus(ReviewStatus.VISIBLE);
        review.setDeletedAt(null);

        ProductReview savedReview = productReviewRepository.save(review);
        return toResponse(savedReview);
    }

    @Transactional
    public ProductReviewResponse hideReview(Long reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        review.setStatus(ReviewStatus.HIDDEN);

        ProductReview savedReview = productReviewRepository.save(review);
        return toResponse(savedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        review.setStatus(ReviewStatus.HIDDEN);
        review.setDeletedAt(LocalDateTime.now());

        productReviewRepository.save(review);
    }

    private ProductReviewResponse toResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .userEmail(review.getUser().getEmail())
                .orderItemId(review.getOrderItem() != null ? review.getOrderItem().getId() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
