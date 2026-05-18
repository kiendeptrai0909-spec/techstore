package com.example.techstore.repository;

import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

    List<ProductVariant> findByProductId(Long productId);

    List<ProductVariant> findByProductIdAndStatus(Long productId, ProductStatus status);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);
}