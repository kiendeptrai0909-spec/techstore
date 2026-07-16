package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpecificationKeyResponse {
    private Long id;
    private String name;
    private String unit;
    private Integer sortOrder;
}
