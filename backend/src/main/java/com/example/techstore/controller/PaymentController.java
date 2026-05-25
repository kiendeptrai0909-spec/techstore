package com.example.techstore.controller;

import com.example.techstore.dto.request.SePayWebhookRequest;
import com.example.techstore.dto.response.PaymentResponse;
import com.example.techstore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/sepay-webhook")
    public ResponseEntity<Map<String, Boolean>> handleSePayWebhook(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody SePayWebhookRequest request
    ) {
        paymentService.handleSePayWebhook(authorization, request);

        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/{orderId}/confirm-bank-transfer")
    public PaymentResponse confirmBankTransfer(@PathVariable Long orderId) {
        return paymentService.confirmBankTransfer(orderId);
    }

    @GetMapping("/orders/{orderId}")
    public PaymentResponse getPaymentByOrderId(@PathVariable Long orderId) {
        return paymentService.getPaymentByOrderId(orderId);
    }
}