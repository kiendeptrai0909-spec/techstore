package com.example.techstore.controller;

import com.example.techstore.dto.response.BrandStatisticResponse;
import com.example.techstore.dto.response.CategoryStatisticResponse;
import com.example.techstore.dto.response.DashboardSummaryResponse;
import com.example.techstore.dto.response.LowStockProductResponse;
import com.example.techstore.dto.response.PaymentStatisticResponse;
import com.example.techstore.dto.response.RecentOrderResponse;
import com.example.techstore.dto.response.RevenueStatisticResponse;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.techstore.dto.response.InventoryWarningResponse;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        return dashboardService.getSummary();
    }

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

    @GetMapping("/top-products")
    public List<TopProductResponse> getTopProducts(
            @RequestParam(defaultValue = "5") Integer limit
    ) {
        return dashboardService.getTopProducts(limit);
    }

    @GetMapping("/category-statistics")
    public List<CategoryStatisticResponse> getCategoryStatistics(
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        return dashboardService.getCategoryStatistics(limit, fromDate, toDate);
    }
    @GetMapping("/old-stock-products")
    public List<InventoryWarningResponse> getOldStockProducts(
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "180") Integer days
    ) {
        return dashboardService.getOldStockProducts(limit, days);
    }

    @GetMapping("/stagnant-products")
    public List<InventoryWarningResponse> getStagnantProducts(
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "90") Integer days
    ) {
        return dashboardService.getStagnantProducts(limit, days);
    }
    @GetMapping("/brand-statistics")
    public List<BrandStatisticResponse> getBrandStatistics(
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        return dashboardService.getBrandStatistics(limit, fromDate, toDate);
    }

    @GetMapping("/payment-statistics")
    public List<PaymentStatisticResponse> getPaymentStatistics(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        return dashboardService.getPaymentStatistics(fromDate, toDate);
    }

    @GetMapping("/low-stock-products")
    public List<LowStockProductResponse> getLowStockProducts(
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "5") Integer threshold
    ) {
        return dashboardService.getLowStockProducts(limit, threshold);
    }

    @GetMapping("/recent-orders")
    public List<RecentOrderResponse> getRecentOrders(
            @RequestParam(defaultValue = "5") Integer limit
    ) {
        return dashboardService.getRecentOrders(limit);
    }
}
