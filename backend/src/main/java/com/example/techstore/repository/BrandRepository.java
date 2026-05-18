package com.example.techstore.repository;

import com.example.techstore.entity.Brand;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    List<Brand> findByStatus(ProductStatus status);

    Optional<Brand> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);
}