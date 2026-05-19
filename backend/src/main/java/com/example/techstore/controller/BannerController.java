package com.example.techstore.controller;

import com.example.techstore.dto.response.BannerResponse;
import com.example.techstore.enums.BannerPosition;
import com.example.techstore.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public List<BannerResponse> getActiveBanners(
            @RequestParam(required = false) BannerPosition position
    ) {
        return bannerService.getActiveBanners(position);
    }
}