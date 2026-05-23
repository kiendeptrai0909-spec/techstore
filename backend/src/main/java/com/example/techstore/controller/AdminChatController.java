package com.example.techstore.controller;

import com.example.techstore.dto.request.ChatMessageRequest;
import com.example.techstore.dto.response.ChatMessageResponse;
import com.example.techstore.dto.response.ChatSessionResponse;
import com.example.techstore.enums.ChatStatus;
import com.example.techstore.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/chat")
@RequiredArgsConstructor
public class AdminChatController {

    private final ChatService chatService;

    @GetMapping("/sessions")
    public Page<ChatSessionResponse> getSessions(
            @RequestParam(required = false) ChatStatus status,
            Pageable pageable
    ) {
        return chatService.getAdminSessions(status, pageable);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public Page<ChatMessageResponse> getMessages(
            @PathVariable Long sessionId,
            Pageable pageable
    ) {
        return chatService.getAdminMessages(sessionId, pageable);
    }

    @PutMapping("/sessions/{sessionId}/assign")
    public ChatSessionResponse assignSession(@PathVariable Long sessionId) {
        return chatService.assignSession(sessionId);
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ChatMessageResponse sendMessage(
            @PathVariable Long sessionId,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        return chatService.sendStaffMessage(sessionId, request);
    }

    @PutMapping("/sessions/{sessionId}/close")
    public ChatSessionResponse closeSession(@PathVariable Long sessionId) {
        return chatService.closeSession(sessionId);
    }
}
