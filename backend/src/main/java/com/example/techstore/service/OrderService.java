package com.example.techstore.service;

import com.example.techstore.dto.request.CreateOrderRequest;
import com.example.techstore.dto.response.OrderItemResponse;
import com.example.techstore.dto.response.OrderResponse;
import com.example.techstore.dto.response.PaymentResponse;
import com.example.techstore.entity.Cart;
import com.example.techstore.entity.CartItem;
import com.example.techstore.entity.Coupon;
import com.example.techstore.entity.Order;
import com.example.techstore.entity.OrderItem;
import com.example.techstore.entity.Payment;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.entity.User;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.PaymentStatus;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.CartItemRepository;
import com.example.techstore.repository.CartRepository;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import com.example.techstore.enums.PaymentMethod;
@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal DEFAULT_SHIPPING_FEE = BigDecimal.ZERO;

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CouponService couponService;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = getCurrentUser();
        validatePendingBankTransferLimit(user, request);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Giỏ hàng đang trống"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Giỏ hàng đang trống");
        }

        validateCartItems(cartItems);

        BigDecimal subtotalAmount = calculateSubtotal(cartItems);
        BigDecimal shippingFee = DEFAULT_SHIPPING_FEE;

        Coupon coupon = couponService.getValidCouponForCheckout(
                request.getCouponCode(),
                subtotalAmount
        );

        BigDecimal discountAmount = couponService.calculateDiscountAmount(
                coupon,
                subtotalAmount
        );

        BigDecimal finalAmount = subtotalAmount
                .add(shippingFee)
                .subtract(discountAmount);

        Order order = Order.builder()
                .user(user)
                .coupon(coupon)
                .couponCode(coupon != null ? coupon.getCode() : null)
                .orderCode(generateOrderCode())
                .subtotalAmount(subtotalAmount)
                .shippingFee(shippingFee)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .orderStatus(OrderStatus.PENDING)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .shippingAddress(request.getShippingAddress())
                .note(request.getNote())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();
            Product product = variant.getProduct();

            BigDecimal price = getFinalPrice(variant);
            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(savedOrder)
                    .product(product)
                    .productVariant(variant)
                    .productName(product.getName())
                    .variantName(variant.getName())
                    .productSku(variant.getSku())
                    .price(price)
                    .quantity(cartItem.getQuantity())
                    .totalPrice(totalPrice)
                    .build();

            orderItemRepository.save(orderItem);

            variant.setStock(variant.getStock() - cartItem.getQuantity());
            productVariantRepository.save(variant);
        }

        Payment payment = Payment.builder()
                .order(savedOrder)
                .method(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .amount(finalAmount)
                .transactionCode(null)
                .paidAt(null)
                .build();

        paymentRepository.save(payment);

        couponService.markCouponAsUsed(coupon, user, savedOrder);

        cartItemRepository.deleteByCartId(cart.getId());

        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getMyOrders(Pageable pageable) {
        User user = getCurrentUser();

        return orderRepository.findByUserId(user.getId(), pageable)
                .map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrderById(Long orderId) {
        User user = getCurrentUser();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Không tìm thấy đơn hàng");
        }

        return toOrderResponse(order);
    }

    private void validateCartItems(List<CartItem> cartItems) {
        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();
            Product product = variant.getProduct();

            if (product.getStatus() != ProductStatus.ACTIVE || product.getDeletedAt() != null) {
                throw new BadRequestException(
                        "Sản phẩm " + product.getName() + " đã ngừng bán, vui lòng xóa khỏi giỏ hàng"
                );
            }

            if (variant.getStatus() != ProductStatus.ACTIVE || variant.getDeletedAt() != null) {
                throw new BadRequestException(
                        "Phiên bản " + variant.getName() + " đã ngừng bán, vui lòng xóa khỏi giỏ hàng"
                );
            }

            if (cartItem.getQuantity() <= 0) {
                throw new BadRequestException("Số lượng sản phẩm không hợp lệ");
            }

            if (cartItem.getQuantity() > variant.getStock()) {
                throw new BadRequestException(
                        "Sản phẩm " + product.getName() + " - " + variant.getName()
                                + " chỉ còn " + variant.getStock() + " sản phẩm"
                );
            }
        }
    }

    private BigDecimal calculateSubtotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(cartItem -> {
                    BigDecimal price = getFinalPrice(cartItem.getProductVariant());
                    return price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getFinalPrice(ProductVariant variant) {
        if (variant.getSalePrice() != null && variant.getSalePrice().compareTo(BigDecimal.ZERO) > 0) {
            return variant.getSalePrice();
        }

        return variant.getPrice();
    }

    private String generateOrderCode() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Random random = new Random();

        String orderCode;

        do {
            int randomNumber = random.nextInt(9000) + 1000;
            orderCode = "ORD" + datePart + randomNumber;
        } while (orderRepository.existsByOrderCode(orderCode));

        return orderCode;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
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
    private void validatePendingBankTransferLimit(
            User user,
            CreateOrderRequest request
    ) {
        if (request.getPaymentMethod() != PaymentMethod.BANK_TRANSFER) {
            return;
        }

        long pendingCount = paymentRepository.countPendingBankTransferOrdersByUser(
                user.getId(),
                OrderStatus.PENDING,
                PaymentMethod.BANK_TRANSFER,
                PaymentStatus.PENDING
        );

        if (pendingCount >= 3) {
            throw new BadRequestException(
                    "Bạn đang có quá nhiều đơn chuyển khoản chưa thanh toán. Vui lòng thanh toán hoặc chờ hệ thống hủy đơn quá hạn trước khi đặt tiếp."
            );
        }
    }
}