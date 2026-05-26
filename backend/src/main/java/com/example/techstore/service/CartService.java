package com.example.techstore.service;

import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.dto.request.UpdateCartItemRequest;
import com.example.techstore.dto.response.CartItemResponse;
import com.example.techstore.dto.response.CartResponse;
import com.example.techstore.entity.Cart;
import com.example.techstore.entity.CartItem;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.entity.User;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.exception.BadRequestException;
import com.example.techstore.exception.ResourceNotFoundException;
import com.example.techstore.repository.CartItemRepository;
import com.example.techstore.repository.CartRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCurrentUserCart() {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> Cart.builder()
                        .user(user)
                        .build());

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .build()
                ));

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy biến thể sản phẩm"));

        validateProductVariantCanBuy(variant);

        int quantityToAdd = request.getQuantity();

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductVariantId(cart.getId(), variant.getId())
                .orElse(null);

        if (cartItem != null) {
            int newQuantity = cartItem.getQuantity() + quantityToAdd;

            if (newQuantity > variant.getStock()) {
                throw new BadRequestException("Số lượng vượt quá tồn kho");
            }

            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        } else {
            if (quantityToAdd > variant.getStock()) {
                throw new BadRequestException("Số lượng vượt quá tồn kho");
            }

            cartItem = CartItem.builder()
                    .cart(cart)
                    .productVariant(variant)
                    .quantity(quantityToAdd)
                    .build();

            cartItemRepository.save(cartItem);
        }

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Bạn không có quyền cập nhật sản phẩm này");
        }

        ProductVariant variant = cartItem.getProductVariant();

        validateProductVariantCanBuy(variant);

        if (request.getQuantity() > variant.getStock()) {
            throw new BadRequestException("Số lượng vượt quá tồn kho");
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeCartItem(Long cartItemId) {
        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa sản phẩm này");
        }

        cartItemRepository.delete(cartItem);

        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse clearCart() {
        User user = getCurrentUser();

        Cart cart = getOrCreateCart(user);

        cartItemRepository.deleteByCartId(cart.getId());

        return toCartResponse(cart);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .build()
                ));
    }

    private void validateProductVariantCanBuy(ProductVariant variant) {
        if (variant.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Biến thể sản phẩm hiện không hoạt động");
        }

        if (variant.getProduct().getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Sản phẩm hiện không hoạt động");
        }

        if (variant.getStock() <= 0) {
            throw new BadRequestException("Sản phẩm đã hết hàng");
        }
    }

    private CartResponse toCartResponse(Cart cart) {
        if (cart.getId() == null) {
            return CartResponse.builder()
                    .cartId(null)
                    .items(List.of())
                    .totalItems(0)
                    .totalAmount(BigDecimal.ZERO)
                    .build();
        }

        List<CartItemResponse> items = cartItemRepository.findByCartId(cart.getId())
                .stream()
                .map(this::toCartItemResponse)
                .toList();

        int totalItems = items.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalItems(totalItems)
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemResponse toCartItemResponse(CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        Product product = variant.getProduct();

        BigDecimal finalPrice = getFinalPrice(variant);
        BigDecimal totalPrice = finalPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
        boolean available = true;
        String unavailableReason = null;

        if (product.getStatus() != ProductStatus.ACTIVE || product.getDeletedAt() != null) {
            available = false;
            unavailableReason = "Sản phẩm đã ngừng bán";
        } else if (variant.getStatus() != ProductStatus.ACTIVE || variant.getDeletedAt() != null) {
            available = false;
            unavailableReason = "Phiên bản sản phẩm đã ngừng bán";
        } else if (variant.getStock() < cartItem.getQuantity()) {
            available = false;
            unavailableReason = "Sản phẩm không đủ tồn kho";
        }
        return CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .productId(product.getId())
                .productSlug(product.getSlug())
                .productName(product.getName())
                .productVariantId(variant.getId())
                .variantName(variant.getName())
                .sku(variant.getSku())
                .thumbnailUrl(variant.getThumbnailUrl())
                .price(variant.getPrice())
                .salePrice(variant.getSalePrice())
                .finalPrice(finalPrice)
                .quantity(cartItem.getQuantity())
                .totalPrice(totalPrice)
                .productStatus(product.getStatus())
                .variantStatus(variant.getStatus())
                .available(available)
                .unavailableReason(unavailableReason)
                .stock(variant.getStock())
                .build();
    }

    private BigDecimal getFinalPrice(ProductVariant variant) {
        if (variant.getSalePrice() != null) {
            return variant.getSalePrice();
        }

        return variant.getPrice();
    }
}