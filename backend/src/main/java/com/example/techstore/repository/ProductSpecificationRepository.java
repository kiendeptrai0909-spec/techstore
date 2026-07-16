package com.example.techstore.repository;

import com.example.techstore.entity.ProductSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ProductSpecificationRepository extends JpaRepository<ProductSpecification, Long> {

    List<ProductSpecification> findByProductVariantId(Long productVariantId);

    List<ProductSpecification> findByProductVariantIdAndDeletedAtIsNull(Long productVariantId);

    List<ProductSpecification> findByProductVariantIdOrderBySpecificationKeySortOrderAsc(Long productVariantId);

    List<ProductSpecification> findByProductVariantIdAndDeletedAtIsNullOrderBySpecificationKeySortOrderAsc(
            Long productVariantId
    );

    Optional<ProductSpecification> findByProductVariantIdAndSpecificationKeyId(
            Long productVariantId,
            Long specificationKeyId
    );

    Optional<ProductSpecification> findByProductVariantIdAndSpecificationKeyIdAndDeletedAtIsNull(
            Long productVariantId,
            Long specificationKeyId
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    void deleteByProductVariantId(Long productVariantId);
}