package com.example.techstore.controller;

import com.example.techstore.dto.request.ChatMessageRequest;
import com.example.techstore.dto.response.ChatMessageResponse;
import com.example.techstore.dto.response.ChatSessionResponse;
import com.example.techstore.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/sessions")
    public ChatSessionResponse createSession() {
        return chatService.createSession();
    }

    @GetMapping("/sessions")
    public Page<ChatSessionResponse> getMySessions(Pageable pageable) {
        return chatService.getMySessions(pageable);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public Page<ChatMessageResponse> getMessages(
            @PathVariable Long sessionId,
            Pageable pageable
    ) {
        return chatService.getCustomerMessages(sessionId, pageable);
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public ChatMessageResponse sendMessage(
            @PathVariable Long sessionId,
            @Valid @RequestBody ChatMessageRequest request
    ) {
        return chatService.sendCustomerMessage(sessionId, request);
    }
}