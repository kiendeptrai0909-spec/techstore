package com.example.techstore.exception;

import com.example.techstore.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleBadRequestException(
            BadRequestException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleResourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi validation từ @Valid trong request body.
     * Ví dụ: thiếu email, password rỗng, rating không nằm trong 1-5.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidationException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        Map<String, String> errors = new LinkedHashMap<>();

        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Dữ liệu không hợp lệ",
                request.getRequestURI(),
                errors
        );
    }

    /*
     * Bắt lỗi validate ở @RequestParam, @PathVariable nếu có.
     */
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleConstraintViolationException(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi thiếu request param.
     * Ví dụ thiếu code trong /coupons/validate?subtotalAmount=...
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMissingServletRequestParameterException(
            MissingServletRequestParameterException exception,
            HttpServletRequest request
    ) {
        String message = "Thiếu tham số bắt buộc: " + exception.getParameterName();

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi sai kiểu dữ liệu.
     * Ví dụ: /products/abc trong khi id cần Long.
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException exception,
            HttpServletRequest request
    ) {
        String message = "Tham số không hợp lệ: " + exception.getName();

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                message,
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi JSON sai format hoặc enum sai.
     * Ví dụ paymentMethod = "BANK" nhưng enum không có BANK.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleHttpMessageNotReadableException(
            HttpMessageNotReadableException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Request body không hợp lệ hoặc sai định dạng JSON",
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi trùng unique trong database.
     * Ví dụ slug, sku, email bị trùng nhưng service chưa chặn hết.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleDataIntegrityViolationException(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "Dữ liệu bị trùng hoặc vi phạm ràng buộc cơ sở dữ liệu",
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi sai HTTP method.
     * Ví dụ API yêu cầu POST nhưng gửi GET.
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorResponse handleMethodNotSupportedException(
            HttpRequestMethodNotSupportedException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.METHOD_NOT_ALLOWED,
                "Phương thức HTTP không được hỗ trợ",
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi không có quyền.
     * Một số lỗi AccessDenied có thể đi qua ControllerAdvice.
     * Lỗi từ Spring Security filter chain sẽ xử lý thêm trong SecurityConfig.
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse handleAccessDeniedException(
            AccessDeniedException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "Bạn không có quyền truy cập tài nguyên này",
                request.getRequestURI(),
                null
        );
    }

    /*
     * Bắt lỗi không tìm thấy endpoint nếu cấu hình spring.mvc.throw-exception-if-no-handler-found=true.
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNoHandlerFoundException(
            NoHandlerFoundException exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "Không tìm thấy API",
                request.getRequestURI(),
                null
        );
    }

    /*
     * Lỗi cuối cùng, tránh lộ stack trace ra client.
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleGeneralException(
            Exception exception,
            HttpServletRequest request
    ) {
        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Lỗi hệ thống, vui lòng thử lại sau",
                request.getRequestURI(),
                null
        );
    }

    private ErrorResponse buildErrorResponse(
            HttpStatus status,
            String message,
            String path,
            Map<String, String> errors
    ) {
        return ErrorResponse.builder()
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now())
                .errors(errors)
                .build();
    }
}