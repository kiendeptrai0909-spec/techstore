package com.example.techstore.controller;

import com.example.techstore.dto.request.ProductReviewRequest;
import com.example.techstore.dto.response.ProductReviewResponse;
import com.example.techstore.service.ProductReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService productReviewService;

    /*
     * User tạo đánh giá cho sản phẩm đã mua.
     */
    @PostMapping("/api/v1/products/{productId}/reviews")
    public ProductReviewResponse createReview(
            @PathVariable Long productId,
            @Valid @RequestBody ProductReviewRequest request
    ) {
        return productReviewService.createReview(productId, request);
    }

    /*
     * Public API: xem đánh giá của một sản phẩm.
     */
    @GetMapping("/api/v1/products/{productId}/reviews")
    public Page<ProductReviewResponse> getProductReviews(
            @PathVariable Long productId,
            Pageable pageable
    ) {
        return productReviewService.getProductReviews(productId, pageable);
    }

    /*
     * User xem các đánh giá của mình.
     */
    @GetMapping("/api/v1/reviews/my-reviews")
    public Page<ProductReviewResponse> getMyReviews(Pageable pageable) {
        return productReviewService.getMyReviews(pageable);
    }

    /*
     * User cập nhật đánh giá của mình.
     */
    @PutMapping("/api/v1/reviews/{reviewId}")
    public ProductReviewResponse updateMyReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ProductReviewRequest request
    ) {
        return productReviewService.updateMyReview(reviewId, request);
    }

    /*
     * User xóa mềm đánh giá của mình.
     */
    @DeleteMapping("/api/v1/reviews/{reviewId}")
    public void deleteMyReview(@PathVariable Long reviewId) {
        productReviewService.deleteMyReview(reviewId);
    }
}