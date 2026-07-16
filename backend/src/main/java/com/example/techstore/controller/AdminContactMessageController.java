package com.example.techstore.controller;

import com.example.techstore.dto.request.UpdateContactMessageStatusRequest;
import com.example.techstore.dto.response.ContactMessageResponse;
import com.example.techstore.enums.ContactStatus;
import com.example.techstore.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/contact-messages")
@RequiredArgsConstructor
public class AdminContactMessageController {

    private final ContactMessageService contactMessageService;

    @GetMapping
    public Page<ContactMessageResponse> getContactMessages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ContactStatus status,
            Pageable pageable
    ) {
        return contactMessageService.getContactMessages(keyword, status, pageable);
    }

    @GetMapping("/{id}")
    public ContactMessageResponse getContactMessageById(@PathVariable Long id) {
        return contactMessageService.getContactMessageById(id);
    }

    @PutMapping("/{id}/status")
    public ContactMessageResponse updateContactMessageStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateContactMessageStatusRequest request
    ) {
        return contactMessageService.updateContactMessageStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteContactMessage(@PathVariable Long id) {
        contactMessageService.deleteContactMessage(id);
    }
}