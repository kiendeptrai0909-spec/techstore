package com.example.techstore.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;

    private String error;

    private String message;

    private String path;

    private LocalDateTime timestamp;

    /*
     * Dùng cho lỗi validation @Valid.
     * Ví dụ:
     * {
     *   "email": "Email không hợp lệ",
     *   "password": "Mật khẩu không được để trống"
     * }
     */
    private Map<String, String> errors;
}