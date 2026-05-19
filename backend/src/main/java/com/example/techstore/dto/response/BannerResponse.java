package com.example.techstore.dto.response;

import com.example.techstore.enums.BannerPosition;
import com.example.techstore.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BannerResponse {

    private Long id;

    private String title;

    private String imageUrl;

    private String linkUrl;

    private BannerPosition position;

    private Integer sortOrder;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private ProductStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}