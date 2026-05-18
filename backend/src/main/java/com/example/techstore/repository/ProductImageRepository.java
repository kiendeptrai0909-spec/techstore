package com.example.techstore.repository;

import com.example.techstore.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductIdOrderBySortOrderAsc(Long productId);

    List<ProductImage> findByVariantIdOrderBySortOrderAsc(Long variantId);
}