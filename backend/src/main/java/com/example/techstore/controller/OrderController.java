package com.example.techstore.controller;

import com.example.techstore.dto.request.CreateOrderRequest;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/my-orders")
    public Page<OrderResponse> getMyOrders(Pageable pageable) {
        return orderService.getMyOrders(pageable);
    }

    @GetMapping("/{orderId}")
    public OrderResponse getMyOrderById(@PathVariable Long orderId) {
        return orderService.getMyOrderById(orderId);
    }

    @PostMapping("/{orderId}/cancel")
    public OrderResponse cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }
}