package com.example.techstore.repository;

import com.example.techstore.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);// tìm tất cả sản phẩm trong giỏ hàng

    Optional<CartItem> findByCartIdAndProductVariantId(Long cartId, Long productVariantId);// tìm sản phẩm cụ thể trong giỏ hàng

    boolean existsByCartIdAndProductVariantId(Long cartId, Long productVariantId);//Kiểm tra sản phẩm đã tồn tại trong giỏ chưa

    void deleteByCartId(Long cartId);//xóa toàn bộ sản phẩm khỏi giỏ
}