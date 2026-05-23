package com.example.techstore.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatMessageResponse {

    private Long id;

    private Long sessionId;

    private Long senderId;

    private String senderName;

    private String senderRole;

    private String message;

    private LocalDateTime createdAt;
}