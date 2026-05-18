package com.example.techstore.repository;

import com.example.techstore.entity.Banner;
import com.example.techstore.enums.BannerPosition;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {

    List<Banner> findByStatusOrderBySortOrderAsc(ProductStatus status);

    List<Banner> findByPositionAndStatusOrderBySortOrderAsc(
            BannerPosition position,
            ProductStatus status
    );
}