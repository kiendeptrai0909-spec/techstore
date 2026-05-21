package com.example.techstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "specification_keys",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_specification_key_category_name",
                        columnNames = {"category_id", "name"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mỗi danh mục có bộ thông số riêng
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Ví dụ: CPU, RAM, Độ phân giải, Tần số quét
    @Column(nullable = false, length = 100)
    private String name;

    // Ví dụ: Hz, inch, GB, W. Có thể null nếu không cần đơn vị
    @Column(length = 50)
    private String unit;

    // Thứ tự hiển thị trên giao diện
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}