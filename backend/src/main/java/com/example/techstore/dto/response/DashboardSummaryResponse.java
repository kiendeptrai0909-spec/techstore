package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DashboardSummaryResponse {

    /*
     * Tổng doanh thu từ các đơn hàng đã hoàn thành.
     */
    private BigDecimal totalRevenue;

    /*
     * Tổng số đơn hàng.
     */
    private Long totalOrders;

    /*
     * Số đơn hàng đang chờ xử lý.
     */
    private Long pendingOrders;

    /*
     * Số đơn hàng đã xác nhận.
     */
    private Long confirmedOrders;

    /*
     * Số đơn hàng đang giao.
     */
    private Long shippingOrders;

    /*
     * Số đơn hàng đã hoàn thành.
     */
    private Long completedOrders;

    /*
     * Số đơn hàng đã hủy.
     */
    private Long cancelledOrders;

    /*
     * Tổng số khách hàng.
     */
    private Long totalCustomers;

    /*
     * Tổng số sản phẩm.
     */
    private Long totalProducts;

    /*
     * Tổng số biến thể sản phẩm.
     */
    private Long totalProductVariants;

    /*
     * Tổng số đánh giá sản phẩm.
     */
    private Long totalReviews;
}