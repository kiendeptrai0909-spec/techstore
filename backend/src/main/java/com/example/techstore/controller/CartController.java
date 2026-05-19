package com.example.techstore.controller;

import com.example.techstore.dto.request.AddToCartRequest;
import com.example.techstore.dto.request.UpdateCartItemRequest;
import com.example.techstore.dto.response.CartResponse;
import com.example.techstore.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCurrentUserCart() {
        return cartService.getCurrentUserCart();
    }

    @PostMapping("/items")
    public CartResponse addToCart(@Valid @RequestBody AddToCartRequest request) {
        return cartService.addToCart(request);
    }

    @PutMapping("/items/{cartItemId}")
    public CartResponse updateCartItem(
            @PathVariable Long cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        return cartService.updateCartItem(cartItemId, request);
    }

    @DeleteMapping("/items/{cartItemId}")
    public CartResponse removeCartItem(@PathVariable Long cartItemId) {
        return cartService.removeCartItem(cartItemId);
    }

    @DeleteMapping
    public CartResponse clearCart() {
        return cartService.clearCart();
    }
}