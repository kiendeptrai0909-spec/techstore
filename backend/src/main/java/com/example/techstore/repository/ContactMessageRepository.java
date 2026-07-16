package com.example.techstore.repository;

import com.example.techstore.entity.ContactMessage;
import com.example.techstore.enums.ContactStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    Page<ContactMessage> findByDeletedAtIsNull(Pageable pageable);

    Page<ContactMessage> findByStatusAndDeletedAtIsNull(
            ContactStatus status,
            Pageable pageable
    );

    @Query("""
        SELECT c FROM ContactMessage c
        WHERE c.deletedAt IS NULL
          AND (:status IS NULL OR c.status = :status)
          AND (
            :keyword IS NULL OR :keyword = ''
            OR LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
        ORDER BY c.createdAt DESC
        """)
    Page<ContactMessage> searchContactMessages(
            @Param("keyword") String keyword,
            @Param("status") ContactStatus status,
            Pageable pageable
    );
}