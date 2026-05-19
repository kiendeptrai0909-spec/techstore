package com.example.techstore.dto.response;

import com.example.techstore.enums.ProductStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FaqResponse {

    private Long id;

    private String question;

    private String answer;

    private Integer sortOrder;

    private ProductStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}