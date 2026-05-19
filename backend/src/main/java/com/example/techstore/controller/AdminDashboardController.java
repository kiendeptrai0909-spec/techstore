package com.example.techstore.controller;

import com.example.techstore.dto.response.DashboardSummaryResponse;
import com.example.techstore.dto.response.RevenueStatisticResponse;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    /*
     * Tổng quan dashboard:
     * - Tổng doanh thu
     * - Tổng đơn hàng
     * - Đơn theo trạng thái
     * - Tổng khách hàng
     * - Tổng sản phẩm
     */
    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        return dashboardService.getSummary();
    }

    /*
     * Thống kê doanh thu.
     *
     * Ví dụ:
     * GET /api/v1/admin/dashboard/revenue?type=day
     * GET /api/v1/admin/dashboard/revenue?type=month
     * GET /api/v1/admin/dashboard/revenue?type=day&fromDate=2026-05-01&toDate=2026-05-31
     */
    @GetMapping("/revenue")
    public List<RevenueStatisticResponse> getRevenueStatistics(
            @RequestParam(defaultValue = "day") String type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        return dashboardService.getRevenueStatistics(type, fromDate, toDate);
    }

    /*
     * Sản phẩm bán chạy.
     *
     * Ví dụ:
     * GET /api/v1/admin/dashboard/top-products?limit=5
     */
    @GetMapping("/top-products")
    public List<TopProductResponse> getTopProducts(
            @RequestParam(defaultValue = "5") Integer limit
    ) {
        return dashboardService.getTopProducts(limit);
    }
}