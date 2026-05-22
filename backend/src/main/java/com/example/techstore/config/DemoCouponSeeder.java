package com.example.techstore.config;

import com.example.techstore.entity.Coupon;
import com.example.techstore.enums.CouponStatus;
import com.example.techstore.enums.DiscountType;
import com.example.techstore.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(50)
public class DemoCouponSeeder implements CommandLineRunner {

    private final CouponRepository couponRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedCoupons();
    }

    private void seedCoupons() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startAt = now.minusDays(1);
        LocalDateTime endAt = now.plusMonths(6);

        List<CouponSeed> coupons = List.of(
                new CouponSeed(
                        "WELCOME100K",
                        "Ưu đãi khách hàng mới",
                        "Giảm 100.000đ cho đơn hàng từ 2.000.000đ. Phù hợp cho khách hàng mới mua lần đầu tại TechStore.",
                        DiscountType.FIXED,
                        BigDecimal.valueOf(100_000),
                        BigDecimal.valueOf(2_000_000),
                        null,
                        500,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "TECHSTORE10",
                        "Giảm 10% toàn cửa hàng",
                        "Giảm 10% giá trị đơn hàng, tối đa 500.000đ cho đơn từ 5.000.000đ.",
                        DiscountType.PERCENTAGE,
                        BigDecimal.valueOf(10),
                        BigDecimal.valueOf(5_000_000),
                        BigDecimal.valueOf(500_000),
                        300,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "LAPTOP500",
                        "Ưu đãi laptop",
                        "Giảm 500.000đ cho đơn hàng laptop từ 15.000.000đ.",
                        DiscountType.FIXED,
                        BigDecimal.valueOf(500_000),
                        BigDecimal.valueOf(15_000_000),
                        null,
                        200,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "GAMING5",
                        "Ưu đãi phụ kiện gaming",
                        "Giảm 5% tối đa 300.000đ cho các đơn hàng gaming gear từ 3.000.000đ.",
                        DiscountType.PERCENTAGE,
                        BigDecimal.valueOf(5),
                        BigDecimal.valueOf(3_000_000),
                        BigDecimal.valueOf(300_000),
                        300,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "MONITOR300",
                        "Ưu đãi màn hình",
                        "Giảm 300.000đ cho đơn hàng màn hình từ 8.000.000đ.",
                        DiscountType.FIXED,
                        BigDecimal.valueOf(300_000),
                        BigDecimal.valueOf(8_000_000),
                        null,
                        200,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "FREESHIP30",
                        "Hỗ trợ phí vận chuyển",
                        "Giảm 30.000đ cho đơn hàng từ 1.000.000đ. Có thể dùng để hỗ trợ phí vận chuyển.",
                        DiscountType.FIXED,
                        BigDecimal.valueOf(30_000),
                        BigDecimal.valueOf(1_000_000),
                        null,
                        1000,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "VIP1000",
                        "Ưu đãi đơn hàng giá trị cao",
                        "Giảm 1.000.000đ cho đơn hàng từ 30.000.000đ.",
                        DiscountType.FIXED,
                        BigDecimal.valueOf(1_000_000),
                        BigDecimal.valueOf(30_000_000),
                        null,
                        100,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                ),
                new CouponSeed(
                        "BUILDPC15",
                        "Ưu đãi build PC",
                        "Giảm 15% tối đa 1.500.000đ cho đơn build PC từ 20.000.000đ.",
                        DiscountType.PERCENTAGE,
                        BigDecimal.valueOf(15),
                        BigDecimal.valueOf(20_000_000),
                        BigDecimal.valueOf(1_500_000),
                        150,
                        0,
                        startAt,
                        endAt,
                        CouponStatus.ACTIVE
                )
        );

        for (CouponSeed seed : coupons) {
            upsertCoupon(seed);
        }
    }

    private void upsertCoupon(CouponSeed seed) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(seed.code())
                .orElseGet(Coupon::new);

        coupon.setCode(seed.code().trim().toUpperCase());
        coupon.setName(seed.name());
        coupon.setDescription(seed.description());
        coupon.setDiscountType(seed.discountType());
        coupon.setDiscountValue(seed.discountValue());
        coupon.setMinOrderAmount(seed.minOrderAmount());
        coupon.setMaxDiscountAmount(seed.maxDiscountAmount());
        coupon.setUsageLimit(seed.usageLimit());
        coupon.setUsedCount(seed.usedCount());
        coupon.setStartAt(seed.startAt());
        coupon.setEndAt(seed.endAt());
        coupon.setStatus(seed.status());
        coupon.setDeletedAt(null);

        couponRepository.save(coupon);
    }

    private record CouponSeed(
            String code,
            String name,
            String description,
            DiscountType discountType,
            BigDecimal discountValue,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscountAmount,
            Integer usageLimit,
            Integer usedCount,
            LocalDateTime startAt,
            LocalDateTime endAt,
            CouponStatus status
    ) {
    }
}