package com.example.techstore.service;

import com.example.techstore.entity.Order;
import com.example.techstore.entity.OrderItem;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.repository.OrderItemRepository;
import com.example.techstore.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderInventoryService {

    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;

    public void restoreStock(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());

        for (OrderItem item : items) {
            ProductVariant variant = item.getProductVariant();

            variant.setStock(variant.getStock() + item.getQuantity());

            productVariantRepository.save(variant);
        }
    }
}