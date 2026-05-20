package com.example.techstore.controller;

import com.example.techstore.dto.request.NewsPostRequest;
import com.example.techstore.dto.response.NewsPostResponse;
import com.example.techstore.service.NewsPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/news")
@RequiredArgsConstructor
public class AdminNewsPostController {

    private final NewsPostService newsPostService;

    /*
     * Admin lấy danh sách bài viết.
     *
     * GET /api/v1/admin/news?page=0&size=10
     */
    @GetMapping
    public Page<NewsPostResponse> getAllNewsPosts(Pageable pageable) {
        return newsPostService.getAllNewsPosts(pageable);
    }

    /*
     * Admin xem chi tiết bài viết.
     */
    @GetMapping("/{id}")
    public NewsPostResponse getNewsPostById(@PathVariable Long id) {
        return newsPostService.getNewsPostById(id);
    }

    /*
     * Admin tạo bài viết.
     */
    @PostMapping
    public NewsPostResponse createNewsPost(@Valid @RequestBody NewsPostRequest request) {
        return newsPostService.createNewsPost(request);
    }

    /*
     * Admin cập nhật bài viết.
     */
    @PutMapping("/{id}")
    public NewsPostResponse updateNewsPost(
            @PathVariable Long id,
            @Valid @RequestBody NewsPostRequest request
    ) {
        return newsPostService.updateNewsPost(id, request);
    }

    /*
     * Admin xóa mềm bài viết.
     */
    @DeleteMapping("/{id}")
    public void deleteNewsPost(@PathVariable Long id) {
        newsPostService.deleteNewsPost(id);
    }
}