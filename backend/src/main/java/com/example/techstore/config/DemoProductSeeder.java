package com.example.techstore.config;

import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductImage;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.BrandRepository;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductImageRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(3)
public class DemoProductSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Override
    public void run(String... args) {
        seedProducts();
    }

    private void seedProducts() {
        Product asusTuf = createProductIfNotExists(
                "Laptop ASUS TUF Gaming F15",
                "laptop-asus-tuf-gaming-f15",
                "Laptop gaming ASUS TUF Gaming F15 hiệu năng mạnh mẽ, phù hợp chơi game, học tập và làm việc đồ họa.",
                "laptop-gaming",
                "asus",
                true
        );

        createVariantIfNotExists(
                asusTuf,
                "Intel Core i5 / 16GB RAM / 512GB SSD / RTX 4050",
                "ASUS-TUF-F15-I5-16-512-RTX4050",
                "22990000",
                "19990000",
                20,
                "https://product.hstatic.net/200000722513/product/asus_tuf_gaming_f15_fx507_gearvn_1_abc.jpg"
        );

        createVariantIfNotExists(
                asusTuf,
                "Intel Core i7 / 16GB RAM / 1TB SSD / RTX 4060",
                "ASUS-TUF-F15-I7-16-1TB-RTX4060",
                "29990000",
                "26990000",
                12,
                "https://product.hstatic.net/200000722513/product/asus_tuf_gaming_f15_fx507_gearvn_2_abc.jpg"
        );

        seedProductImages(asusTuf, List.of(
                "https://placehold.co/900x700/0f172a/ffffff?text=ASUS+TUF+Gaming+F15",
                "https://placehold.co/900x700/1e293b/ffffff?text=RTX+Gaming+Laptop",
                "https://placehold.co/900x700/334155/ffffff?text=ASUS+TUF+Detail"
        ));

        Product lenovoLoq = createProductIfNotExists(
                "Laptop Lenovo LOQ 15",
                "laptop-lenovo-loq-15",
                "Lenovo LOQ 15 là mẫu laptop gaming phổ thông, thiết kế chắc chắn, cấu hình mạnh trong tầm giá.",
                "laptop-gaming",
                "lenovo",
                true
        );

        createVariantIfNotExists(
                lenovoLoq,
                "Intel Core i5 / 16GB RAM / 512GB SSD / RTX 4050",
                "LENOVO-LOQ15-I5-16-512-RTX4050",
                "23990000",
                "21490000",
                18,
                "https://placehold.co/600x600/111827/ffffff?text=Lenovo+LOQ+15"
        );

        seedProductImages(lenovoLoq, List.of(
                "https://placehold.co/900x700/111827/ffffff?text=Lenovo+LOQ+15",
                "https://placehold.co/900x700/1f2937/ffffff?text=Lenovo+Gaming",
                "https://placehold.co/900x700/374151/ffffff?text=Lenovo+LOQ+Detail"
        ));

        Product acerNitro = createProductIfNotExists(
                "Laptop Acer Nitro V",
                "laptop-acer-nitro-v",
                "Acer Nitro V sở hữu thiết kế gaming, màn hình tần số quét cao và hiệu năng ổn định.",
                "laptop-gaming",
                "acer",
                true
        );

        createVariantIfNotExists(
                acerNitro,
                "Intel Core i5 / 16GB RAM / 512GB SSD / RTX 3050",
                "ACER-NITRO-V-I5-16-512-RTX3050",
                "20990000",
                "18490000",
                16,
                "https://placehold.co/600x600/0f172a/ffffff?text=Acer+Nitro+V"
        );

        seedProductImages(acerNitro, List.of(
                "https://placehold.co/900x700/0f172a/ffffff?text=Acer+Nitro+V",
                "https://placehold.co/900x700/1e293b/ffffff?text=Acer+Gaming+Laptop"
        ));

        Product macbookAir = createProductIfNotExists(
                "MacBook Air M2 13 inch",
                "macbook-air-m2-13-inch",
                "MacBook Air M2 thiết kế mỏng nhẹ, hiệu năng cao, pin lâu, phù hợp học tập và làm việc văn phòng.",
                "laptop",
                "apple",
                true
        );

        createVariantIfNotExists(
                macbookAir,
                "Apple M2 / 8GB RAM / 256GB SSD",
                "MACBOOK-AIR-M2-8-256",
                "24990000",
                "21990000",
                10,
                "https://placehold.co/600x600/f8fafc/111827?text=MacBook+Air+M2"
        );

        createVariantIfNotExists(
                macbookAir,
                "Apple M2 / 8GB RAM / 512GB SSD",
                "MACBOOK-AIR-M2-8-512",
                "29990000",
                "26990000",
                8,
                "https://placehold.co/600x600/f8fafc/111827?text=MacBook+M2+512GB"
        );

        seedProductImages(macbookAir, List.of(
                "https://placehold.co/900x700/f8fafc/111827?text=MacBook+Air+M2",
                "https://placehold.co/900x700/e5e7eb/111827?text=Apple+Laptop"
        ));

        Product dellInspiron = createProductIfNotExists(
                "Laptop Dell Inspiron 15",
                "laptop-dell-inspiron-15",
                "Dell Inspiron 15 phù hợp học tập, văn phòng, giải trí nhẹ với thiết kế bền bỉ.",
                "laptop",
                "dell",
                false
        );

        createVariantIfNotExists(
                dellInspiron,
                "Intel Core i5 / 16GB RAM / 512GB SSD",
                "DELL-INSPIRON-15-I5-16-512",
                "16990000",
                "14990000",
                22,
                "https://placehold.co/600x600/e5e7eb/111827?text=Dell+Inspiron+15"
        );

        seedProductImages(dellInspiron, List.of(
                "https://placehold.co/900x700/e5e7eb/111827?text=Dell+Inspiron+15",
                "https://placehold.co/900x700/d1d5db/111827?text=Dell+Laptop"
        ));

        Product pc4060 = createProductIfNotExists(
                "PC Gaming RTX 4060",
                "pc-gaming-rtx-4060",
                "Bộ PC Gaming RTX 4060 cân tốt game eSports, AAA Full HD, phù hợp gaming và livestream.",
                "pc-gaming",
                "asus",
                true
        );

        createVariantIfNotExists(
                pc4060,
                "Core i5 / 16GB RAM / 512GB SSD / RTX 4060",
                "PC-GAMING-I5-16-512-RTX4060",
                "23990000",
                "21990000",
                9,
                "https://placehold.co/600x600/020617/ffffff?text=PC+RTX+4060"
        );

        seedProductImages(pc4060, List.of(
                "https://placehold.co/900x700/020617/ffffff?text=PC+Gaming+RTX+4060",
                "https://placehold.co/900x700/111827/ffffff?text=Gaming+PC+RGB"
        ));

        Product pc4070 = createProductIfNotExists(
                "PC Gaming RTX 4070",
                "pc-gaming-rtx-4070",
                "Bộ PC Gaming RTX 4070 hiệu năng cao, phù hợp gaming 2K, đồ họa và dựng video.",
                "pc-gaming",
                "gigabyte",
                true
        );

        createVariantIfNotExists(
                pc4070,
                "Core i7 / 32GB RAM / 1TB SSD / RTX 4070",
                "PC-GAMING-I7-32-1TB-RTX4070",
                "38990000",
                "35990000",
                6,
                "https://placehold.co/600x600/111827/ffffff?text=PC+RTX+4070"
        );

        seedProductImages(pc4070, List.of(
                "https://placehold.co/900x700/111827/ffffff?text=PC+Gaming+RTX+4070",
                "https://placehold.co/900x700/1f2937/ffffff?text=High+End+Gaming+PC"
        ));

        Product lgMonitor = createProductIfNotExists(
                "Màn hình LG UltraGear 27 inch 144Hz",
                "man-hinh-lg-ultragear-27-inch-144hz",
                "Màn hình gaming LG UltraGear 27 inch, tần số quét 144Hz, màu sắc đẹp, phản hồi nhanh.",
                "man-hinh",
                "lg",
                true
        );

        createVariantIfNotExists(
                lgMonitor,
                "27 inch / Full HD / 144Hz",
                "LG-ULTRAGEAR-27-FHD-144HZ",
                "5990000",
                "4990000",
                25,
                "https://placehold.co/600x600/0f172a/ffffff?text=LG+UltraGear+27"
        );

        seedProductImages(lgMonitor, List.of(
                "https://placehold.co/900x700/0f172a/ffffff?text=LG+UltraGear+27",
                "https://placehold.co/900x700/1e293b/ffffff?text=Gaming+Monitor"
        ));

        Product samsungMonitor = createProductIfNotExists(
                "Màn hình Samsung Odyssey G5",
                "man-hinh-samsung-odyssey-g5",
                "Samsung Odyssey G5 màn hình cong gaming, tần số quét cao, trải nghiệm hình ảnh sống động.",
                "man-hinh",
                "samsung",
                false
        );

        createVariantIfNotExists(
                samsungMonitor,
                "27 inch / QHD / 165Hz",
                "SAMSUNG-ODYSSEY-G5-27-QHD-165HZ",
                "7990000",
                "6990000",
                14,
                "https://placehold.co/600x600/111827/ffffff?text=Samsung+Odyssey+G5"
        );

        seedProductImages(samsungMonitor, List.of(
                "https://placehold.co/900x700/111827/ffffff?text=Samsung+Odyssey+G5",
                "https://placehold.co/900x700/1f2937/ffffff?text=Curved+Gaming+Monitor"
        ));

        Product logitechMouse = createProductIfNotExists(
                "Chuột Logitech G Pro X Superlight",
                "chuot-logitech-g-pro-x-superlight",
                "Chuột gaming không dây siêu nhẹ Logitech G Pro X Superlight, cảm biến chính xác cao.",
                "chuot",
                "logitech",
                true
        );

        createVariantIfNotExists(
                logitechMouse,
                "Wireless / Black",
                "LOGITECH-GPRO-X-SUPERLIGHT-BLACK",
                "3490000",
                "2990000",
                30,
                "https://placehold.co/600x600/f8fafc/111827?text=Logitech+G+Pro+X"
        );

        createVariantIfNotExists(
                logitechMouse,
                "Wireless / White",
                "LOGITECH-GPRO-X-SUPERLIGHT-WHITE",
                "3490000",
                "2990000",
                20,
                "https://placehold.co/600x600/ffffff/111827?text=G+Pro+X+White"
        );

        seedProductImages(logitechMouse, List.of(
                "https://placehold.co/900x700/f8fafc/111827?text=Logitech+G+Pro+X",
                "https://placehold.co/900x700/e5e7eb/111827?text=Gaming+Mouse"
        ));

        Product razerMouse = createProductIfNotExists(
                "Chuột Razer DeathAdder V3",
                "chuot-razer-deathadder-v3",
                "Razer DeathAdder V3 thiết kế công thái học, nhẹ, cảm biến tốt cho game FPS.",
                "chuot",
                "razer",
                false
        );

        createVariantIfNotExists(
                razerMouse,
                "Wired / Black",
                "RAZER-DEATHADDER-V3-WIRED-BLACK",
                "1890000",
                "1590000",
                28,
                "https://placehold.co/600x600/020617/22c55e?text=Razer+DeathAdder+V3"
        );

        seedProductImages(razerMouse, List.of(
                "https://placehold.co/900x700/020617/22c55e?text=Razer+DeathAdder+V3",
                "https://placehold.co/900x700/111827/22c55e?text=Razer+Mouse"
        ));

        Product akkoKeyboard = createProductIfNotExists(
                "Bàn phím cơ Akko 5075B Plus",
                "ban-phim-co-akko-5075b-plus",
                "Bàn phím cơ Akko 5075B Plus layout gọn, switch tốt, kết nối đa chế độ.",
                "ban-phim",
                "akko",
                true
        );

        createVariantIfNotExists(
                akkoKeyboard,
                "Cream Blue Switch / Wireless",
                "AKKO-5075B-PLUS-CREAM-BLUE",
                "2490000",
                "2190000",
                18,
                "https://placehold.co/600x600/fef3c7/111827?text=Akko+5075B+Plus"
        );

        seedProductImages(akkoKeyboard, List.of(
                "https://placehold.co/900x700/fef3c7/111827?text=Akko+5075B+Plus",
                "https://placehold.co/900x700/fde68a/111827?text=Mechanical+Keyboard"
        ));

        Product razerHeadset = createProductIfNotExists(
                "Tai nghe Razer BlackShark V2",
                "tai-nghe-razer-blackshark-v2",
                "Tai nghe gaming Razer BlackShark V2 âm thanh tốt, micro rõ, đeo thoải mái.",
                "tai-nghe",
                "razer",
                false
        );

        createVariantIfNotExists(
                razerHeadset,
                "Wired / Black",
                "RAZER-BLACKSHARK-V2-BLACK",
                "2490000",
                "1990000",
                15,
                "https://placehold.co/600x600/020617/22c55e?text=Razer+BlackShark+V2"
        );

        seedProductImages(razerHeadset, List.of(
                "https://placehold.co/900x700/020617/22c55e?text=Razer+BlackShark+V2",
                "https://placehold.co/900x700/111827/22c55e?text=Gaming+Headset"
        ));
    }

    private Product createProductIfNotExists(
            String name,
            String slug,
            String description,
            String categorySlug,
            String brandSlug,
            Boolean featured
    ) {
        return productRepository.findBySlug(slug)
                .orElseGet(() -> {
                    Category category = categoryRepository.findBySlug(categorySlug)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy category: " + categorySlug));

                    Brand brand = brandRepository.findBySlug(brandSlug)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy brand: " + brandSlug));

                    Product product = Product.builder()
                            .category(category)
                            .brand(brand)
                            .name(name)
                            .slug(slug)
                            .description(description)
                            .featured(featured)
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return productRepository.save(product);
                });
    }

    private ProductVariant createVariantIfNotExists(
            Product product,
            String name,
            String sku,
            String price,
            String salePrice,
            Integer stock,
            String thumbnailUrl
    ) {
        return productVariantRepository.findBySku(sku)
                .orElseGet(() -> {
                    ProductVariant variant = ProductVariant.builder()
                            .product(product)
                            .name(name)
                            .sku(sku)
                            .price(new BigDecimal(price))
                            .salePrice(new BigDecimal(salePrice))
                            .saleStartAt(LocalDateTime.now().minusDays(7))
                            .saleEndAt(LocalDateTime.now().plusDays(60))
                            .stock(stock)
                            .thumbnailUrl(thumbnailUrl)
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return productVariantRepository.save(variant);
                });
    }

    private void seedProductImages(Product product, List<String> imageUrls) {
        if (!productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId()).isEmpty()) {
            return;
        }

        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .variant(null)
                    .imageUrl(imageUrls.get(i))
                    .sortOrder(i + 1)
                    .build();

            productImageRepository.save(image);
        }
    }
}