package com.example.techstore.service;

import com.example.techstore.dto.response.BrandStatisticResponse;
import com.example.techstore.dto.response.CategoryStatisticResponse;
import com.example.techstore.dto.response.DashboardSummaryResponse;
import com.example.techstore.dto.response.LowStockProductResponse;
import com.example.techstore.dto.response.PaymentStatisticResponse;
import com.example.techstore.dto.response.RecentOrderResponse;
import com.example.techstore.dto.response.RevenueStatisticResponse;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.UserRole;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.PaymentRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductReviewRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductReviewRepository productReviewRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        BigDecimal totalRevenue = orderRepository.sumCompletedRevenue();

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue == null ? BigDecimal.ZERO : totalRevenue)
                .totalOrders(orderRepository.count())
                .pendingOrders(orderRepository.countByOrderStatus(OrderStatus.PENDING))
                .confirmedOrders(orderRepository.countByOrderStatus(OrderStatus.CONFIRMED))
                .shippingOrders(orderRepository.countByOrderStatus(OrderStatus.SHIPPING))
                .completedOrders(orderRepository.countByOrderStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderRepository.countByOrderStatus(OrderStatus.CANCELLED))
                .totalCustomers(userRepository.countByRole(UserRole.ROLE_CUSTOMER))
                .totalProducts(productRepository.count())
                .totalProductVariants(productVariantRepository.count())
                .totalReviews(productReviewRepository.count())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RevenueStatisticResponse> getRevenueStatistics(
            String type,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        String statisticType = type == null ? "day" : type.trim().toLowerCase();

        LocalDate now = LocalDate.now();

        if (fromDate == null) {
            if ("month".equals(statisticType)) {
                fromDate = now.minusMonths(5).withDayOfMonth(1);
            } else {
                fromDate = now.minusDays(6);
            }
        }

        if (toDate == null) {
            toDate = now;
        }

        LocalDateTime fromDateTime = fromDate.atStartOfDay();
        LocalDateTime toDateTime = toDate.atTime(LocalTime.MAX);

        List<Object[]> rows;

        if ("month".equals(statisticType)) {
            rows = orderRepository.revenueByMonth(fromDateTime, toDateTime);
        } else {
            rows = orderRepository.revenueByDay(fromDateTime, toDateTime);
        }

        return rows.stream()
                .map(row -> RevenueStatisticResponse.builder()
                        .label(String.valueOf(row[0]))
                        .revenue(toBigDecimal(row[1]))
                        .orderCount(toLong(row[2]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopProductResponse> getTopProducts(Integer limit) {
        int safeLimit = safeLimit(limit, 5, 20);

        return orderItemRepository.findTopProducts(safeLimit)
                .stream()
                .map(row -> TopProductResponse.builder()
                        .productId(toLong(row[0]))
                        .productName(String.valueOf(row[1]))
                        .productVariantId(toLong(row[2]))
                        .variantName(String.valueOf(row[3]))
                        .productSku(String.valueOf(row[4]))
                        .totalQuantitySold(toLong(row[5]))
                        .totalRevenue(toBigDecimal(row[6]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryStatisticResponse> getCategoryStatistics(
            Integer limit,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        int safeLimit = safeLimit(limit, 5, 20);
        LocalDateTime fromDateTime = toStartDateTime(fromDate);
        LocalDateTime toDateTime = toEndDateTime(toDate);

        return orderItemRepository.findCategoryStatistics(fromDateTime, toDateTime, safeLimit)
                .stream()
                .map(row -> CategoryStatisticResponse.builder()
                        .categoryId(toLong(row[0]))
                        .categoryName(String.valueOf(row[1]))
                        .totalQuantitySold(toLong(row[2]))
                        .totalOrders(toLong(row[3]))
                        .totalRevenue(toBigDecimal(row[4]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BrandStatisticResponse> getBrandStatistics(
            Integer limit,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        int safeLimit = safeLimit(limit, 5, 20);
        LocalDateTime fromDateTime = toStartDateTime(fromDate);
        LocalDateTime toDateTime = toEndDateTime(toDate);

        return orderItemRepository.findBrandStatistics(fromDateTime, toDateTime, safeLimit)
                .stream()
                .map(row -> BrandStatisticResponse.builder()
                        .brandId(toLong(row[0]))
                        .brandName(String.valueOf(row[1]))
                        .totalQuantitySold(toLong(row[2]))
                        .totalOrders(toLong(row[3]))
                        .totalRevenue(toBigDecimal(row[4]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PaymentStatisticResponse> getPaymentStatistics(
            LocalDate fromDate,
            LocalDate toDate
    ) {
        LocalDateTime fromDateTime = toStartDateTime(fromDate);
        LocalDateTime toDateTime = toEndDateTime(toDate);

        return paymentRepository.findPaymentStatistics(fromDateTime, toDateTime)
                .stream()
                .map(row -> PaymentStatisticResponse.builder()
                        .method(String.valueOf(row[0]))
                        .status(String.valueOf(row[1]))
                        .totalOrders(toLong(row[2]))
                        .totalAmount(toBigDecimal(row[3]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LowStockProductResponse> getLowStockProducts(Integer limit, Integer threshold) {
        int safeLimit = safeLimit(limit, 5, 20);
        int safeThreshold = threshold == null || threshold < 0 ? 5 : threshold;

        return productVariantRepository.findLowStockProducts(safeLimit, safeThreshold)
                .stream()
                .map(row -> LowStockProductResponse.builder()
                        .productId(toLong(row[0]))
                        .productName(String.valueOf(row[1]))
                        .productVariantId(toLong(row[2]))
                        .variantName(String.valueOf(row[3]))
                        .productSku(String.valueOf(row[4]))
                        .stock(toInteger(row[5]))
                        .price(toBigDecimal(row[6]))
                        .salePrice(toBigDecimal(row[7]))
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecentOrderResponse> getRecentOrders(Integer limit) {
        int safeLimit = safeLimit(limit, 5, 20);

        return orderRepository.findRecentOrders(safeLimit)
                .stream()
                .map(row -> RecentOrderResponse.builder()
                        .orderId(toLong(row[0]))
                        .orderCode(String.valueOf(row[1]))
                        .customerName(String.valueOf(row[2]))
                        .finalAmount(toBigDecimal(row[3]))
                        .orderStatus(String.valueOf(row[4]))
                        .paymentMethod(row[5] == null ? "" : String.valueOf(row[5]))
                        .paymentStatus(row[6] == null ? "" : String.valueOf(row[6]))
                        .createdAt(toLocalDateTime(row[7]))
                        .build())
                .toList();
    }

    private int safeLimit(Integer limit, int defaultValue, int maxValue) {
        if (limit == null || limit < 1) {
            return defaultValue;
        }

        return Math.min(limit, maxValue);
    }

    private LocalDateTime toStartDateTime(LocalDate date) {
        return date == null ? null : date.atStartOfDay();
    }

    private LocalDateTime toEndDateTime(LocalDate date) {
        return date == null ? null : date.atTime(LocalTime.MAX);
    }

    private BigDecimal toBigDecimal(Object value) {
        if (value == null) {
            return BigDecimal.ZERO;
        }

        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }

        if (value instanceof BigInteger bigInteger) {
            return new BigDecimal(bigInteger);
        }

        if (value instanceof Number number) {
            return BigDecimal.valueOf(number.doubleValue());
        }

        return new BigDecimal(value.toString());
    }

    private Long toLong(Object value) {
        if (value == null) {
            return 0L;
        }

        if (value instanceof BigInteger bigInteger) {
            return bigInteger.longValue();
        }

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.parseLong(value.toString());
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return 0;
        }

        if (value instanceof Number number) {
            return number.intValue();
        }

        return Integer.parseInt(value.toString());
    }

    private LocalDateTime toLocalDateTime(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime;
        }

        if (value instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
        }

        return LocalDateTime.parse(value.toString().replace(" ", "T"));
    }
}
