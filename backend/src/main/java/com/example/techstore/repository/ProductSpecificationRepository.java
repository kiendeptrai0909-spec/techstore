package com.example.techstore.repository;

import com.example.techstore.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {

    List<ProductSpecification> findByProductId(Long productId);

    List<ProductSpecification> findByProductIdAndDeletedAtIsNull(Long productId);

    List<ProductSpecification> findByProductIdOrderBySpecificationKeySortOrderAsc(Long productId);

    List<ProductSpecification> findByProductIdAndDeletedAtIsNullOrderBySpecificationKeySortOrderAsc(
            Long productId
    );

    Optional<ProductSpecification> findByProductIdAndSpecificationKeyId(
            Long productId,
            Long specificationKeyId
    );

    Optional<ProductSpecification> findByProductIdAndSpecificationKeyIdAndDeletedAtIsNull(
            Long productId,
            Long specificationKeyId
    );

    @Transactional
    void deleteByProductId(Long productId);
}