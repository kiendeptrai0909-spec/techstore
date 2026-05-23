package com.example.techstore.repository;

import com.example.techstore.entity.Category;
import com.example.techstore.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    Page<Category> findByDeletedAtIsNull(Pageable pageable);

    Page<Category> findByStatusAndDeletedAtIsNull(ProductStatus status, Pageable pageable);
    List<Category> findByStatusOrderBySortOrderAsc(ProductStatus status);
    @Query("""
            select c
            from Category c
            where c.deletedAt is null
              and (:keyword = ''
                   or lower(c.name) like concat('%', :keyword, '%')
                   or lower(c.slug) like concat('%', :keyword, '%')
                   or lower(c.description) like concat('%', :keyword, '%'))
              and (:status is null or c.status = :status)
            order by c.sortOrder asc, c.id desc
            """)
    Page<Category> searchAdminCategories(
            @Param("keyword") String keyword,
            @Param("status") ProductStatus status,
            Pageable pageable
    );
}