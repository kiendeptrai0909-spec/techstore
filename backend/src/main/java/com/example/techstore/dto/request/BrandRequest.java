package com.example.techstore.dto.request;

import com.example.techstore.enums.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BrandRequest {

    @NotBlank(message = "Tên thương hiệu không được để trống")
    private String name;

    @NotBlank(message = "Slug không được để trống")
    private String slug;

    private String logoUrl;

    private String description;

    private ProductStatus status;
}
