package com.example.techstore.controller;

import com.example.techstore.dto.request.ContactMessageRequest;
import com.example.techstore.dto.response.ContactMessageResponse;
import com.example.techstore.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact-messages")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    /*
     * Public API: khách hàng gửi liên hệ.
     *
     * POST /api/v1/contact-messages
     */
    @PostMapping
    public ContactMessageResponse createContactMessage(
            @Valid @RequestBody ContactMessageRequest request
    ) {
        return contactMessageService.createContactMessage(request);
    }
}