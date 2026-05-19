package com.example.techstore.service;

import com.example.techstore.dto.request.CouponRequest;
import com.example.techstore.dto.response.CouponResponse;
import com.example.techstore.entity.Coupon;
import com.example.techstore.entity.CouponUsage;
import com.example.techstore.entity.Order;
import com.example.techstore.entity.User;
import com.example.techstore.enums.CouponStatus;
import com.example.techstore.enums.DiscountType;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.CouponRepository;
import com.example.techstore.repository.CouponUsageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        String code = normalizeCode(request.getCode());

        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new BadRequestException("Mã giảm giá đã tồn tại");
        }

        validateCouponRequest(request);

        Coupon coupon = Coupon.builder()
                .code(code)
                .name(request.getName())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount())
                .maxDiscountAmount(request.getMaxDiscountAmount())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .status(request.getStatus())
                .build();

        return toResponse(couponRepository.save(coupon));
    }

    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        String code = normalizeCode(request.getCode());

        couponRepository.findByCodeIgnoreCase(code)
                .ifPresent(existingCoupon -> {
                    if (!existingCoupon.getId().equals(id)) {
                        throw new BadRequestException("Mã giảm giá đã tồn tại");
                    }
                });

        validateCouponRequest(request);

        coupon.setCode(code);
        coupon.setName(request.getName());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setStartAt(request.getStartAt());
        coupon.setEndAt(request.getEndAt());
        coupon.setStatus(request.getStatus());

        return toResponse(couponRepository.save(coupon));
    }

    @Transactional(readOnly = true)
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll()
                .stream()
                .filter(coupon -> coupon.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        if (coupon.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy mã giảm giá");
        }

        return toResponse(coupon);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá"));

        coupon.setStatus(CouponStatus.INACTIVE);
        coupon.setDeletedAt(LocalDateTime.now());

        couponRepository.save(coupon);
    }

    /*
     * Dùng cho API user kiểm tra mã giảm giá trước khi đặt hàng.
     */
    @Transactional(readOnly = true)
    public CouponResponse validateCoupon(String code, BigDecimal subtotalAmount) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Mã giảm giá không được để trống");
        }

        if (subtotalAmount == null || subtotalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Tổng tiền đơn hàng không hợp lệ");
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizeCode(code))
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại"));

        validateCouponCanUse(coupon, subtotalAmount);

        BigDecimal discountAmount = calculateDiscountAmount(coupon, subtotalAmount);

        return toValidationResponse(coupon, true, "Mã giảm giá hợp lệ", discountAmount);
    }

    /*
     * Dùng trong OrderService khi checkout.
     * Method này trả về Coupon hợp lệ hoặc throw lỗi nếu không hợp lệ.
     */
    @Transactional(readOnly = true)
    public Coupon getValidCouponForCheckout(String code, BigDecimal subtotalAmount) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizeCode(code))
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại"));

        validateCouponCanUse(coupon, subtotalAmount);

        return coupon;
    }

    /*
     * Dùng trong OrderService để tính số tiền giảm.
     */
    public BigDecimal calculateDiscountAmount(Coupon coupon, BigDecimal subtotalAmount) {
        if (coupon == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal discountAmount;

        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = subtotalAmount
                    .multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            if (coupon.getMaxDiscountAmount() != null
                    && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discountAmount = coupon.getMaxDiscountAmount();
            }
        } else if (coupon.getDiscountType() == DiscountType.FIXED) {
            discountAmount = coupon.getDiscountValue();
        } else {
            throw new BadRequestException("Loại giảm giá không hợp lệ");
        }

        if (discountAmount.compareTo(subtotalAmount) > 0) {
            discountAmount = subtotalAmount;
        }

        return discountAmount;
    }

    /*
     * Dùng sau khi tạo đơn hàng thành công để tăng lượt dùng coupon
     * và ghi lịch sử vào bảng coupon_usages.
     */
    @Transactional
    public void markCouponAsUsed(Coupon coupon, User user, Order order) {
        if (coupon == null) {
            return;
        }

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        CouponUsage couponUsage = CouponUsage.builder()
                .coupon(coupon)
                .user(user)
                .order(order)
                .build();

        couponUsageRepository.save(couponUsage);
    }

    private void validateCouponRequest(CouponRequest request) {
        if (request.getDiscountType() == DiscountType.PERCENTAGE) {
            if (request.getDiscountValue().compareTo(new BigDecimal("100")) > 0) {
                throw new BadRequestException("Giảm giá theo phần trăm không được vượt quá 100%");
            }
        }

        if (request.getDiscountType() == DiscountType.FIXED) {
            if (request.getMaxDiscountAmount() != null) {
                throw new BadRequestException("Giảm giá cố định không cần nhập số tiền giảm tối đa");
            }
        }

        if (request.getUsageLimit() != null && request.getUsageLimit() <= 0) {
            throw new BadRequestException("Số lượt sử dụng phải lớn hơn 0");
        }

        if (request.getStartAt() != null
                && request.getEndAt() != null
                && request.getEndAt().isBefore(request.getStartAt())) {
            throw new BadRequestException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }

    private void validateCouponCanUse(Coupon coupon, BigDecimal subtotalAmount) {
        if (coupon.getDeletedAt() != null) {
            throw new BadRequestException("Mã giảm giá không hợp lệ");
        }

        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new BadRequestException("Mã giảm giá không hoạt động");
        }

        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
            throw new BadRequestException("Mã giảm giá chưa đến thời gian sử dụng");
        }

        if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
            throw new BadRequestException("Mã giảm giá đã hết hạn");
        }

        if (coupon.getMinOrderAmount() != null
                && subtotalAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã");
        }

        if (coupon.getUsageLimit() != null
                && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    private CouponResponse toResponse(Coupon coupon) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .startAt(coupon.getStartAt())
                .endAt(coupon.getEndAt())
                .status(coupon.getStatus())
                .valid(null)
                .message(null)
                .discountAmount(null)
                .build();
    }

    private CouponResponse toValidationResponse(
            Coupon coupon,
            Boolean valid,
            String message,
            BigDecimal discountAmount
    ) {
        return CouponResponse.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .name(coupon.getName())
                .description(coupon.getDescription())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscountAmount(coupon.getMaxDiscountAmount())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .startAt(coupon.getStartAt())
                .endAt(coupon.getEndAt())
                .status(coupon.getStatus())
                .valid(valid)
                .message(message)
                .discountAmount(discountAmount)
                .build();
    }
}