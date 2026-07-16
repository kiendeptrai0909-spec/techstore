package com.example.techstore.repository;

import com.example.techstore.entity.NewsPost;
import com.example.techstore.enums.NewsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsPostRepository extends JpaRepository<NewsPost, Long> {

    Page<NewsPost> findByDeletedAtIsNull(Pageable pageable);

    Page<NewsPost> findByStatusAndDeletedAtIsNull(
            NewsStatus status,
            Pageable pageable
    );

    Optional<NewsPost> findBySlugIgnoreCase(String slug);

    Optional<NewsPost> findBySlugIgnoreCaseAndStatusAndDeletedAtIsNull(
            String slug,
            NewsStatus status
    );

    boolean existsBySlugIgnoreCase(String slug);

    @org.springframework.data.jpa.repository.Query("SELECT n FROM NewsPost n WHERE n.status = :status AND n.deletedAt IS NULL AND (LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<NewsPost> searchActiveNews(
            @org.springframework.data.repository.query.Param("status") NewsStatus status,
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            Pageable pageable
    );
}