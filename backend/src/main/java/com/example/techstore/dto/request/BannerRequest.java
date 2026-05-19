package com.example.techstore.dto.request;

import com.example.techstore.enums.BannerPosition;
import com.example.techstore.enums.ProductStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BannerRequest {

    @NotBlank(message = "Tiêu đề banner không được để trống")
    private String title;

    @NotBlank(message = "Đường dẫn ảnh banner không được để trống")
    private String imageUrl;

    private String linkUrl;

    @NotNull(message = "Vị trí banner không được để trống")
    private BannerPosition position;

    @NotNull(message = "Thứ tự hiển thị không được để trống")
    @Min(value = 0, message = "Thứ tự hiển thị không được âm")
    private Integer sortOrder;

    private LocalDateTime startAt;

    private LocalDateTime endAt;

    @NotNull(message = "Trạng thái banner không được để trống")
    private ProductStatus status;
}