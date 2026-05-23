package com.example.techstore.dto.response;

import com.example.techstore.enums.ChatStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ChatSessionResponse {

    private Long id;

    private Long customerId;

    private String customerName;

    private Long staffId;

    private String staffName;

    private ChatStatus status;

    private String lastMessage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime closedAt;
}