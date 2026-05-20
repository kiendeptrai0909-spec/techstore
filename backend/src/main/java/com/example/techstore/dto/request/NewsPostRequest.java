package com.example.techstore.dto.request;

import com.example.techstore.enums.NewsStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsPostRequest {

    @NotBlank(message = "Tiêu đề bài viết không được để trống")
    private String title;

    @NotBlank(message = "Slug bài viết không được để trống")
    private String slug;

    private String summary;

    @NotBlank(message = "Nội dung bài viết không được để trống")
    private String content;

    private String thumbnailUrl;

    @NotNull(message = "Trạng thái bài viết không được để trống")
    private NewsStatus status;
}