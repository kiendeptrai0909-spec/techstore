package com.example.techstore.repository;

import com.example.techstore.entity.ChatSession;
import com.example.techstore.enums.ChatStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {

    Page<ChatSession> findByCustomerId(Long customerId, Pageable pageable);

    Page<ChatSession> findByStaffId(Long staffId, Pageable pageable);

    Page<ChatSession> findByStatus(ChatStatus status, Pageable pageable);

    long countByStatus(ChatStatus status);
}