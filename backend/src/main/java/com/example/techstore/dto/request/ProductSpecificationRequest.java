package com.example.techstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSpecificationRequest {

    private Long specificationKeyId;

    @NotBlank(message = "Tên thông số không được để trống")
    private String name;

    @NotBlank(message = "Giá trị thông số không được để trống")
    private String value;
}
