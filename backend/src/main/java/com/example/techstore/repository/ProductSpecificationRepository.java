package com.example.techstore.repository;

import com.example.techstore.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {

    List<ProductSpecification> findByProductId(Long productId);

    Optional<ProductSpecification> findByProductIdAndSpecificationKeyId(
            Long productId,
            Long specificationKeyId
    );

    void deleteByProductId(Long productId);
}