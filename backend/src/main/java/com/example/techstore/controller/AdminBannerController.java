package com.example.techstore.controller;

import com.example.techstore.dto.request.BannerRequest;
import com.example.techstore.dto.response.BannerResponse;
import com.example.techstore.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/banners")
@RequiredArgsConstructor
public class AdminBannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<BannerResponse> getAllBanners() {
        return bannerService.getAllBanners();
    }

    @GetMapping("/{id}")
    public BannerResponse getBannerById(@PathVariable Long id) {
        return bannerService.getBannerById(id);
    }

    @PostMapping
    public BannerResponse createBanner(@Valid @RequestBody BannerRequest request) {
        return bannerService.createBanner(request);
    }

    @PutMapping("/{id}")
    public BannerResponse updateBanner(
            @PathVariable Long id,
            @Valid @RequestBody BannerRequest request
    ) {
        return bannerService.updateBanner(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerService.deleteBanner(id);
    }
}