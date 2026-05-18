package com.example.techstore.repository;

import com.example.techstore.entity.NewsPost;
import com.example.techstore.enums.NewsStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsPostRepository extends JpaRepository<NewsPost, Long> {

    Optional<NewsPost> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<NewsPost> findByStatus(NewsStatus status, Pageable pageable);
}