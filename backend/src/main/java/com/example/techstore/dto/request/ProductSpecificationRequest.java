package com.example.techstore.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductSpecificationRequest {

    @NotNull(message = "Mã khóa thông số không được để trống")
    private Long specificationKeyId;

    private String value;
}
