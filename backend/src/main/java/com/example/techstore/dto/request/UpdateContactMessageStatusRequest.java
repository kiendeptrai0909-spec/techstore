package com.example.techstore.dto.request;

import com.example.techstore.enums.ContactStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateContactMessageStatusRequest {

    @NotNull(message = "Trạng thái liên hệ không được để trống")
    private ContactStatus status;
}