package com.example.techstore.service;

import com.example.techstore.dto.response.DashboardSummaryResponse;
import com.example.techstore.dto.response.RevenueStatisticResponse;
import com.example.techstore.dto.response.TopProductResponse;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.UserRole;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.OrderRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductReviewRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.BigInteger;
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

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        BigDecimal totalRevenue = orderRepository.sumCompletedRevenue();

        return DashboardSummaryResponse.builder()
                .totalRevenue(totalRevenue)
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
        int safeLimit = limit == null ? 5 : limit;

        if (safeLimit < 1) {
            safeLimit = 5;
        }

        if (safeLimit > 20) {
            safeLimit = 20;
        }

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
}