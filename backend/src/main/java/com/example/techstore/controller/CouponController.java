package com.example.techstore.controller;

import com.example.techstore.dto.response.CouponResponse;
import com.example.techstore.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    /*
     * User kiểm tra mã giảm giá trước khi đặt hàng.
     *
     * Ví dụ:
     * GET /api/v1/coupons/validate?code=SALE10&subtotalAmount=10000000
     */
    @GetMapping("/validate")
    public CouponResponse validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal subtotalAmount
    ) {
        return couponService.validateCoupon(code, subtotalAmount);
    }
}