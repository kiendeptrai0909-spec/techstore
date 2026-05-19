package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class RevenueStatisticResponse {

    /*
     * Nhãn thời gian.
     * Ví dụ:
     * - 2026-05-19 nếu thống kê theo ngày
     * - 2026-05 nếu thống kê theo tháng
     */
    private String label;

    /*
     * Tổng doanh thu trong khoảng thời gian đó.
     */
    private BigDecimal revenue;

    /*
     * Số đơn hàng hoàn thành trong khoảng thời gian đó.
     */
    private Long orderCount;
}