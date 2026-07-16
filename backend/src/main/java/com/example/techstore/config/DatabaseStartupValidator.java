package com.example.techstore.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseStartupValidator {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationEvent() {
        try {
            log.info("Executing database alter script for chat_messages...");
            jdbcTemplate.execute("ALTER TABLE chat_messages ALTER COLUMN sender_id DROP NOT NULL;");
            log.info("Successfully dropped NOT NULL constraint on sender_id");
        } catch (Exception e) {
            log.error("Failed to alter table chat_messages: ", e.getMessage());
        }
    }
}
