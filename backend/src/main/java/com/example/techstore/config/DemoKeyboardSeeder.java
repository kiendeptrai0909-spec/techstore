package com.example.techstore.config;

import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.entity.Product;
import com.example.techstore.entity.ProductImage;
import com.example.techstore.entity.ProductSpecification;
import com.example.techstore.entity.ProductVariant;
import com.example.techstore.entity.SpecificationKey;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.BrandRepository;
import com.example.techstore.repository.CategoryRepository;
import com.example.techstore.repository.ProductImageRepository;
import com.example.techstore.repository.ProductRepository;
import com.example.techstore.repository.ProductSpecificationRepository;
import com.example.techstore.repository.ProductVariantRepository;
import com.example.techstore.repository.SpecificationKeyRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Order(32)
public class DemoKeyboardSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";
    private static final Map<String, List<String>> KEYBOARD_IMAGES = Map.ofEntries(
            Map.entry("KB-AULA-F75-BLK-BLUE-ORANGE-F7504", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650632/kb-aula-f75-blk-blue-orange-f7504_01_fmryyh.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650633/kb-aula-f75-blk-blue-orange-f7504_04_bsrqhv.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650635/kb-aula-f75-blk-blue-orange-f7504_05_r1j69d.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650637/kb-aula-f75-blk-blue-orange-f7504_06_fezcwr.png"
            )),
            Map.entry("KB-ASUS-XA14-ROG-STRIX-SCOPE-II-SNOW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650753/kb-asus-xa14-rog-strix-scope-ii-snow_03_tqpb8u.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650755/kb-asus-xa14-rog-strix-scope-ii-snow_04_zmnc3g.png"
            )),
            Map.entry("KB-AKKO-3108RF-BLK-GOLD", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779650879/kb-akko-3108rf-blk-gold_01_sviran.jpg"
            )),
            Map.entry("KB-AKKO-3108RF-PRUNUS", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651029/kb-akko-3108rf-prunus_01_r61nxj.jpg"
            )),
            Map.entry("KB-AKKO-3108RF-GLACIER", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651103/kb-akko-3108rf-glacier_01_va1q1m.jpg"
            )),
            Map.entry("KB-LOGITECH-G915-X-LS-TKL-TACTILE-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651192/kb-logitech-g915-x-ls-tkl-tactile-blk_01_yxxmbu.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651194/kb-logitech-g915-x-ls-tkl-tactile-blk_04_xkv65n.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651237/kb-logitech-g915-x-ls-tkl-tactile-blk_05_qodntn.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651239/kb-logitech-g915-x-ls-tkl-tactile-blk_06_hcoxgt.png"
            )),
            Map.entry("KB-AKKO-5087V3-LORD", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651503/kb-akko-5087v3-lord_01_rrznum.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651505/kb-akko-5087v3-lord_05_cifsmw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651508/kb-akko-5087v3-lord_06_tbhbd9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651523/kb-akko-5087v3-lord_07_nd9kzs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651526/kb-akko-5087v3-lord_08_vy5y7q.jpg"
            )),
            Map.entry("KB-EDRA-EK398S-RED-SW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651677/kb-edra-ek398s-red-sw_01_pvgbbt.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651680/kb-edra-ek398s-red-sw_04_zec0bs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651683/kb-edra-ek398s-red-sw_05_f2kwmx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651686/kb-edra-ek398s-red-sw_06_jl7m6c.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651689/kb-edra-ek398s-red-sw_07_mqzsc6.jpg"
            )),
            Map.entry("KB-EDRA-EK375S-RED-SW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651817/kb-edra-ek375s-red-sw_01_omvhea.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651820/kb-edra-ek375s-red-sw_04_tdbeqs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651823/kb-edra-ek375s-red-sw_05_zwzpnt.jpg"
            )),
            Map.entry("KB-AULA-S98-PRO-TM-BLUE-WHI-DARK-PUR-STAR-SW-S9812", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651942/kb-aula-s98-pro-tm-blue-whi-dark-pur-star-sw-s9812_01_sbbhe0.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651945/kb-aula-s98-pro-tm-blue-whi-dark-pur-star-sw-s9812_05_dkkwd5.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651948/kb-aula-s98-pro-tm-blue-whi-dark-pur-star-sw-s9812_06_ywohh9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779651951/kb-aula-s98-pro-tm-blue-whi-dark-pur-star-sw-s9812_07_wpxqod.jpg"
            )),
            Map.entry("KB-AULA-S100-PRO-TM-BLK-S100PRO03", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652124/kb-aula-s100-pro-tm-blk-s100pro03_01_tx7jja.jpg"
            )),
            Map.entry("KB-VEEKOS-K75-RED", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652211/kb-veekos-k75-red_01_m2rrg8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652215/kb-veekos-k75-red_04_wcg0lk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652218/kb-veekos-k75-red_05_p49or6.jpg"
            )),
            Map.entry("KB-AULA-AGG60-PRO-GREY-AG6001", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652305/kb-aula-agg60-pro-grey-ag6001_01_rbmaus.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652308/kb-aula-agg60-pro-grey-ag6001_04_zdq9kt.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652312/kb-aula-agg60-pro-grey-ag6001_05_l0fzme.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652315/kb-aula-agg60-pro-grey-ag6001_06_b8jfez.jpg"
            )),
            Map.entry("KB-ASUS-TUF-K3-GEN-II-MIKU", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652417/kb-asus-tuf-k3-gen-ii-miku_01_biad20.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652421/kb-asus-tuf-k3-gen-ii-miku_04_q3uspd.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652424/kb-asus-tuf-k3-gen-ii-miku_05_rzrbru.png"
            )),
            Map.entry("KB-AKKO-ACR-PRO-ALICE-PLUS-SPRAY-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652602/kb-akko-acr-pro-alice-plus-spray-white_01_feefyw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652606/kb-akko-acr-pro-alice-plus-spray-white_04_n7d9nh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652609/kb-akko-acr-pro-alice-plus-spray-white_05_grwfxs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652613/kb-akko-acr-pro-alice-plus-spray-white_06_vwyg2z.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652616/kb-akko-acr-pro-alice-plus-spray-white_07_yzb6ex.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652620/kb-akko-acr-pro-alice-plus-spray-white_08_zirqbo.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779652623/kb-akko-acr-pro-alice-plus-spray-white_09_kx6wjq.jpg"
            ))
    );
    private static final String CATEGORY_SLUG = "ban-phim";
    private static final String CATEGORY_NAME = "Bàn phím";

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductSpecificationRepository productSpecificationRepository;
    private final SpecificationKeyRepository specificationKeyRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedKeyboards();
    }

    private void seedKeyboards() {
        List<KeyboardSeed> keyboards = List.of(
                keyboard(
                        "Bàn phím AULA F75 Đen Xanh Đậm Cam Reaper Switch",
                        "AULA",
                        "KB-AULA-F75-BLK-BLUE-ORANGE-F7504",
                        "1189000",
                        "Bàn phím cơ gaming layout 75%, thiết kế nhỏ gọn, màu sắc nổi bật, phù hợp chơi game và làm việc.",
                        "75%",
                        "Reaper Switch",
                        "Có dây / không dây",
                        "RGB",
                        25
                ),
                keyboard(
                        "Bàn phím gaming ASUS XA14 ROG STRIX SCOPE II X NX Snow",
                        "ASUS",
                        "KB-ASUS-XA14-ROG-STRIX-SCOPE-II-SNOW",
                        "3390000",
                        "Bàn phím gaming ASUS ROG cao cấp, switch NX Snow cho cảm giác gõ mượt và độ ổn định cao.",
                        "Fullsize",
                        "ROG NX Snow",
                        "USB Type-C",
                        "AURA Sync RGB",
                        12
                ),
                keyboard(
                        "Bàn phím không dây AKKO 3108RF V3 Black Gold",
                        "AKKO",
                        "KB-AKKO-3108RF-BLK-GOLD",
                        "850000",
                        "Bàn phím AKKO fullsize không dây, phong cách Black Gold, phù hợp làm việc và giải trí.",
                        "Fullsize 108 phím",
                        "Akko Switch",
                        "Wireless / USB Type-C",
                        "Không LED",
                        30
                ),
                keyboard(
                        "Bàn phím không dây AKKO 3108RF V3 Prunus Lannesiana",
                        "AKKO",
                        "KB-AKKO-3108RF-PRUNUS",
                        "850000",
                        "Bàn phím AKKO 3108RF V3 phiên bản Prunus Lannesiana, thiết kế đẹp mắt, dùng pin tiện lợi.",
                        "Fullsize 108 phím",
                        "Akko Switch",
                        "Wireless / USB Type-C",
                        "Không LED",
                        28
                ),
                keyboard(
                        "Bàn phím không dây AKKO 3108RF V3 Glacier",
                        "AKKO",
                        "KB-AKKO-3108RF-GLACIER",
                        "850000",
                        "Bàn phím AKKO 3108RF V3 Glacier với tông màu hiện đại, kết nối linh hoạt cho học tập và văn phòng.",
                        "Fullsize 108 phím",
                        "Akko Switch",
                        "Wireless / USB Type-C",
                        "Không LED",
                        28
                ),
                keyboard(
                        "Bàn phím Logitech G915 X Lightspeed TKL Tactile Wireless Black",
                        "Logitech",
                        "KB-LOGITECH-G915-X-LS-TKL-TACTILE-BLK",
                        "4440000",
                        "Bàn phím gaming không dây Logitech G915 X Lightspeed TKL, thiết kế mỏng, phản hồi nhanh.",
                        "TKL",
                        "Tactile Low Profile",
                        "Lightspeed / Bluetooth / USB-C",
                        "RGB",
                        10
                ),
                keyboard(
                        "Bàn phím không dây AKKO 5087 V3 Lord of Mysteries",
                        "AKKO",
                        "KB-AKKO-5087V3-LORD",
                        "1590000",
                        "Bàn phím AKKO 5087 V3 Lord of Mysteries layout TKL, thiết kế độc đáo, hỗ trợ nhiều chế độ kết nối.",
                        "TKL",
                        "Akko V3 Piano Pro",
                        "Bluetooth / 2.4GHz / USB-C",
                        "RGB",
                        18
                ),
                keyboard(
                        "Bàn phím cơ E-Dra không dây EK398S Red Switch",
                        "E-Dra",
                        "KB-EDRA-EK398S-RED-SW",
                        "790000",
                        "Bàn phím cơ E-Dra EK398S không dây, Red Switch dễ dùng, phù hợp làm việc và chơi game.",
                        "Fullsize",
                        "Red Switch",
                        "USB / 2.4GHz / Bluetooth",
                        "LED",
                        22
                ),
                keyboard(
                        "Bàn phím cơ E-Dra không dây EK375S Red Switch",
                        "E-Dra",
                        "KB-EDRA-EK375S-RED-SW",
                        "690000",
                        "Bàn phím cơ E-Dra EK375S nhỏ gọn, hỗ trợ nhiều chế độ kết nối, phù hợp setup tối giản.",
                        "75%",
                        "Red Switch",
                        "USB / 2.4GHz / Bluetooth",
                        "LED",
                        22
                ),
                keyboard(
                        "Bàn phím AULA S98 PRO TM Xanh Dương Trắng Tím Đậm Star Vector Switch",
                        "AULA",
                        "KB-AULA-S98-PRO-TM-BLUE-WHI-DARK-PUR-STAR-SW-S9812",
                        "1590000",
                        "Bàn phím AULA S98 PRO TM layout 98 phím, switch Star Vector, thiết kế màu sắc nổi bật.",
                        "98 phím",
                        "Star Vector Switch",
                        "Có dây / không dây",
                        "RGB",
                        16
                ),
                keyboard(
                        "Bàn phím AULA S100 PRO TM Đen Xám Cam Red Switch",
                        "AULA",
                        "KB-AULA-S100-PRO-TM-BLK-S100PRO03",
                        "790000",
                        "Bàn phím AULA S100 PRO TM với Red Switch, kiểu dáng gọn nhẹ, phù hợp học tập và chơi game.",
                        "100 phím",
                        "Red Switch",
                        "Có dây / không dây",
                        "Rainbow LED",
                        20
                ),
                keyboard(
                        "Bàn phím có dây Veekos K75 Wined Red",
                        "Veekos",
                        "KB-VEEKOS-K75-RED",
                        "690000",
                        "Bàn phím cơ có dây Veekos K75 Wined Red, layout 75%, keycap PBT và hỗ trợ hotswap.",
                        "75%",
                        "Mechanical Switch",
                        "USB Type-C",
                        "RGB",
                        18
                ),
                keyboard(
                        "Bàn phím có dây AULA AG60 PRO Xám Aether Magnetic Switch Rapid Trigger",
                        "AULA",
                        "KB-AULA-AGG60-PRO-GREY-AG6001",
                        "3690000",
                        "Bàn phím AULA AG60 PRO sử dụng magnetic switch, hỗ trợ rapid trigger, phù hợp game thủ FPS.",
                        "60%",
                        "Aether Magnetic Switch",
                        "USB Type-C",
                        "RGB",
                        8
                ),
                keyboard(
                        "Bàn phím cơ có dây ASUS TUF Gaming K3 Gen II Hatsune Miku",
                        "ASUS",
                        "KB-ASUS-TUF-K3-GEN-II-MIKU",
                        "2790000",
                        "Bàn phím ASUS TUF Gaming K3 Gen II phiên bản Hatsune Miku, thiết kế nổi bật, hỗ trợ Aura Sync.",
                        "96%",
                        "Optical Mechanical Switch",
                        "USB",
                        "Aura Sync RGB",
                        9
                ),
                keyboard(
                        "Bàn phím AKKO ACR Pro Alice Plus Spray Paint White AKKO CS Switch",
                        "AKKO",
                        "KB-AKKO-ACR-PRO-ALICE-PLUS-SPRAY-WHITE",
                        "2990000",
                        "Bàn phím AKKO ACR Pro Alice Plus kiểu dáng Alice công thái học, vỏ trong suốt và switch AKKO CS.",
                        "Alice Layout",
                        "AKKO CS Switch",
                        "USB Type-C",
                        "RGB",
                        7
                )
        );

        for (KeyboardSeed keyboard : keyboards) {
            upsertKeyboard(keyboard);
        }
    }

    private void upsertKeyboard(KeyboardSeed seed) {
        Category category = getOrCreateCategory();
        Brand brand = getOrCreateBrand(seed.getBrandName());

        Product product = productRepository.findBySlug(seed.getSlug())
                .orElseGet(Product::new);

        product.setCategory(category);
        product.setBrand(brand);
        product.setName(seed.getName());
        product.setSlug(seed.getSlug());
        product.setDescription(buildDescription(seed));
        product.setFeatured(true);
        product.setStatus(ProductStatus.ACTIVE);

        Product savedProduct = productRepository.save(product);

        ProductVariant variant = productVariantRepository.findBySku(seed.getSku())
                .orElseGet(ProductVariant::new);

        BigDecimal priceValue = new BigDecimal(seed.getPrice());
        BigDecimal salePriceValue = makeSalePrice(priceValue);
        List<String> imageUrls = getKeyboardImages(seed.getSku());
        variant.setProduct(savedProduct);
        variant.setName(seed.getLayout() + " / " + seed.getSwitchName());
        variant.setSku(seed.getSku());
        variant.setPrice(priceValue);
        variant.setSalePrice(salePriceValue);
        variant.setSaleStartAt(LocalDateTime.now().minusDays(7));
        variant.setSaleEndAt(LocalDateTime.now().plusDays(120));
        variant.setStock(seed.getStock());
        variant.setThumbnailUrl(imageUrls.get(0));
        variant.setStatus(ProductStatus.ACTIVE);

        productVariantRepository.save(variant);

        overwriteProductImages(savedProduct, imageUrls);
        overwriteSpecifications(savedProduct, category, seed);
    }
    private List<String> getKeyboardImages(String sku) {
        return KEYBOARD_IMAGES.getOrDefault(sku, List.of(DEMO_IMAGE_URL));
    }
    private void overwriteProductImages(Product product, List<String> imageUrls) {
        List<ProductImage> oldImages =
                productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId());

        if (!oldImages.isEmpty()) {
            productImageRepository.deleteAll(oldImages);
        }

        List<String> safeImageUrls =
                imageUrls == null || imageUrls.isEmpty()
                        ? List.of(DEMO_IMAGE_URL)
                        : imageUrls;

        for (int i = 0; i < safeImageUrls.size(); i++) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .variant(null)
                    .imageUrl(safeImageUrls.get(i))
                    .sortOrder(i + 1)
                    .build();

            productImageRepository.save(image);
        }
    }

    private void overwriteSpecifications(
            Product product,
            Category category,
            KeyboardSeed seed
    ) {
        List<SpecSeed> specs = List.of(
                spec("Hãng sản xuất", seed.getBrandName(), null, 1),
                spec("Bảo hành", "24 tháng", null, 2),
                spec("Layout", seed.getLayout(), null, 3),
                spec("Switch", seed.getSwitchName(), null, 4),
                spec("Kết nối", seed.getConnection(), null, 5),
                spec("LED", seed.getLed(), null, 6),
                spec("Loại bàn phím", "Bàn phím cơ", null, 7),
                spec("Tình trạng", "Còn hàng", null, 8)
        );

        Set<Long> usedKeyIds = new HashSet<>();

        for (SpecSeed spec : specs) {
            SpecificationKey key = getOrCreateSpecificationKey(
                    category,
                    spec.getName(),
                    spec.getUnit(),
                    spec.getSortOrder()
            );

            usedKeyIds.add(key.getId());

            ProductSpecification productSpecification =
                    productSpecificationRepository
                            .findByProductIdAndSpecificationKeyId(
                                    product.getId(),
                                    key.getId()
                            )
                            .orElseGet(ProductSpecification::new);

            productSpecification.setProduct(product);
            productSpecification.setSpecificationKey(key);
            productSpecification.setValue(spec.getValue());
            productSpecification.setDeletedAt(null);

            productSpecificationRepository.save(productSpecification);
        }

        List<ProductSpecification> oldSpecs =
                productSpecificationRepository.findByProductId(product.getId());

        List<ProductSpecification> specsToDelete = new ArrayList<>();

        for (ProductSpecification oldSpec : oldSpecs) {
            if (
                    oldSpec.getSpecificationKey() != null
                            && !usedKeyIds.contains(oldSpec.getSpecificationKey().getId())
            ) {
                specsToDelete.add(oldSpec);
            }
        }

        if (!specsToDelete.isEmpty()) {
            productSpecificationRepository.deleteAll(specsToDelete);
        }
    }

    private SpecificationKey getOrCreateSpecificationKey(
            Category category,
            String name,
            String unit,
            Integer sortOrder
    ) {
        List<SpecificationKey> keys =
                specificationKeyRepository.findByCategoryIdOrderBySortOrderAsc(category.getId());

        return keys.stream()
                .filter(key -> key.getName().equalsIgnoreCase(name))
                .findFirst()
                .map(existingKey -> {
                    existingKey.setUnit(unit);
                    existingKey.setSortOrder(sortOrder);
                    return specificationKeyRepository.save(existingKey);
                })
                .orElseGet(() -> {
                    SpecificationKey newKey = SpecificationKey.builder()
                            .category(category)
                            .name(name)
                            .unit(unit)
                            .sortOrder(sortOrder)
                            .build();

                    return specificationKeyRepository.save(newKey);
                });
    }

    private Category getOrCreateCategory() {
        return categoryRepository.findBySlug(CATEGORY_SLUG)
                .orElseGet(() -> {
                    Category category = Category.builder()
                            .name(CATEGORY_NAME)
                            .slug(CATEGORY_SLUG)
                            .parent(null)
                            .description("Bàn phím cơ, bàn phím gaming, bàn phím văn phòng và phụ kiện bàn phím.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(4)
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return categoryRepository.save(category);
                });
    }

    private Brand getOrCreateBrand(String brandName) {
        String slug = generateSlug(brandName);

        return brandRepository.findBySlug(slug)
                .orElseGet(() -> {
                    Brand brand = Brand.builder()
                            .name(brandName)
                            .slug(slug)
                            .logoUrl(DEMO_IMAGE_URL)
                            .description(brandName + " là thương hiệu thiết bị ngoại vi và phụ kiện máy tính.")
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return brandRepository.save(brand);
                });
    }

    private BigDecimal makeSalePrice(BigDecimal price) {
        return price.multiply(new BigDecimal("0.95"))
                .setScale(0, RoundingMode.HALF_UP);
    }

    private String buildDescription(KeyboardSeed seed) {
        return """
                %s

                Thông số nổi bật:
                - Hãng sản xuất: %s
                - Layout: %s
                - Switch: %s
                - Kết nối: %s
                - LED: %s
                - Bảo hành: 24 tháng
                """.formatted(
                seed.getDescription(),
                seed.getBrandName(),
                seed.getLayout(),
                seed.getSwitchName(),
                seed.getConnection(),
                seed.getLed()
        ).trim();
    }

    private KeyboardSeed keyboard(
            String name,
            String brandName,
            String sku,
            String price,
            String description,
            String layout,
            String switchName,
            String connection,
            String led,
            Integer stock
    ) {
        return new KeyboardSeed(
                name,
                generateSlug(name),
                brandName,
                sku,
                price,
                description,
                layout,
                switchName,
                connection,
                led,
                stock
        );
    }

    private SpecSeed spec(String name, String value, String unit, Integer sortOrder) {
        return new SpecSeed(name, value, unit, sortOrder);
    }

    private String generateSlug(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace("đ", "d")
                .replace("Đ", "d")
                .toLowerCase(Locale.ROOT)
                .trim();

        return normalized
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    @Getter
    @AllArgsConstructor
    private static class KeyboardSeed {
        private String name;
        private String slug;
        private String brandName;
        private String sku;
        private String price;
        private String description;
        private String layout;
        private String switchName;
        private String connection;
        private String led;
        private Integer stock;
    }

    @Getter
    @AllArgsConstructor
    private static class SpecSeed {
        private String name;
        private String value;
        private String unit;
        private Integer sortOrder;
    }
}