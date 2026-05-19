package com.example.techstore.dto.request;

import com.example.techstore.enums.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductVariantRequest {

    @NotBlank(message = "Tên biến thể không được để trống")
    private String name;

    @NotBlank(message = "SKU không được để trống")
    private String sku;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.00", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal price;

    @DecimalMin(value = "0.00", message = "Giá khuyến mãi không hợp lệ")
    private BigDecimal salePrice;

    @NotNull(message = "Tồn kho không được để trống")
    @Min(value = 0, message = "Tồn kho không được âm")
    private Integer stock;

    private String thumbnailUrl;

    @NotNull(message = "Trạng thái biến thể không được để trống")
    private ProductStatus status;
}