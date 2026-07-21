package com.example.techstore.dto.response;

import com.example.techstore.enums.ReviewStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProductReviewResponse {

    private Long id;

    private Long productId;

    private String productName;

    private Long userId;

    private String userFullName;

    private String userEmail;

    private Long orderItemId;

    private Integer rating;

    private String comment;

    private ReviewStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}