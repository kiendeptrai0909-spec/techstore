package com.example.techstore.service;

import com.example.techstore.entity.Order;
import com.example.techstore.entity.Payment;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PendingPaymentCleanupService {

    private static final int PAYMENT_TIMEOUT_MINUTES = 15;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderInventoryService orderInventoryService;

    /*
     * Chạy mỗi 1 phút.
     * Đơn BANK_TRANSFER quá 15 phút chưa thanh toán sẽ tự hủy.
     */
    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void cancelExpiredBankTransferOrders() {
        LocalDateTime expiredAt = LocalDateTime.now()
                .minusMinutes(PAYMENT_TIMEOUT_MINUTES);

        List<Payment> expiredPayments =
                paymentRepository.findExpiredPendingBankTransfers(
                        PaymentMethod.BANK_TRANSFER,
                        PaymentStatus.PENDING,
                        OrderStatus.PENDING,
                        expiredAt
                );

        for (Payment payment : expiredPayments) {
            Order order = payment.getOrder();

            orderInventoryService.restoreStock(order);

            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            order.setOrderStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
        }
    }
}