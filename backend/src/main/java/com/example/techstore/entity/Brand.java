package com.example.techstore.entity;

import com.example.techstore.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Tên thương hiệu, ví dụ: Apple, Samsung, Dell, Asus.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /*
     * Slug dùng cho URL, ví dụ: apple, samsung, dell.
     */
    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    /*
     * Logo thương hiệu.
     */
    @Column(name = "logo_url", columnDefinition = "TEXT")
    private String logoUrl;

    /*
     * Mô tả thương hiệu.
     */
    @Column(columnDefinition = "TEXT")
    private String description;

    /*
     * ACTIVE: đang hiển thị
     * INACTIVE: đã ẩn
     */
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status = ProductStatus.ACTIVE;

    /*
     * created_at, updated_at do database tự tạo.
     */
    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    /*
     * Dùng cho xóa mềm.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}