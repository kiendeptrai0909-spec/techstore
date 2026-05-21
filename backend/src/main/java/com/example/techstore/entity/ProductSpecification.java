package com.example.techstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "product_specifications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_product_specification_key",
                        columnNames = {"product_id", "specification_key_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSpecification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sản phẩm được gán thông số
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Tên thông số, ví dụ: RAM, CPU, SSD, Độ phân giải
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specification_key_id", nullable = false)
    private SpecificationKey specificationKey;

    // Giá trị thông số, ví dụ: 16GB DDR5, Intel Core i5, 4K/UHD
    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}