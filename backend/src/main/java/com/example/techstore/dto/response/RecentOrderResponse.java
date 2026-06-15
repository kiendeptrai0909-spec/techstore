package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class RecentOrderResponse {
    private Long orderId;
    private String orderCode;
    private String customerName;
    private BigDecimal finalAmount;
    private String orderStatus;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime createdAt;
}
