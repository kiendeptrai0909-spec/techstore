package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class OrderItemResponse {

    private Long id;

    private Long productId;

    private Long productVariantId;

    private String thumbnailUrl;
    /*
     * Snapshot tên sản phẩm tại thời điểm đặt hàng.
     */
    private String productName;

    /*
     * Snapshot tên biến thể tại thời điểm đặt hàng.
     */
    private String variantName;

    /*
     * Snapshot SKU tại thời điểm đặt hàng.
     */
    private String productSku;

    /*
     * Giá tại thời điểm đặt hàng.
     */
    private BigDecimal price;

    private Integer quantity;

    private BigDecimal totalPrice;
}