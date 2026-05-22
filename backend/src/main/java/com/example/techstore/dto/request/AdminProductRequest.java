package com.example.techstore.dto.request;

import com.example.techstore.enums.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminProductRequest {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    private String slug;

    private String description;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    private Long brandId;

    private Boolean featured;

    private ProductStatus status;

    private String thumbnailUrl;

    @Valid
    private List<ProductVariantRequest> variants;
}