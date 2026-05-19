package com.example.techstore.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductReviewRequest {

    /*
     * orderItemId dùng để chứng minh user đã mua sản phẩm này.
     */
    @NotNull(message = "Mã chi tiết đơn hàng không được để trống")
    private Long orderItemId;

    @NotNull(message = "Số sao đánh giá không được để trống")
    @Min(value = 1, message = "Số sao tối thiểu là 1")
    @Max(value = 5, message = "Số sao tối đa là 5")
    private Integer rating;

    private String comment;
}