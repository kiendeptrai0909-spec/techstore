package com.example.techstore.service;

import com.example.techstore.dto.request.BannerRequest;
import com.example.techstore.dto.response.BannerResponse;
import com.example.techstore.entity.Banner;
import com.example.techstore.enums.BannerPosition;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional(readOnly = true)
    public List<BannerResponse> getActiveBanners(BannerPosition position) {
        List<Banner> banners;

        if (position != null) {
            banners = bannerRepository.findByPositionAndStatusOrderBySortOrderAsc(
                    position,
                    ProductStatus.ACTIVE
            );
        } else {
            banners = bannerRepository.findByStatusOrderBySortOrderAsc(ProductStatus.ACTIVE);
        }

        LocalDateTime now = LocalDateTime.now();

        return banners.stream()
                .filter(banner -> banner.getDeletedAt() == null)
                .filter(banner -> isInDisplayTime(banner, now))
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAll()
                .stream()
                .filter(banner -> banner.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BannerResponse getBannerById(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner"));

        if (banner.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy banner");
        }

        return toResponse(banner);
    }

    @Transactional
    public BannerResponse createBanner(BannerRequest request) {
        validateBannerRequest(request);

        Banner banner = Banner.builder()
                .title(request.getTitle().trim())
                .imageUrl(request.getImageUrl())
                .linkUrl(request.getLinkUrl())
                .position(request.getPosition())
                .sortOrder(request.getSortOrder())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .status(request.getStatus())
                .build();

        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse updateBanner(Long id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner"));

        if (banner.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy banner");
        }

        LocalDateTime now = LocalDateTime.now();
        boolean hasStarted = banner.getStartAt() != null && banner.getStartAt().isBefore(now);

        if (hasStarted) {
            if (request.getStartAt() != null && !request.getStartAt().isEqual(banner.getStartAt())) {
                throw new BadRequestException("Không thể sửa ngày bắt đầu của banner đã diễn ra");
            }
        } else {
            if (request.getStartAt() != null && request.getStartAt().isBefore(now)) {
                throw new BadRequestException("Thời gian bắt đầu không được ở quá khứ");
            }
        }

        // Validate other request attributes
        validateBannerRequestExceptStartAtPast(request);

        banner.setTitle(request.getTitle().trim());
        banner.setImageUrl(request.getImageUrl());
        banner.setLinkUrl(request.getLinkUrl());
        banner.setPosition(request.getPosition());
        banner.setSortOrder(request.getSortOrder());
        banner.setStartAt(request.getStartAt());
        banner.setEndAt(request.getEndAt());
        banner.setStatus(request.getStatus());

        if (request.getStatus() == ProductStatus.ACTIVE) {
            banner.setDeletedAt(null);
        }

        return toResponse(bannerRepository.save(banner));
    }

    @Transactional
    public void deleteBanner(Long id) {
        Banner banner = bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy banner"));

        banner.setStatus(ProductStatus.INACTIVE);
        banner.setDeletedAt(LocalDateTime.now());

        bannerRepository.save(banner);
    }

    private void validateBannerRequest(BannerRequest request) {
        validateBannerRequestExceptStartAtPast(request);

        if (request.getStartAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Thời gian bắt đầu không được ở quá khứ");
        }
    }

    private void validateBannerRequestExceptStartAtPast(BannerRequest request) {
        if (request.getStartAt() == null) {
            throw new BadRequestException("Thời gian bắt đầu không được để trống");
        }

        if (request.getEndAt() == null) {
            throw new BadRequestException("Thời gian kết thúc không được để trống");
        }

        if (!request.getEndAt().isAfter(request.getStartAt())) {
            throw new BadRequestException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }
    }

    private boolean isInDisplayTime(Banner banner, LocalDateTime now) {
        if (banner.getStartAt() != null && now.isBefore(banner.getStartAt())) {
            return false;
        }

        if (banner.getEndAt() != null && now.isAfter(banner.getEndAt())) {
            return false;
        }

        return true;
    }

    private BannerResponse toResponse(Banner banner) {
        return BannerResponse.builder()
                .id(banner.getId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .position(banner.getPosition())
                .sortOrder(banner.getSortOrder())
                .startAt(banner.getStartAt())
                .endAt(banner.getEndAt())
                .status(banner.getStatus())
                .createdAt(banner.getCreatedAt())
                .updatedAt(banner.getUpdatedAt())
                .build();
    }
}