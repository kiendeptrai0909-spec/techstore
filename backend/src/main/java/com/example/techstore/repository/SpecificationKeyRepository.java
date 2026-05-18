package com.example.techstore.repository;

import com.example.techstore.entity.SpecificationKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpecificationKeyRepository extends JpaRepository<SpecificationKey, Long> {

    List<SpecificationKey> findByCategoryIdOrderBySortOrderAsc(Long categoryId);

    boolean existsByCategoryIdAndNameIgnoreCase(Long categoryId, String name);
}