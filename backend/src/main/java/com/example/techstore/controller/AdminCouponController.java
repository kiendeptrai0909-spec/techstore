package com.example.techstore.controller;

import com.example.techstore.dto.request.CouponRequest;
import com.example.techstore.dto.response.CouponResponse;
import com.example.techstore.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/coupons")
@RequiredArgsConstructor
public class AdminCouponController {

    private final CouponService couponService;

    /*
     * Admin lấy danh sách mã giảm giá.
     */
    @GetMapping
    public List<CouponResponse> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    /*
     * Admin xem chi tiết một mã giảm giá.
     */
    @GetMapping("/{id}")
    public CouponResponse getCouponById(@PathVariable Long id) {
        return couponService.getCouponById(id);
    }

    /*
     * Admin tạo mã giảm giá mới.
     */
    @PostMapping
    public CouponResponse createCoupon(@Valid @RequestBody CouponRequest request) {
        return couponService.createCoupon(request);
    }

    /*
     * Admin cập nhật mã giảm giá.
     */
    @PutMapping("/{id}")
    public CouponResponse updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest request
    ) {
        return couponService.updateCoupon(id, request);
    }

    /*
     * Admin xóa mềm mã giảm giá.
     */
    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
    }
}