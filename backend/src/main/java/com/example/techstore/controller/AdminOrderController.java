package com.example.techstore.controller;

import com.example.techstore.dto.request.UpdateOrderStatusRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.service.AdminOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    /*
     * Lấy danh sách đơn hàng.
     *
     * Ví dụ:
     * GET /api/v1/admin/orders?page=0&size=10
     * GET /api/v1/admin/orders?status=PENDING&page=0&size=10
     */
    @GetMapping
    public Page<OrderResponse> getOrders(
            @RequestParam(required = false) OrderStatus status,
            Pageable pageable
    ) {
        return adminOrderService.getOrders(status, pageable);
    }

    /*
     * Xem chi tiết đơn hàng.
     */
    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(@PathVariable Long orderId) {
        return adminOrderService.getOrderById(orderId);
    }

    /*
     * Cập nhật trạng thái đơn hàng.
     */
    @PutMapping("/{orderId}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        return adminOrderService.updateOrderStatus(orderId, request);
    }
}