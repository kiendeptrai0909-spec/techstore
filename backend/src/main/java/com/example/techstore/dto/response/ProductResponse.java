package com.example.techstore.dto.response;

import com.example.techstore.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String slug;

    private String description;

    private Boolean featured;

    private ProductStatus status;

    private CategoryResponse category;

    private BrandResponse brand;

    private List<ProductVariantResponse> variants;
}