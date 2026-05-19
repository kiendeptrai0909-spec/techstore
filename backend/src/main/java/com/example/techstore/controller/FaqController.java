package com.example.techstore.controller;

import com.example.techstore.dto.response.FaqResponse;
import com.example.techstore.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faqs")
@RequiredArgsConstructor
public class FaqController {

    private final FaqService faqService;

    /*
     * Public API: khách hàng xem FAQ.
     *
     * GET /api/v1/faqs
     */
    @GetMapping
    public List<FaqResponse> getActiveFaqs() {
        return faqService.getActiveFaqs();
    }
}