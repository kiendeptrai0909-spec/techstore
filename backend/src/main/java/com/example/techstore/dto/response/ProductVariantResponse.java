package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class ProductVariantResponse {

    private Long id;

    private String name;

    private String sku;

    private BigDecimal price;

    private BigDecimal salePrice;

    private Integer stock;

    private String thumbnailUrl;

    private String description;

    private List<ProductSpecificationResponse> specifications;
}