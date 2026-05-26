package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import com.example.techstore.enums.ProductStatus;
@Getter
@Builder
public class CartItemResponse {

    private Long cartItemId;

    private Long productId;

    private String productSlug;

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

    private ProductStatus productStatus;

    private ProductStatus variantStatus;

    private Boolean available;

    private String unavailableReason;
}