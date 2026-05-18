package com.example.techstore.repository;

import com.example.techstore.entity.Faq;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {

    List<Faq> findByStatusOrderBySortOrderAsc(ProductStatus status);
}