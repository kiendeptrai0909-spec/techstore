package com.example.techstore.controller;

import com.example.techstore.dto.response.BrandResponse;
import com.example.techstore.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brands")
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @GetMapping
    public List<BrandResponse> getBrands(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return brandService.getActiveBrandsByCategory(categoryId);
        }
        return brandService.getActiveBrands();
    }
}