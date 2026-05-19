package com.example.techstore.controller;

import com.example.techstore.dto.request.FaqRequest;
import com.example.techstore.dto.response.FaqResponse;
import com.example.techstore.service.FaqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/faqs")
@RequiredArgsConstructor
public class AdminFaqController {

    private final FaqService faqService;

    /*
     * Admin lấy danh sách FAQ.
     */
    @GetMapping
    public List<FaqResponse> getAllFaqs() {
        return faqService.getAllFaqs();
    }

    /*
     * Admin xem chi tiết FAQ.
     */
    @GetMapping("/{id}")
    public FaqResponse getFaqById(@PathVariable Long id) {
        return faqService.getFaqById(id);
    }

    /*
     * Admin tạo FAQ.
     */
    @PostMapping
    public FaqResponse createFaq(@Valid @RequestBody FaqRequest request) {
        return faqService.createFaq(request);
    }

    /*
     * Admin cập nhật FAQ.
     */
    @PutMapping("/{id}")
    public FaqResponse updateFaq(
            @PathVariable Long id,
            @Valid @RequestBody FaqRequest request
    ) {
        return faqService.updateFaq(id, request);
    }

    /*
     * Admin xóa mềm FAQ.
     */
    @DeleteMapping("/{id}")
    public void deleteFaq(@PathVariable Long id) {
        faqService.deleteFaq(id);
    }
}