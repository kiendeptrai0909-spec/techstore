package com.example.techstore.dto.request;

import com.example.techstore.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRequest {

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotNull(message = "Thương hiệu không được để trống")
    private Long brandId;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotBlank(message = "Slug sản phẩm không được để trống")
    private String slug;

    private String description;

    private Boolean featured;

    @NotNull(message = "Trạng thái sản phẩm không được để trống")
    private ProductStatus status;
}