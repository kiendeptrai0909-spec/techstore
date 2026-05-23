package com.example.techstore.controller;

import com.example.techstore.dto.response.NewsPostResponse;
import com.example.techstore.service.NewsPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
public class NewsPostController {

    private final NewsPostService newsPostService;

    /*
     * Public API: lấy danh sách bài viết đang hiển thị.
     *
     * GET /api/v1/news?page=0&size=10
     */
    @GetMapping
    public Page<NewsPostResponse> getActiveNewsPosts(Pageable pageable) {
        return newsPostService.getActiveNewsPosts(pageable);
    }

    /*
     * Public API: xem chi tiết bài viết theo slug.
     *
     * GET /api/v1/news/slug/nen-mua-laptop-nao-cho-sinh-vien-cntt
     */
    @GetMapping("/slug/{slug}")
    public NewsPostResponse getActiveNewsPostBySlug(@PathVariable String slug) {
        return newsPostService.getActiveNewsPostBySlug(slug);
    }
}