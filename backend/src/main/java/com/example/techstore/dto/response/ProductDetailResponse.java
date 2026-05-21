package com.example.techstore.dto.response;

import com.example.techstore.entity.ProductImage;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductDetailResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private Boolean featured;
    private String status;

    private CategoryResponse category;
    private BrandResponse brand;

    private List<ProductVariantResponse> variants;
    private List<ImageResponse> images;
    private List<ProductSpecificationResponse> specifications;
    private List<ProductReviewResponse> reviews;

    @Getter
    @Builder
    public static class ImageResponse {

        private Long id;
        private String imageUrl;
        private Integer sortOrder;

        public static ImageResponse from(ProductImage image) {
            return ImageResponse.builder()
                    .id(image.getId())
                    .imageUrl(image.getImageUrl())
                    .sortOrder(image.getSortOrder())
                    .build();
        }
    }
}