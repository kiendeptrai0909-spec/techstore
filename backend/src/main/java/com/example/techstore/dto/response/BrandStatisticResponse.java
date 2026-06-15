package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class BrandStatisticResponse {
    private Long brandId;
    private String brandName;
    private Long totalQuantitySold;
    private Long totalOrders;
    private BigDecimal totalRevenue;
}
