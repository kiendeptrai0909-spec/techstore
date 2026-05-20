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
}