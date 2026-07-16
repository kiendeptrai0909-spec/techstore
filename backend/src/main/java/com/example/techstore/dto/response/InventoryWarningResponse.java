package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class InventoryWarningResponse {

    private Long productId;
    private String productName;

    private Long productVariantId;
    private String variantName;
    private String productSku;

    private Integer stock;

    private BigDecimal price;
    private BigDecimal salePrice;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private LocalDateTime lastSoldAt;

    private Long daysInStock;
    private Long daysSinceLastSold;

    private String suggestion;
}