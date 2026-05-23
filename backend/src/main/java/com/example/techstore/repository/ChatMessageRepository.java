package com.example.techstore.repository;

import com.example.techstore.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    Page<ChatMessage> findBySessionIdOrderByCreatedAtAsc(Long sessionId, Pageable pageable);

    List<ChatMessage> findBySessionIdOrderByIdAsc(Long sessionId);

    Optional<ChatMessage> findTopBySessionIdOrderByIdDesc(Long sessionId);
}