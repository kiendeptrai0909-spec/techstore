package com.example.techstore.dto.request;

import com.example.techstore.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerStatusRequest {

    @NotNull(message = "Trạng thái không được để trống")
    private UserStatus status;
}