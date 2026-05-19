package com.example.techstore.dto.response;

import com.example.techstore.enums.CouponStatus;
import com.example.techstore.enums.DiscountType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class CouponResponse {

    private Long id;

    private String code;

    private String name;

    private String description;

    private DiscountType discountType;

    private BigDecimal discountValue;

    private BigDecimal minOrderAmount;

    private BigDecimal maxDiscountAmount;

    private Integer usageLimit;

    private Integer usedCount;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    private CouponStatus status;

    /*
     * Dùng khi validate coupon cho checkout.
     */
    private Boolean valid;

    private String message;

    private BigDecimal discountAmount;
}