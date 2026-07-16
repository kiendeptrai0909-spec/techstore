package com.example.techstore.dto.response;

import com.example.techstore.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BrandResponse {

    private Long id;

    private String name;

    private String slug;

    private String logoUrl;

    private String description;

    private ProductStatus status;
}