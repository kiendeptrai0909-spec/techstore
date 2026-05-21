package com.example.techstore.repository;

import com.example.techstore.entity.SpecificationKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpecificationKeyRepository extends JpaRepository<SpecificationKey, Long> {

    List<SpecificationKey> findByCategoryIdOrderBySortOrderAsc(Long categoryId);

    List<SpecificationKey> findByCategoryIdAndDeletedAtIsNullOrderBySortOrderAsc(Long categoryId);

    Optional<SpecificationKey> findByCategoryIdAndNameIgnoreCase(Long categoryId, String name);

    Optional<SpecificationKey> findByCategoryIdAndNameIgnoreCaseAndDeletedAtIsNull(
            Long categoryId,
            String name
    );

    boolean existsByCategoryIdAndNameIgnoreCase(Long categoryId, String name);

    boolean existsByCategoryIdAndNameIgnoreCaseAndDeletedAtIsNull(Long categoryId, String name);
}