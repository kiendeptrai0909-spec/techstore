package com.example.techstore.dto.request;

import com.example.techstore.enums.ProductStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FaqRequest {

    @NotBlank(message = "Câu hỏi không được để trống")
    private String question;

    @NotBlank(message = "Câu trả lời không được để trống")
    private String answer;

    @NotNull(message = "Thứ tự hiển thị không được để trống")
    @Min(value = 0, message = "Thứ tự hiển thị không được âm")
    private Integer sortOrder;

    @NotNull(message = "Trạng thái FAQ không được để trống")
    private ProductStatus status;
}