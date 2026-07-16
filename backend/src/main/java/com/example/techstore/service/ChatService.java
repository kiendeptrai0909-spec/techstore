package com.example.techstore.service;

import com.example.techstore.dto.request.ChatMessageRequest;
import com.example.techstore.dto.response.ChatMessageResponse;
import com.example.techstore.dto.response.ChatSessionResponse;
import com.example.techstore.entity.ChatMessage;
import com.example.techstore.entity.ChatSession;
import com.example.techstore.entity.User;
import com.example.techstore.enums.ChatStatus;
import com.example.techstore.enums.UserRole;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.ChatMessageRepository;
import com.example.techstore.repository.ChatSessionRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final AiChatService aiChatService;

    @Transactional
    public ChatSessionResponse createSession() {
        User customer = getCurrentUser();

        if (customer.getRole() != UserRole.ROLE_CUSTOMER) {
            throw new BadRequestException("Chỉ khách hàng mới có thể tạo phiên chat");
        }

        ChatSession session = ChatSession.builder()
                .customer(customer)
                .staff(null)
                .status(ChatStatus.OPEN)
                .build();

        ChatSession savedSession = chatSessionRepository.save(session);

        return toSessionResponse(savedSession);
    }

    @Transactional(readOnly = true)
    public Page<ChatSessionResponse> getMySessions(Pageable pageable) {
        User customer = getCurrentUser();

        return chatSessionRepository
                .findByCustomerIdOrderByIdDesc(customer.getId(), pageable)
                .map(this::toSessionResponse);
    }

    @Transactional(readOnly = true)
    public Page<ChatSessionResponse> getAdminSessions(
            ChatStatus status,
            Pageable pageable
    ) {
        if (status != null) {
            return chatSessionRepository
                    .findByStatusOrderByIdDesc(status, pageable)
                    .map(this::toSessionResponse);
        }

        return chatSessionRepository
                .findAllByOrderByIdDesc(pageable)
                .map(this::toSessionResponse);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getCustomerMessages(
            Long sessionId,
            Pageable pageable
    ) {
        User customer = getCurrentUser();

        chatSessionRepository.findByIdAndCustomerId(sessionId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat"));

        return chatMessageRepository
                .findBySessionIdOrderByCreatedAtAsc(sessionId, pageable)
                .map(this::toMessageResponse);
    }

    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getAdminMessages(
            Long sessionId,
            Pageable pageable
    ) {
        findSessionById(sessionId);

        return chatMessageRepository
                .findBySessionIdOrderByCreatedAtAsc(sessionId, pageable)
                .map(this::toMessageResponse);
    }

    @Transactional
    public ChatMessageResponse sendCustomerMessage(
            Long sessionId,
            ChatMessageRequest request
    ) {
        User customer = getCurrentUser();

        ChatSession session = chatSessionRepository
                .findByIdAndCustomerId(sessionId, customer.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat"));

        if (session.getStatus() == ChatStatus.CLOSED) {
            throw new BadRequestException("Phiên chat đã kết thúc");
        }

        ChatMessage message = ChatMessage.builder()
                .session(session)
                .sender(customer)
                .message(request.getMessage().trim())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Auto-reply logic via AI
        if (session.getStaff() == null) {
            java.util.List<ChatMessage> history = chatMessageRepository.findBySessionIdOrderByIdAsc(sessionId);
            String aiResponse = aiChatService.generateResponse(history);

            // Use system user as bot (or a specific AI user)
            // If no SYSTEM user exists, we can pass null as sender but with role SYSTEM (assuming we can)
            // Or create a dummy SYSTEM message. Here we will leave sender as null to represent SYSTEM bot
            
            ChatMessage botMessage = ChatMessage.builder()
                    .session(session)
                    .sender(null) // null represents the system bot
                    .message(aiResponse)
                    .build();

            chatMessageRepository.save(botMessage);
        }

        return toMessageResponse(savedMessage);
    }

    @Transactional
    public ChatSessionResponse assignSession(Long sessionId) {
        User staff = getCurrentUser();

        validateStaff(staff);

        ChatSession session = findSessionById(sessionId);

        if (session.getStatus() == ChatStatus.CLOSED) {
            throw new BadRequestException("Phiên chat đã kết thúc");
        }

        session.setStaff(staff);

        ChatSession savedSession = chatSessionRepository.save(session);

        return toSessionResponse(savedSession);
    }

    @Transactional
    public ChatMessageResponse sendStaffMessage(
            Long sessionId,
            ChatMessageRequest request
    ) {
        User staff = getCurrentUser();

        validateStaff(staff);

        ChatSession session = findSessionById(sessionId);

        if (session.getStatus() == ChatStatus.CLOSED) {
            throw new BadRequestException("Phiên chat đã kết thúc");
        }

        if (session.getStaff() == null) {
            session.setStaff(staff);
            chatSessionRepository.save(session);
        }

        ChatMessage message = ChatMessage.builder()
                .session(session)
                .sender(staff)
                .message(request.getMessage().trim())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        return toMessageResponse(savedMessage);
    }

    @Transactional
    public ChatSessionResponse closeSession(Long sessionId) {
        User staff = getCurrentUser();

        validateStaff(staff);

        ChatSession session = findSessionById(sessionId);

        session.setStatus(ChatStatus.CLOSED);
        session.setClosedAt(LocalDateTime.now());

        ChatSession savedSession = chatSessionRepository.save(session);

        return toSessionResponse(savedSession);
    }

    private ChatSession findSessionById(Long sessionId) {
        return chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat"));
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new BadRequestException("Bạn cần đăng nhập để sử dụng chat");
        }

        String email = authentication.getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
    }

    private void validateStaff(User user) {
        if (user.getRole() != UserRole.ROLE_ADMIN && user.getRole() != UserRole.ROLE_STAFF) {
            throw new BadRequestException("Bạn không có quyền xử lý chat");
        }
    }

    private ChatSessionResponse toSessionResponse(ChatSession session) {
        String lastMessage = chatMessageRepository
                .findTopBySessionIdOrderByIdDesc(session.getId())
                .map(ChatMessage::getMessage)
                .orElse(null);

        return ChatSessionResponse.builder()
                .id(session.getId())
                .customerId(session.getCustomer() != null ? session.getCustomer().getId() : null)
                .customerName(session.getCustomer() != null ? session.getCustomer().getFullName() : null)
                .staffId(session.getStaff() != null ? session.getStaff().getId() : null)
                .staffName(session.getStaff() != null ? session.getStaff().getFullName() : null)
                .status(session.getStatus())
                .lastMessage(lastMessage)
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .closedAt(session.getClosedAt())
                .build();
    }

    private ChatMessageResponse toMessageResponse(ChatMessage message) {
        User sender = message.getSender();

        return ChatMessageResponse.builder()
                .id(message.getId())
                .sessionId(message.getSession().getId())
                .senderId(sender != null ? sender.getId() : null)
                .senderName(sender != null ? sender.getFullName() : "TechStore AI")
                .senderRole(sender != null && sender.getRole() != null ? sender.getRole().name() : "ROLE_BOT")
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
    @Transactional
    public void deleteSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat"));

        chatMessageRepository.deleteBySessionId(sessionId);
        chatSessionRepository.delete(session);
    }
}