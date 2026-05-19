package com.example.techstore.service;

import com.example.techstore.dto.request.ProductReviewRequest;
import com.example.techstore.dto.response.ProductReviewResponse;
import com.example.techstore.entity.OrderItem;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductReview;
import com.example.techstore.entity.User;
import com.example.techstore.enums.OrderStatus;
import com.example.techstore.enums.ReviewStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductReviewRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository productReviewRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProductReviewResponse createReview(Long productId, ProductReviewRequest request) {
        User user = getCurrentUser();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi tiết đơn hàng"));

        /*
         * Kiểm tra order item này có thuộc user hiện tại không.
         */
        if (!orderItem.getOrder().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền đánh giá sản phẩm này");
        }

        /*
         * Kiểm tra order item có đúng sản phẩm đang đánh giá không.
         */
        if (!orderItem.getProduct().getId().equals(productId)) {
            throw new BadRequestException("Sản phẩm đánh giá không khớp với đơn hàng");
        }

        /*
         * Chỉ cho đánh giá khi đơn hàng đã hoàn thành.
         */
        if (orderItem.getOrder().getOrderStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Chỉ có thể đánh giá sản phẩm sau khi đơn hàng hoàn thành");
        }

        /*
         * Mỗi orderItem chỉ được đánh giá một lần.
         */
        if (productReviewRepository.existsByOrderItemId(orderItem.getId())) {
            throw new BadRequestException("Sản phẩm trong đơn hàng này đã được đánh giá");
        }

        ProductReview review = ProductReview.builder()
                .product(product)
                .user(user)
                .orderItem(orderItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .status(ReviewStatus.VISIBLE)
                .build();

        ProductReview savedReview = productReviewRepository.save(review);

        return toResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public Page<ProductReviewResponse> getProductReviews(Long productId, Pageable pageable) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        return productReviewRepository
                .findByProductIdAndStatus(productId, ReviewStatus.VISIBLE, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductReviewResponse> getMyReviews(Pageable pageable) {
        User user = getCurrentUser();

        return productReviewRepository.findByUserId(user.getId(), pageable)
                .map(this::toResponse);
    }

    @Transactional
    public ProductReviewResponse updateMyReview(Long reviewId, ProductReviewRequest request) {
        User user = getCurrentUser();

        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền cập nhật đánh giá này");
        }

        if (!review.getOrderItem().getId().equals(request.getOrderItemId())) {
            throw new BadRequestException("Không được thay đổi chi tiết đơn hàng của đánh giá");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(ReviewStatus.VISIBLE);

        ProductReview savedReview = productReviewRepository.save(review);

        return toResponse(savedReview);
    }

    @Transactional
    public void deleteMyReview(Long reviewId) {
        User user = getCurrentUser();

        ProductReview review = productReviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa đánh giá này");
        }

        /*
         * Xóa mềm: chuyển trạng thái HIDDEN và set deletedAt.
         */
        review.setStatus(ReviewStatus.HIDDEN);
        review.setDeletedAt(LocalDateTime.now());

        productReviewRepository.save(review);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private ProductReviewResponse toResponse(ProductReview review) {
        return ProductReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .orderItemId(review.getOrderItem() != null ? review.getOrderItem().getId() : null)
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}