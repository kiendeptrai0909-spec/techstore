package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class LowStockProductResponse {
    private Long productId;
    private String productName;
    private Long productVariantId;
    private String variantName;
    private String productSku;
    private Integer stock;
    private BigDecimal price;
    private BigDecimal salePrice;
}
