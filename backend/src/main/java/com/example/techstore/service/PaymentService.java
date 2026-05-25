package com.example.techstore.service;

import com.example.techstore.dto.response.PaymentResponse;
import com.example.techstore.entity.Order;
import com.example.techstore.entity.Payment;
import com.example.techstore.entity.User;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.enums.UserRole;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import com.example.techstore.dto.request.SePayWebhookRequest;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    @Value("${sepay.webhook-api-key}")
    private String sepayWebhookApiKey;

    @Value("${sepay.bank-account}")
    private String sepayBankAccount;
    @Transactional
    public PaymentResponse confirmBankTransfer(Long orderId) {
        User user = getCurrentUser();

        if (
                user.getRole() != UserRole.ROLE_ADMIN
                        && user.getRole() != UserRole.ROLE_STAFF
        ) {
            throw new BadRequestException("Bạn không có quyền xác nhận thanh toán");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể xác nhận thanh toán cho đơn hàng đã hủy");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin thanh toán"));

        if (payment.getMethod() != PaymentMethod.BANK_TRANSFER) {
            throw new BadRequestException("Đơn hàng này không sử dụng phương thức chuyển khoản");
        }

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Đơn hàng đã được thanh toán");
        }

        if (payment.getStatus() == PaymentStatus.FAILED) {
            throw new BadRequestException("Thanh toán đã thất bại");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionCode(generateTransactionCode("BANK"));

        Payment savedPayment = paymentRepository.save(payment);

        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        return toPaymentResponse(savedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        User user = getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        boolean isOwner = order.getUser().getId().equals(user.getId());
        boolean isAdminOrStaff =
                user.getRole() == UserRole.ROLE_ADMIN
                        || user.getRole() == UserRole.ROLE_STAFF;

        if (!isOwner && !isAdminOrStaff) {
            throw new ResourceNotFoundException("Không tìm thấy đơn hàng");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin thanh toán"));

        return toPaymentResponse(payment);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private String generateTransactionCode(String prefix) {
        String timePart = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String randomPart = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();

        return prefix + timePart + randomPart;
    }

    private PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .transactionCode(payment.getTransactionCode())
                .paidAt(payment.getPaidAt())
                .build();
    }
    @Transactional
    public void handleSePayWebhook(
            String authorization,
            SePayWebhookRequest request
    ) {
        String expectedAuthorization = "Apikey " + sepayWebhookApiKey;

        if (authorization == null || !authorization.equals(expectedAuthorization)) {
            throw new BadRequestException("Webhook SePay không hợp lệ");
        }

        if (request == null) {
            return;
        }

        if (!"in".equalsIgnoreCase(request.getTransferType())) {
            return;
        }

        if (
                sepayBankAccount != null
                        && !sepayBankAccount.isBlank()
                        && request.getAccountNumber() != null
                        && !sepayBankAccount.equals(request.getAccountNumber())
        ) {
            return;
        }

        String transactionCode = getTransactionCode(request);

        if (
                transactionCode != null
                        && paymentRepository.findByTransactionCode(transactionCode).isPresent()
        ) {
            return;
        }

        String orderCode = extractOrderCode(request.getContent());

        if (orderCode == null) {
            orderCode = extractOrderCode(request.getCode());
        }

        if (orderCode == null) {
            orderCode = extractOrderCode(request.getDescription());
        }

        if (orderCode == null) {
            return;
        }

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElse(null);

        if (order == null) {
            return;
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(null);

        if (payment == null) {
            return;
        }

        if (payment.getStatus() == PaymentStatus.PAID) {
            return;
        }

        if (payment.getMethod() != PaymentMethod.BANK_TRANSFER) {
            return;
        }

        BigDecimal transferAmount = request.getTransferAmount();

        if (
                transferAmount == null
                        || transferAmount.compareTo(payment.getAmount()) < 0
        ) {
            return;
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionCode(transactionCode);

        paymentRepository.save(payment);

        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setOrderStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }
    }
    private String extractOrderCode(String content) {
        if (content == null || content.isBlank()) {
            return null;
        }

        Pattern pattern = Pattern.compile("ORD\\d{18}");
        Matcher matcher = pattern.matcher(content.toUpperCase());

        if (matcher.find()) {
            return matcher.group();
        }

        return null;
    }

    private String getTransactionCode(SePayWebhookRequest request) {
        if (request.getReferenceCode() != null && !request.getReferenceCode().isBlank()) {
            return request.getReferenceCode();
        }

        if (request.getId() != null) {
            return "SEPAY" + request.getId();
        }

        return null;
    }
}