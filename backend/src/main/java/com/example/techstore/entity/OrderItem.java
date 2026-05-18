package com.example.techstore.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Dòng sản phẩm này thuộc đơn hàng nào.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /*
     * Sản phẩm gốc.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    /*
     * Biến thể sản phẩm được mua.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant productVariant;

    /*
     * Snapshot tên sản phẩm tại thời điểm mua.
     */
    @Column(name = "product_name", nullable = false, length = 200)
    private String productName;

    /*
     * Snapshot tên biến thể tại thời điểm mua.
     */
    @Column(name = "variant_name", nullable = false, length = 150)
    private String variantName;

    /*
     * Snapshot SKU tại thời điểm mua.
     */
    @Column(name = "product_sku", length = 100)
    private String productSku;

    /*
     * Giá tại thời điểm mua.
     */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    /*
     * Thành tiền = price * quantity.
     */
    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}