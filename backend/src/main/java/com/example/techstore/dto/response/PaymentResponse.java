package com.example.techstore.dto.response;

import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponse {

    private Long id;

    private PaymentMethod method;

    private PaymentStatus status;

    private BigDecimal amount;

    private String transactionCode;

    private LocalDateTime paidAt;
}