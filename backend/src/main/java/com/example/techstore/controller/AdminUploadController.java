package com.example.techstore.controller;

import com.example.techstore.dto.response.ImageUploadResponse;
import com.example.techstore.service.CloudinaryUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/uploads")
@RequiredArgsConstructor
public class AdminUploadController {

    private final CloudinaryUploadService cloudinaryUploadService;

    @PostMapping("/image")
    public ImageUploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        return cloudinaryUploadService.uploadImage(file);
    }
}