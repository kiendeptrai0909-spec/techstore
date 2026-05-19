package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CartItemResponse {

    private Long cartItemId;

    private Long productId;

    private String productName;

    private Long productVariantId;

    private String variantName;

    private String sku;

    private String thumbnailUrl;

    private BigDecimal price;

    private BigDecimal salePrice;

    private BigDecimal finalPrice;

    private Integer quantity;

    private BigDecimal totalPrice;

    private Integer stock;
}