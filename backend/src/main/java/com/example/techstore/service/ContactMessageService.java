package com.example.techstore.service;

import com.example.techstore.dto.request.ContactMessageRequest;
import com.example.techstore.dto.request.UpdateContactMessageStatusRequest;
import com.example.techstore.dto.response.ContactMessageResponse;
import com.example.techstore.entity.ContactMessage;
import com.example.techstore.enums.ContactStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;

    @Transactional
    public ContactMessageResponse createContactMessage(ContactMessageRequest request) {
        ContactMessage contactMessage = ContactMessage.builder()
                .fullName(request.getFullName().trim())
                .email(request.getEmail().trim())
                .phone(request.getPhone())
                .subject(request.getSubject().trim())
                .message(request.getMessage().trim())
                .status(ContactStatus.NEW)
                .build();

        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        return toResponse(savedMessage);
    }

    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getContactMessages(
            String keyword,
            ContactStatus status,
            Pageable pageable
    ) {
        String normalizedKeyword = (keyword == null) ? "" : keyword.trim();
        return contactMessageRepository
                .searchContactMessages(normalizedKeyword, status, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ContactMessageResponse getContactMessageById(Long id) {
        ContactMessage contactMessage = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy liên hệ"));

        if (contactMessage.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy liên hệ");
        }

        return toResponse(contactMessage);
    }

    @Transactional
    public ContactMessageResponse updateContactMessageStatus(
            Long id,
            UpdateContactMessageStatusRequest request
    ) {
        ContactMessage contactMessage = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy liên hệ"));

        if (contactMessage.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy liên hệ");
        }

        contactMessage.setStatus(request.getStatus());

        ContactMessage savedMessage = contactMessageRepository.save(contactMessage);

        return toResponse(savedMessage);
    }

    @Transactional
    public void deleteContactMessage(Long id) {
        ContactMessage contactMessage = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy liên hệ"));

        contactMessage.setStatus(ContactStatus.CLOSED);
        contactMessage.setDeletedAt(LocalDateTime.now());

        contactMessageRepository.save(contactMessage);
    }

    private ContactMessageResponse toResponse(ContactMessage contactMessage) {
        return ContactMessageResponse.builder()
                .id(contactMessage.getId())
                .fullName(contactMessage.getFullName())
                .email(contactMessage.getEmail())
                .phone(contactMessage.getPhone())
                .subject(contactMessage.getSubject())
                .message(contactMessage.getMessage())
                .status(contactMessage.getStatus())
                .createdAt(contactMessage.getCreatedAt())
                .updatedAt(contactMessage.getUpdatedAt())
                .build();
    }
}