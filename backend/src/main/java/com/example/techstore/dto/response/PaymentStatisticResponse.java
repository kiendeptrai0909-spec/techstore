package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class PaymentStatisticResponse {
    private String method;
    private String status;
    private Long totalOrders;
    private BigDecimal totalAmount;
}
