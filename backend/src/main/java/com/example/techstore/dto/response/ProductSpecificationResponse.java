package com.example.techstore.dto.response;

import com.example.techstore.entity.ProductSpecification;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductSpecificationResponse {

    private Long id;
    private Long specificationKeyId;
    private String name;
    private String value;
    private String unit;
    private Integer sortOrder;

    public static ProductSpecificationResponse from(ProductSpecification specification) {
        return ProductSpecificationResponse.builder()
                .id(specification.getId())
                .specificationKeyId(specification.getSpecificationKey().getId())
                .name(specification.getSpecificationKey().getName())
                .value(specification.getValue())
                .unit(specification.getSpecificationKey().getUnit())
                .sortOrder(specification.getSpecificationKey().getSortOrder())
                .build();
    }
}