package com.example.techstore.dto.request;

import com.example.techstore.enums.CouponStatus;
import com.example.techstore.enums.DiscountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class CouponRequest {

    @NotBlank(message = "Mã giảm giá không được để trống")
    private String code;

    @NotBlank(message = "Tên mã giảm giá không được để trống")
    private String name;

    private String description;

    /*
     * PERCENTAGE: giảm theo %
     * FIXED: giảm số tiền cố định
     */
    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;

    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;

    /*
     * Giá trị đơn hàng tối thiểu để được dùng mã
     */
    @NotNull(message = "Giá trị đơn hàng tối thiểu không được để trống")
    @DecimalMin(value = "0.00", message = "Giá trị đơn hàng tối thiểu không hợp lệ")
    private BigDecimal minOrderAmount;

    /*
     * Chỉ dùng nhiều cho PERCENTAGE.
     * Ví dụ giảm 10% tối đa 500000.
     */
    private BigDecimal maxDiscountAmount;

    /*
     * Tổng số lượt được dùng.
     * Có thể null nếu không giới hạn.
     */
    private Integer usageLimit;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    @NotNull(message = "Trạng thái mã giảm giá không được để trống")
    private CouponStatus status;
}