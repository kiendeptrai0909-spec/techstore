package com.example.techstore.dto.response;

import com.example.techstore.enums.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderResponse {

    private Long id;

    private String orderCode;

    private OrderStatus orderStatus;

    private BigDecimal subtotalAmount;

    private BigDecimal shippingFee;

    private BigDecimal discountAmount;

    private BigDecimal finalAmount;

    private String couponCode;

    private String receiverName;

    private String receiverPhone;

    private String shippingAddress;

    private String note;

    private PaymentResponse payment;

    private List<OrderItemResponse> items;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}