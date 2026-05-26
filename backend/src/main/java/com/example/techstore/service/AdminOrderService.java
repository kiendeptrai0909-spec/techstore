package com.example.techstore.service;

import com.example.techstore.dto.request.UpdateOrderStatusRequest;
import com.example.techstore.dto.response.OrderItemResponse;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.dto.response.PaymentResponse;
import com.example.techstore.entity.Order;
import com.example.techstore.entity.OrderItem;
import com.example.techstore.entity.Payment;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentMethod;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final OrderInventoryService orderInventoryService;

    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrders(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByOrderStatus(status, pageable)
                    .map(this::toOrderResponse);
        }

        return orderRepository.findAll(pageable)
                .map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        OrderStatus currentStatus = order.getOrderStatus();
        OrderStatus newStatus = request.getOrderStatus();

        validateStatusTransition(currentStatus, newStatus);

        if (newStatus == OrderStatus.CANCELLED) {
            handleCancelOrder(order);
        }

        order.setOrderStatus(newStatus);

        /*
         * Với đơn COD, khi admin chuyển đơn sang COMPLETED,
         * có thể hiểu là khách đã nhận hàng và đã thanh toán tiền mặt.
         */
        if (newStatus == OrderStatus.COMPLETED) {
            markCodPaymentAsPaidIfNeeded(order);
        }

        Order savedOrder = orderRepository.save(order);

        return toOrderResponse(savedOrder);
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            throw new BadRequestException("Đơn hàng đã ở trạng thái này");
        }

        if (currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Không thể cập nhật đơn hàng đã hủy");
        }

        if (currentStatus == OrderStatus.COMPLETED) {
            throw new BadRequestException("Không thể cập nhật đơn hàng đã hoàn thành");
        }

        boolean valid = switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED
                    || newStatus == OrderStatus.CANCELLED;

            case CONFIRMED -> newStatus == OrderStatus.SHIPPING
                    || newStatus == OrderStatus.CANCELLED;

            case SHIPPING -> newStatus == OrderStatus.COMPLETED;

            default -> false;
        };

        if (!valid) {
            throw new BadRequestException(
                    "Không thể chuyển trạng thái từ "
                            + currentStatus
                            + " sang "
                            + newStatus
            );
        }
    }

    private void handleCancelOrder(Order order) {
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(null);

        /*
         * Nếu không có payment thì vẫn hoàn tồn kho để tránh mất hàng.
         */
        if (payment == null) {
            orderInventoryService.restoreStock(order);
            return;
        }

        /*
         * Đơn chưa thanh toán bị hủy:
         * - Hoàn tồn kho
         * - Payment chuyển FAILED
         */
        if (payment.getStatus() == PaymentStatus.PENDING) {
            orderInventoryService.restoreStock(order);

            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);

            return;
        }

        /*
         * Đơn đã thanh toán bị hủy/refund:
         * Không tự hoàn tồn kho ở đây.
         * Vì refund còn tùy trường hợp:
         * - Shop chưa giao hàng: có thể hoàn tồn kho
         * - Khách đã nhận rồi trả hàng: chỉ hoàn tồn kho khi nhận lại hàng còn bán được
         * - Hàng lỗi/hỏng: không nên hoàn tồn kho
         */
    }

    private void markCodPaymentAsPaidIfNeeded(Order order) {
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElse(null);

        if (payment == null) {
            return;
        }

        if (payment.getMethod() == PaymentMethod.COD
                && payment.getStatus() == PaymentStatus.PENDING) {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDateTime.now());
            payment.setTransactionCode(generateCodTransactionCode());

            paymentRepository.save(payment);
        }
    }

    private String generateCodTransactionCode() {
        String timePart = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String randomPart = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();

        return "COD" + timePart + randomPart;
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = orderItemRepository.findByOrderId(order.getId())
                .stream()
                .map(this::toOrderItemResponse)
                .toList();

        PaymentResponse payment = paymentRepository.findByOrderId(order.getId())
                .map(this::toPaymentResponse)
                .orElse(null);

        return OrderResponse.builder()
                .id(order.getId())
                .orderCode(order.getOrderCode())
                .orderStatus(order.getOrderStatus())
                .subtotalAmount(order.getSubtotalAmount())
                .shippingFee(order.getShippingFee())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .couponCode(order.getCouponCode())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .payment(payment)
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toOrderItemResponse(OrderItem orderItem) {
        ProductVariant variant = orderItem.getProductVariant();
        Product product = orderItem.getProduct();

        String thumbnailUrl = null;

        if (
                variant != null
                        && variant.getThumbnailUrl() != null
                        && !variant.getThumbnailUrl().isBlank()
        ) {
            thumbnailUrl = variant.getThumbnailUrl();
        }

        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .productId(product != null ? product.getId() : null)
                .productVariantId(variant != null ? variant.getId() : null)
                .productName(orderItem.getProductName())
                .productSlug(product != null ? product.getSlug() : null)
                .variantName(orderItem.getVariantName())
                .productSku(orderItem.getProductSku())
                .thumbnailUrl(thumbnailUrl)
                .price(orderItem.getPrice())
                .quantity(orderItem.getQuantity())
                .totalPrice(orderItem.getTotalPrice())
                .build();
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
}