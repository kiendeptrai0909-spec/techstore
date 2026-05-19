package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class TopProductResponse {

    private Long productId;

    private String productName;

    private Long productVariantId;

    private String variantName;

    private String productSku;

    /*
     * Tổng số lượng đã bán.
     */
    private Long totalQuantitySold;

    /*
     * Tổng doanh thu của sản phẩm / biến thể này.
     */
    private BigDecimal totalRevenue;
}