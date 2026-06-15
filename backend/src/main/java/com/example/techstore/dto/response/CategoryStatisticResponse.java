package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class CategoryStatisticResponse {
    private Long categoryId;
    private String categoryName;
    private Long totalQuantitySold;
    private Long totalOrders;
    private BigDecimal totalRevenue;
}
