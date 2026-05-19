package com.example.techstore.service;

import com.example.techstore.dto.request.FaqRequest;
import com.example.techstore.dto.response.FaqResponse;
import com.example.techstore.entity.Faq;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService {

    private final FaqRepository faqRepository;

    /*
     * Public: lấy danh sách FAQ đang hoạt động.
     */
    @Transactional(readOnly = true)
    public List<FaqResponse> getActiveFaqs() {
        return faqRepository.findByStatusOrderBySortOrderAsc(ProductStatus.ACTIVE)
                .stream()
                .filter(faq -> faq.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    /*
     * Admin: lấy tất cả FAQ chưa bị xóa mềm.
     */
    @Transactional(readOnly = true)
    public List<FaqResponse> getAllFaqs() {
        return faqRepository.findAll()
                .stream()
                .filter(faq -> faq.getDeletedAt() == null)
                .map(this::toResponse)
                .toList();
    }

    /*
     * Admin: xem chi tiết FAQ.
     */
    @Transactional(readOnly = true)
    public FaqResponse getFaqById(Long id) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy FAQ"));

        if (faq.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy FAQ");
        }

        return toResponse(faq);
    }

    /*
     * Admin: tạo FAQ.
     */
    @Transactional
    public FaqResponse createFaq(FaqRequest request) {
        Faq faq = Faq.builder()
                .question(request.getQuestion().trim())
                .answer(request.getAnswer().trim())
                .sortOrder(request.getSortOrder())
                .status(request.getStatus())
                .build();

        Faq savedFaq = faqRepository.save(faq);

        return toResponse(savedFaq);
    }

    /*
     * Admin: cập nhật FAQ.
     */
    @Transactional
    public FaqResponse updateFaq(Long id, FaqRequest request) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy FAQ"));

        if (faq.getDeletedAt() != null) {
            throw new ResourceNotFoundException("Không tìm thấy FAQ");
        }

        faq.setQuestion(request.getQuestion().trim());
        faq.setAnswer(request.getAnswer().trim());
        faq.setSortOrder(request.getSortOrder());
        faq.setStatus(request.getStatus());

        if (request.getStatus() == ProductStatus.ACTIVE) {
            faq.setDeletedAt(null);
        }

        Faq savedFaq = faqRepository.save(faq);

        return toResponse(savedFaq);
    }

    /*
     * Admin: xóa mềm FAQ.
     */
    @Transactional
    public void deleteFaq(Long id) {
        Faq faq = faqRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy FAQ"));

        faq.setStatus(ProductStatus.INACTIVE);
        faq.setDeletedAt(LocalDateTime.now());

        faqRepository.save(faq);
    }

    private FaqResponse toResponse(Faq faq) {
        return FaqResponse.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .sortOrder(faq.getSortOrder())
                .status(faq.getStatus())
                .createdAt(faq.getCreatedAt())
                .updatedAt(faq.getUpdatedAt())
                .build();
    }
}