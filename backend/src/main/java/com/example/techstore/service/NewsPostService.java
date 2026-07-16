package com.example.techstore.service;

import com.example.techstore.dto.request.NewsPostRequest;
import com.example.techstore.dto.response.NewsPostResponse;
import com.example.techstore.entity.NewsPost;
import com.example.techstore.enums.NewsStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.NewsPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NewsPostService {

    private final NewsPostRepository newsPostRepository;

    /*
     * Public: lấy danh sách bài viết ACTIVE.
     */
    @Transactional(readOnly = true)
    public Page<NewsPostResponse> getActiveNewsPosts(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return newsPostRepository
                    .searchActiveNews(NewsStatus.PUBLISHED, keyword.trim().toLowerCase(), pageable)
                    .map(this::toResponse);
        }
        return newsPostRepository
                .findByStatusAndDeletedAtIsNull(NewsStatus.PUBLISHED, pageable)
                .map(this::toResponse);
    }

    /*
     * Public: xem chi tiết bài viết theo slug.
     */
    @Transactional(readOnly = true)
    public NewsPostResponse getActiveNewsPostBySlug(String slug) {
        NewsPost newsPost = newsPostRepository
                .findBySlugIgnoreCaseAndStatusAndDeletedAtIsNull(
                        normalizeSlug(slug),
                        NewsStatus.PUBLISHED
                )
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));

        return toResponse(newsPost);
    }

    /*
     * Admin: lấy tất cả bài viết chưa xóa mềm.
     */
    @Transactional(readOnly = true)
    public Page<NewsPostResponse> getAllNewsPosts(Pageable pageable) {
        return newsPostRepository.findByDeletedAtIsNull(pageable)
                .map(this::toResponse);
    }

    /*
     * Admin: xem chi tiết bài viết theo id.
     */
    @Transactional(readOnly = true)
    public NewsPostResponse getNewsPostById(Long id) {
        NewsPost newsPost = newsPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));

        if (newsPost.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy bài viết");
        }

        return toResponse(newsPost);
    }

    /*
     * Admin: tạo bài viết.
     */
    @Transactional
    public NewsPostResponse createNewsPost(NewsPostRequest request) {
        String slug = normalizeSlug(request.getSlug());

        if (newsPostRepository.existsBySlugIgnoreCase(slug)) {
            throw new BadRequestException("Slug bài viết đã tồn tại");
        }

        NewsPost newsPost = NewsPost.builder()
                .title(request.getTitle().trim())
                .slug(slug)
                .summary(request.getSummary())
                .content(request.getContent().trim())
                .thumbnailUrl(request.getThumbnailUrl())
                .status(request.getStatus())
                .build();

        NewsPost savedNewsPost = newsPostRepository.save(newsPost);

        return toResponse(savedNewsPost);
    }

    /*
     * Admin: cập nhật bài viết.
     */
    @Transactional
    public NewsPostResponse updateNewsPost(Long id, NewsPostRequest request) {
        NewsPost newsPost = newsPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));

        if (newsPost.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy bài viết");
        }

        String slug = normalizeSlug(request.getSlug());

        newsPostRepository.findBySlugIgnoreCase(slug)
                .ifPresent(existingNewsPost -> {
                    if (!existingNewsPost.getId().equals(id)) {
                        throw new BadRequestException("Slug bài viết đã tồn tại");
                    }
                });

        newsPost.setTitle(request.getTitle().trim());
        newsPost.setSlug(slug);
        newsPost.setSummary(request.getSummary());
        newsPost.setContent(request.getContent().trim());
        newsPost.setThumbnailUrl(request.getThumbnailUrl());
        newsPost.setStatus(request.getStatus());

        if (request.getStatus() == NewsStatus.PUBLISHED) {
            newsPost.setDeletedAt(null);
        }

        NewsPost savedNewsPost = newsPostRepository.save(newsPost);

        return toResponse(savedNewsPost);
    }

    /*
     * Admin: xóa mềm bài viết.
     */
    @Transactional
    public void deleteNewsPost(Long id) {
        NewsPost newsPost = newsPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bài viết"));

        newsPost.setStatus(NewsStatus.HIDDEN);
        newsPost.setDeletedAt(LocalDateTime.now());

        newsPostRepository.save(newsPost);
    }

    private String normalizeSlug(String slug) {
        return slug.trim().toLowerCase();
    }

    private NewsPostResponse toResponse(NewsPost newsPost) {
        return NewsPostResponse.builder()
                .id(newsPost.getId())
                .title(newsPost.getTitle())
                .slug(newsPost.getSlug())
                .summary(newsPost.getSummary())
                .content(newsPost.getContent())
                .thumbnailUrl(newsPost.getThumbnailUrl())
                .status(newsPost.getStatus())
                .createdAt(newsPost.getCreatedAt())
                .updatedAt(newsPost.getUpdatedAt())
                .build();
    }
}