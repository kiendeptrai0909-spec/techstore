package com.example.techstore.config;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
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
import lombok.RequiredArgsConstructor;
import lombok.Getter;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(31)
public class DemoMonitorSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";

    private static final String CATEGORY_SLUG = "man-hinh";
    private static final String BRAND_SLUG = "lg";
    private static final String BRAND_NAME = "LG";

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
        seedLgMonitors();
    }

    private void seedLgMonitors() {
        upsertMonitor(
                "Màn hình LG 27G850A-B 27 inch Nano IPS Black 4K 240Hz-FHD 480Hz chuyên game",
                "man-hinh-lg-27g850a-b-27-inch-nano-ips-black-4k-240hz-fhd-480hz",
                "MAN-LG-27G850A-B",
                "18990000",
                "Màn hình gaming cao cấp 27 inch, hỗ trợ hiển thị sắc nét 4K và dual mode tốc độ cao cho game thủ.",
                "27 inch / Nano IPS Black / 4K / 240Hz",
                true,
                8,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "Nano IPS Black", null, 4),
                        spec("Độ phân giải", "4K/UHD (3840 x 2160)", null, 5),
                        spec("Dual mode", "4K 240Hz - FHD 480Hz", null, 6),
                        spec("Tần số quét", "240Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms", "ms", 8),
                        spec("VESA", "100x100", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình LG 24U411A-B 24 inch IPS 120Hz HDR10 siêu mỏng",
                "man-hinh-lg-24u411a-b-24-inch-ips-120hz-hdr10",
                "MAN-LG-24U411A-B",
                "2390000",
                "Màn hình phổ thông 24 inch, thiết kế mỏng gọn, phù hợp học tập, văn phòng và giải trí nhẹ.",
                "24 inch / IPS / Full HD / 120Hz / HDR10",
                true,
                20,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "24 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "Full HD (1920 x 1080)", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "120Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms MBR", null, 8),
                        spec("Cổng kết nối", "1 x HDMI", null, 9),
                        spec("VESA", "100x100mm", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình thông minh LG Swing 32U889SA-W 32 inch IPS 4K USB-C webOS",
                "man-hinh-thong-minh-lg-swing-32u889sa-w-32-inch-ips-4k-usbc-webos",
                "MAN-LG-32U889SA-W",
                "27990000",
                "Màn hình thông minh 32 inch có webOS, độ phân giải 4K và USB-C, phù hợp làm việc, giải trí, trình chiếu.",
                "32 inch / IPS / 4K UHD / USB-C / webOS",
                true,
                5,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "32 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "4K UHD (3840 x 2160)", null, 5),
                        spec("Hệ điều hành", "webOS", null, 6),
                        spec("Độ sáng", "350 nit", "nit", 7),
                        spec("Tỷ lệ", "16:9", null, 8),
                        spec("Cổng kết nối", "USB-C đa năng", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình LG 27G610A-B 27 inch IPS 2K 200Hz G-Sync chuyên game",
                "man-hinh-lg-27g610a-b-27-inch-ips-2k-200hz-gsync",
                "MAN-LG-27G610A-B",
                "5190000",
                "Màn hình gaming 27 inch 2K, tần số quét 200Hz, phù hợp game thủ cần chuyển động mượt.",
                "27 inch / IPS / 2K QHD / 200Hz / G-Sync",
                true,
                14,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "2K QHD", null, 5),
                        spec("Tần số quét", "200Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "1ms", "ms", 7),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort 1.4", null, 8),
                        spec("VESA", "100 x 100 mm", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình cong LG 40U990A-W 40 inch IPS 4K 120Hz USB-C",
                "man-hinh-cong-lg-40u990a-w-40-inch-ips-4k-120hz-usbc",
                "MAN-LG-40U990A-W",
                "42990000",
                "Màn hình cong 40 inch cao cấp, phù hợp sáng tạo nội dung, lập trình, dựng video và làm việc đa nhiệm.",
                "40 inch / Nano IPS Black / 5K2K / 120Hz / USB-C",
                true,
                4,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "40 inch", null, 3),
                        spec("Tấm nền", "Nano IPS Black", null, 4),
                        spec("Độ phân giải", "5K2K", null, 5),
                        spec("Tần số quét", "120Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "5ms", "ms", 7),
                        spec("Độ sáng", "450 cd/m²", null, 8),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort; 1 x USB-C DP Alt Mode PD 96W", null, 9),
                        spec("VESA", "100x100mm", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 24G411A-B 24 inch IPS 144Hz HDR10 G-Sync chuyên game",
                "man-hinh-lg-24g411a-b-24-inch-ips-144hz-hdr10-gsync",
                "MAN-LG-24G411A-B",
                "2650000",
                "Màn hình gaming phổ thông 24 inch, tần số quét cao, phù hợp game FPS, MOBA và học tập hằng ngày.",
                "24 inch / IPS / Full HD / 144Hz / HDR10",
                true,
                22,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "24 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "Full HD", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "144Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms", "ms", 8),
                        spec("Cổng kết nối", "1 x HDMI; 1 x DisplayPort", null, 9),
                        spec("VESA", "100x100", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình thông minh LG 39GX90SA-W 39 inch OLED 2K 240Hz webOS",
                "man-hinh-thong-minh-lg-39gx90sa-w-39-inch-oled-2k-240hz-webos",
                "MAN-LG-39GX90SA-W",
                "32490000",
                "Màn hình OLED thông minh 39 inch, phù hợp gaming, giải trí cao cấp và sử dụng đa phương tiện.",
                "39 inch / OLED / 2K / 240Hz / webOS",
                true,
                5,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "39 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "2K", null, 5),
                        spec("Tần số quét", "240Hz", "Hz", 6),
                        spec("Hệ điều hành", "webOS", null, 7),
                        spec("Cổng kết nối", "HDMI 2.1; DisplayPort 1.4; USB-C Power Delivery", null, 8),
                        spec("VESA", "100x100", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình LG 27GX704A-B UltraGear 27 inch OLED 2K 240Hz G-Sync",
                "man-hinh-lg-27gx704a-b-ultragear-27-inch-oled-2k-240hz-gsync",
                "MAN-LG-27GX704A-B",
                "15990000",
                "Màn hình OLED UltraGear 27 inch dành cho game thủ cần tốc độ cao và màu sắc sống động.",
                "27 inch / OLED / QHD 2K / 240Hz / G-Sync",
                true,
                7,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "QHD 2K", null, 5),
                        spec("Tần số quét", "240Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "0.03ms GtG", null, 7),
                        spec("HDR", "VESA DisplayHDR True Black 400", null, 8),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort 1.4", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình cong LG 45GX950A-B UltraGear 45 inch OLED 4K 165Hz-FHD 330Hz chuyên game",
                "man-hinh-cong-lg-45gx950a-b-ultragear-45-inch-oled-4k-165hz-fhd-330hz",
                "MAN-LG-45GX950A-B",
                "53990000",
                "Màn hình cong OLED UltraGear 45 inch, dual mode linh hoạt giữa 4K sắc nét và FHD tần số quét cực cao.",
                "45 inch / OLED cong / 4K 165Hz / FHD 330Hz",
                true,
                3,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "45 inch", null, 3),
                        spec("Tấm nền", "OLED cong", null, 4),
                        spec("Độ phân giải", "4K", null, 5),
                        spec("Dual mode", "4K 165Hz - FHD 330Hz", null, 6),
                        spec("Thời gian phản hồi", "0.03ms GtG", null, 7),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort; 1 x USB-C DP Alt Mode PD 90W", null, 8)
                )
        );

        upsertMonitor(
                "Màn hình LG 32GX870A-B UltraGear 32 inch OLED 4K 240Hz G-Sync chuyên game",
                "man-hinh-lg-32gx870a-b-ultragear-32-inch-oled-4k-240hz-gsync",
                "MAN-LG-32GX870A-B",
                "29990000",
                "Màn hình OLED 32 inch 4K 240Hz, phù hợp gaming cao cấp, xem phim và sáng tạo nội dung.",
                "32 inch / OLED / 4K / 240Hz / G-Sync",
                true,
                6,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "32 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "4K", null, 5),
                        spec("Tần số quét", "240Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "0.03ms GtG", null, 7),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort; 1 x USB-C DP Alt Mode PD 90W", null, 8),
                        spec("VESA", "100x100", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình LG 29U531A-W 29 inch IPS 100Hz USB-C HDR10 UWFHD",
                "man-hinh-lg-29u531a-w-29-inch-ips-100hz-usbc-hdr10-uwfhd",
                "MAN-LG-29U531A-W",
                "4990000",
                "Màn hình UltraWide 29 inch phù hợp làm việc đa nhiệm, dựng nội dung cơ bản và giải trí.",
                "29 inch / IPS / UWFHD 2560x1080 / 100Hz / USB-C",
                false,
                12,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "29 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "UWFHD (2560 x 1080)", null, 5),
                        spec("Tỷ lệ", "21:9 UltraWide", null, 6),
                        spec("Tần số quét", "100Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms", "ms", 8),
                        spec("Cổng kết nối", "1 x HDMI; 1 x USB-C 15W", null, 9),
                        spec("VESA", "100x100", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 27U411A-B 27 inch IPS 120Hz HDR10 siêu mỏng",
                "man-hinh-lg-27u411a-b-27-inch-ips-120hz-hdr10",
                "MAN-LG-27U411A-B",
                "2990000",
                "Màn hình 27 inch phổ thông, phù hợp học tập, làm việc văn phòng và giải trí tại nhà.",
                "27 inch / IPS / Full HD / 120Hz / HDR10",
                false,
                18,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "Full HD", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "120Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms GtG / 1ms MBR", null, 8),
                        spec("Cổng kết nối", "1 x HDMI", null, 9),
                        spec("VESA", "100 x 100 mm", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 22U401A-B 22 inch 100Hz HDR10",
                "man-hinh-lg-22u401a-b-22-inch-100hz-hdr10",
                "MAN-LG-22U401A-B",
                "2090000",
                "Màn hình nhỏ gọn 22 inch cho học tập, văn phòng và giải trí nhẹ.",
                "22 inch / VA / Full HD / 100Hz / HDR10",
                false,
                25,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "22 inch", null, 3),
                        spec("Tấm nền", "VA", null, 4),
                        spec("Độ phân giải", "Full HD (1920 x 1080)", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "100Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms MBR", null, 8),
                        spec("Cổng kết nối", "1 x HDMI; 1 x D-Sub", null, 9),
                        spec("VESA", "100x100", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 24U631A-B 24 inch IPS 2K 100Hz USB-C",
                "man-hinh-lg-24u631a-b-24-inch-ips-2k-100hz-usbc",
                "MAN-LG-24U631A-B",
                "3990000",
                "Màn hình 24 inch độ phân giải 2K, phù hợp làm việc văn phòng, học tập và giải trí sắc nét.",
                "24 inch / IPS / 2K / 100Hz / USB-C",
                false,
                15,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "24 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "2K", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "100Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms GtG", null, 8),
                        spec("Cổng kết nối", "1 x HDMI; 1 x USB-C 15W", null, 9),
                        spec("VESA", "100x100", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình cong LG 34GX90SA-W OLED 2K 240Hz chuyên game",
                "man-hinh-cong-lg-34gx90sa-w-oled-2k-240hz",
                "MAN-LG-34GX90SA-W",
                "25190000",
                "Màn hình cong OLED 34 inch, phù hợp game thủ cần khung hình rộng, màu sắc sâu và tốc độ cao.",
                "34 inch / OLED cong / 2K / 240Hz",
                true,
                6,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "34 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "2K", null, 5),
                        spec("Tần số quét", "240Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "0.03ms", "ms", 7),
                        spec("Cổng kết nối", "HDMI 2.0; DisplayPort 1.4; USB-C", null, 8),
                        spec("VESA", "N/A", null, 9)
                )
        );

        upsertMonitor(
                "Màn hình LG 27UP850K-W 27 inch IPS 4K HDR USB-C chuyên đồ họa",
                "man-hinh-lg-27up850k-w-27-inch-ips-4k-hdr-usbc",
                "MAN-LG-27UP850K-W",
                "8590000",
                "Màn hình 4K chuyên đồ họa, phù hợp chỉnh ảnh, dựng video, thiết kế và làm việc với nội dung độ phân giải cao.",
                "27 inch / IPS / 4K UHD / HDR / USB-C",
                true,
                10,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS chuẩn màu", null, 4),
                        spec("Độ phân giải", "4K UHD", null, 5),
                        spec("HDR", "DisplayHDR 400", null, 6),
                        spec("Tần số quét", "60Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms", "ms", 8),
                        spec("Độ sáng", "320 nit", "nit", 9),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort 1.4; USB-C DisplayPort Alt PD 96W", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 27U631A-B 27 inch IPS 2K 100Hz HDR10",
                "man-hinh-lg-27u631a-b-27-inch-ips-2k-100hz-hdr10",
                "MAN-LG-27U631A-B",
                "4390000",
                "Màn hình 27 inch 2K cân bằng giữa làm việc, học tập và giải trí.",
                "27 inch / IPS / 2K / 100Hz / HDR10",
                false,
                16,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "2K", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "100Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms", "ms", 8),
                        spec("Cổng kết nối", "HDMI; DisplayPort; Headphone Out", null, 9),
                        spec("VESA", "100 x 100 mm", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình LG 27UP600K-W 27 inch IPS 4K HDR10",
                "man-hinh-lg-27up600k-w-27-inch-ips-4k-hdr10",
                "MAN-LG-27UP600K-W",
                "5490000",
                "Màn hình 4K 27 inch giá hợp lý, phù hợp làm việc, xem phim và xử lý hình ảnh cơ bản.",
                "27 inch / IPS / 4K / HDR10",
                true,
                11,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "4K UHD", null, 5),
                        spec("HDR", "HDR10 / VESA DisplayHDR", null, 6),
                        spec("Tần số quét", "60Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "5ms GtG", null, 8),
                        spec("Độ sáng", "400 cd/m²", null, 9),
                        spec("Cổng kết nối", "HDMI; DisplayPort", null, 10),
                        spec("VESA", "100 x 100 mm", null, 11)
                )
        );

        upsertMonitor(
                "Màn hình LG 27GX790A UltraGear 27 inch OLED 2K 480Hz G-Sync chuyên game",
                "man-hinh-lg-27gx790a-ultragear-27-inch-oled-2k-480hz-gsync",
                "MAN-LG-27GX790A-B",
                "20990000",
                "Màn hình OLED UltraGear tốc độ rất cao, phù hợp game thủ thi đấu cần phản hồi cực nhanh.",
                "27 inch / OLED / 2K / 480Hz / G-Sync",
                true,
                5,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "2K", null, 5),
                        spec("Tần số quét", "480Hz", "Hz", 6),
                        spec("Thời gian phản hồi", "0.03ms", "ms", 7),
                        spec("VESA", "100 x 100 mm", null, 8)
                )
        );

        upsertMonitor(
                "Màn hình LG 32GS95UV-B 32 inch OLED 4K 240Hz Dual Mode chuyên game",
                "man-hinh-lg-32gs95uv-b-32-inch-oled-4k-240hz-dual-mode",
                "MAN-LG-32GS95UV-B",
                "27390000",
                "Màn hình OLED 32 inch 4K 240Hz, hỗ trợ dual mode, phù hợp game thủ và người làm sáng tạo.",
                "32 inch / OLED / 4K / 240Hz / Dual Mode",
                true,
                7,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "32 inch", null, 3),
                        spec("Tấm nền", "OLED", null, 4),
                        spec("Độ phân giải", "4K", null, 5),
                        spec("Tần số quét", "240Hz", "Hz", 6),
                        spec("Dual mode", "4K 240Hz", null, 7),
                        spec("Thời gian phản hồi", "0.03ms GtG", null, 8),
                        spec("Cổng kết nối", "2 x HDMI; 1 x DisplayPort 1.4", null, 9),
                        spec("VESA", "100 x 100 mm", null, 10)
                )
        );

        upsertMonitor(
                "Màn hình cong LG 38WR85QC-W 38 inch Nano IPS 2K 144Hz G-Sync",
                "man-hinh-cong-lg-38wr85qc-w-38-inch-nano-ips-2k-144hz-gsync",
                "MAN-LG-38WR85QC-W",
                "24190000",
                "Màn hình cong Nano IPS 38 inch, phù hợp làm việc sáng tạo, lập trình, dựng video và gaming.",
                "38 inch / Nano IPS cong / WQHD 3840x1600 / 144Hz",
                true,
                5,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "38 inch", null, 3),
                        spec("Tấm nền", "Nano IPS", null, 4),
                        spec("Độ phân giải", "WQHD (3840 x 1600)", null, 5),
                        spec("HDR", "HDR 600", null, 6),
                        spec("Tần số quét", "144Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms GtG", null, 8),
                        spec("Trọng lượng", "12.3kg", "kg", 9),
                        spec("Cổng kết nối", "HDMI", null, 10),
                        spec("VESA", "100 x 100 mm", null, 11)
                )
        );

        upsertMonitor(
                "Màn hình LG 27GR93U-B UltraGear 27 inch IPS 4K 144Hz G-Sync chuyên game",
                "man-hinh-lg-27gr93u-b-ultragear-27-inch-ips-4k-144hz-gsync",
                "MAN-LG-27GR93U-B",
                "9190000",
                "Màn hình UltraGear 27 inch 4K 144Hz, phù hợp game thủ cần độ nét cao và chuyển động mượt.",
                "27 inch / IPS / 4K / 144Hz / G-Sync",
                true,
                10,
                List.of(
                        spec("Hãng sản xuất", "LG", null, 1),
                        spec("Bảo hành", "24 tháng", null, 2),
                        spec("Kích thước màn hình", "27 inch", null, 3),
                        spec("Tấm nền", "IPS", null, 4),
                        spec("Độ phân giải", "4K (3840 x 2160)", null, 5),
                        spec("HDR", "HDR10", null, 6),
                        spec("Tần số quét", "144Hz", "Hz", 7),
                        spec("Thời gian phản hồi", "1ms GTG", null, 8),
                        spec("VESA", "100 x 100 mm", null, 9)
                )
        );
    }

    private void upsertMonitor(
            String productName,
            String productSlug,
            String sku,
            String price,
            String shortDescription,
            String variantName,
            Boolean featured,
            Integer stock,
            List<SpecSeed> specs
    ) {
        Category category = getOrCreateCategory();
        Brand brand = getOrCreateBrand();

        Product product = productRepository.findBySlug(productSlug)
                .orElseGet(Product::new);

        product.setCategory(category);
        product.setBrand(brand);
        product.setName(productName);
        product.setSlug(productSlug);
        product.setDescription(buildDescription(shortDescription, specs));
        product.setFeatured(featured);
        product.setStatus(ProductStatus.ACTIVE);

        Product savedProduct = productRepository.save(product);

        ProductVariant variant = productVariantRepository.findBySku(sku)
                .orElseGet(ProductVariant::new);

        BigDecimal priceValue = new BigDecimal(price);
        BigDecimal salePriceValue = makeSalePrice(priceValue);

        variant.setProduct(savedProduct);
        variant.setName(variantName);
        variant.setSku(sku);
        variant.setPrice(priceValue);
        variant.setSalePrice(salePriceValue);
        variant.setSaleStartAt(LocalDateTime.now().minusDays(7));
        variant.setSaleEndAt(LocalDateTime.now().plusDays(120));
        variant.setStock(stock);
        variant.setThumbnailUrl(DEMO_IMAGE_URL);
        variant.setStatus(ProductStatus.ACTIVE);

        productVariantRepository.save(variant);

        overwriteProductImages(savedProduct);
        overwriteSpecifications(savedProduct, category, specs);
    }

    private void overwriteProductImages(Product product) {
        List<ProductImage> oldImages =
                productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId());

        if (!oldImages.isEmpty()) {
            productImageRepository.deleteAll(oldImages);
        }

        for (int i = 1; i <= 3; i++) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .variant(null)
                    .imageUrl(DEMO_IMAGE_URL)
                    .sortOrder(i)
                    .build();

            productImageRepository.save(image);
        }
    }

    private void overwriteSpecifications(
            Product product,
            Category category,
            List<SpecSeed> specs
    ) {
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
                            .name("Màn hình")
                            .slug(CATEGORY_SLUG)
                            .parent(null)
                            .description("Màn hình máy tính, màn hình gaming, màn hình đồ họa và màn hình văn phòng.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(3)
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return categoryRepository.save(category);
                });
    }

    private Brand getOrCreateBrand() {
        return brandRepository.findBySlug(BRAND_SLUG)
                .orElseGet(() -> {
                    Brand brand = Brand.builder()
                            .name(BRAND_NAME)
                            .slug(BRAND_SLUG)
                            .logoUrl(DEMO_IMAGE_URL)
                            .description("LG là thương hiệu công nghệ nổi tiếng với các dòng màn hình văn phòng, gaming, OLED và màn hình chuyên đồ họa.")
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return brandRepository.save(brand);
                });
    }

    private BigDecimal makeSalePrice(BigDecimal price) {
        return price.multiply(new BigDecimal("0.95"))
                .setScale(0, RoundingMode.HALF_UP);
    }

    private String buildDescription(String shortDescription, List<SpecSeed> specs) {
        StringBuilder builder = new StringBuilder();

        builder.append(shortDescription).append("\n\n");
        builder.append("Thông số nổi bật:\n");

        for (SpecSeed spec : specs) {
            builder.append("- ")
                    .append(spec.getName())
                    .append(": ")
                    .append(spec.getValue());

            if (spec.getUnit() != null && !spec.getUnit().isBlank()
                    && !spec.getValue().toLowerCase().contains(spec.getUnit().toLowerCase())) {
                builder.append(" ").append(spec.getUnit());
            }

            builder.append("\n");
        }

        return builder.toString().trim();
    }

    private SpecSeed spec(String name, String value, String unit, Integer sortOrder) {
        return new SpecSeed(name, value, unit, sortOrder);
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