package com.example.techstore.controller;

import com.example.techstore.dto.response.ProductReviewResponse;
import com.example.techstore.enums.ReviewStatus;
import com.example.techstore.service.AdminReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final AdminReviewService adminReviewService;

    /*
     * Admin lấy danh sách đánh giá với bộ lọc theo trạng thái.
     */
    @GetMapping
    public Page<ProductReviewResponse> getReviews(
            @RequestParam(required = false) ReviewStatus status,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        return adminReviewService.getReviews(status, keyword, pageable);
    }

    /*
     * Admin duyệt đánh giá (chuyển từ PENDING sang VISIBLE).
     */
    @PutMapping("/{reviewId}/approve")
    public ProductReviewResponse approveReview(@PathVariable Long reviewId) {
        return adminReviewService.approveReview(reviewId);
    }

    /*
     * Admin ẩn đánh giá (chuyển sang HIDDEN).
     */
    @PutMapping("/{reviewId}/hide")
    public ProductReviewResponse hideReview(@PathVariable Long reviewId) {
        return adminReviewService.hideReview(reviewId);
    }

    /*
     * Admin xóa đánh giá (soft delete).
     */
    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        adminReviewService.deleteReview(reviewId);
    }
}
