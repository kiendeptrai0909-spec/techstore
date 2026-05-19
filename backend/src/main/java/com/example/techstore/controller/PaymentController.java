package com.example.techstore.controller;

import com.example.techstore.dto.response.PaymentResponse;
import com.example.techstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/{orderId}/mock-pay")
    public PaymentResponse mockPay(@PathVariable Long orderId) {
        return paymentService.mockPay(orderId);
    }

    @GetMapping("/orders/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }
}