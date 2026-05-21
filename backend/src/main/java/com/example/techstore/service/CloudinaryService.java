package com.example.techstore.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.techstore.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) {
        validateImage(file);

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image",
                            "public_id", UUID.randomUUID().toString(),
                            "overwrite", true
                    )
            );

            Object secureUrl = result.get("secure_url");

            if (secureUrl == null) {
                throw new BadRequestException("Không lấy được URL ảnh từ Cloudinary");
            }

            return secureUrl.toString();
        } catch (IOException e) {
            throw new BadRequestException("Không thể upload ảnh lên Cloudinary");
        }
    }

    public String uploadUserAvatar(MultipartFile file, Long userId) {
        validateImage(file);

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "techstore/users/avatars",
                            "resource_type", "image",
                            "public_id", "user-" + userId,
                            "overwrite", true,
                            "invalidate", true
                    )
            );

            Object secureUrl = result.get("secure_url");

            if (secureUrl == null) {
                throw new BadRequestException("Không lấy được URL avatar từ Cloudinary");
            }

            return secureUrl.toString();
        } catch (IOException e) {
            throw new BadRequestException("Không thể upload avatar lên Cloudinary");
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn ảnh");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new BadRequestException("Ảnh không được vượt quá 5MB");
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP");
        }
    }
}