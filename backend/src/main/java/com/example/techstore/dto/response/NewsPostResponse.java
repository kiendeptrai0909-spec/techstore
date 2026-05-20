package com.example.techstore.dto.response;

import com.example.techstore.enums.NewsStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NewsPostResponse {

    private Long id;

    private String title;

    private String slug;

    private String summary;

    private String content;

    private String thumbnailUrl;

    private NewsStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}