package com.example.techstore.config;

import com.example.techstore.entity.Banner;
import com.example.techstore.enums.BannerPosition;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(40)
public class DemoBannerSeeder implements CommandLineRunner {

    private static final String DEMO_BANNER_IMAGE =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779470207/Yellow_Blue_and_Pink_Modern_New_Game_Banner_Landscape_pqdfqk.png";

    private final BannerRepository bannerRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedBanners();
    }

    private void seedBanners() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startAt = now.minusDays(1);
        LocalDateTime endAt = now.plusMonths(6);

        upsertBanner(
                "Mua PC tặng màn OLED 240Hz",
                DEMO_BANNER_IMAGE,
                "/products?keyword=pc",
                BannerPosition.HOME_TOP,
                1,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Laptop gaming giảm giá cực sốc",
                DEMO_BANNER_IMAGE,
                "/products?keyword=laptop",
                BannerPosition.HOME_TOP,
                2,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Màn hình LG 4K OLED 240Hz",
                DEMO_BANNER_IMAGE,
                "/products?keyword=lg",
                BannerPosition.HOME_TOP,
                3,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Build PC theo nhu cầu học tập và gaming",
                DEMO_BANNER_IMAGE,
                "/products?keyword=pc",
                BannerPosition.HOME_MIDDLE,
                1,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Phụ kiện gaming sale cuối tuần",
                DEMO_BANNER_IMAGE,
                "/products?keyword=gaming",
                BannerPosition.HOME_MIDDLE,
                2,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Giao hàng toàn quốc - Bảo hành chính hãng",
                DEMO_BANNER_IMAGE,
                "/faqs",
                BannerPosition.HOME_BOTTOM,
                1,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Deal sốc cuối tuần TechStore",
                DEMO_BANNER_IMAGE,
                "/products",
                BannerPosition.SIDEBAR,
                1,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );

        upsertBanner(
                "Hỗ trợ kỹ thuật tận nhà",
                DEMO_BANNER_IMAGE,
                "/contact",
                BannerPosition.SIDEBAR,
                2,
                startAt,
                endAt,
                ProductStatus.ACTIVE
        );
    }

    private void upsertBanner(
            String title,
            String imageUrl,
            String linkUrl,
            BannerPosition position,
            Integer sortOrder,
            LocalDateTime startAt,
            LocalDateTime endAt,
            ProductStatus status
    ) {
        Banner banner = findExistingBanner(title, position);

        if (banner == null) {
            banner = new Banner();
        }

        banner.setTitle(title);
        banner.setImageUrl(imageUrl);
        banner.setLinkUrl(linkUrl);
        banner.setPosition(position);
        banner.setSortOrder(sortOrder);
        banner.setStartAt(startAt);
        banner.setEndAt(endAt);
        banner.setStatus(status);
        banner.setDeletedAt(null);

        bannerRepository.save(banner);
    }

    private Banner findExistingBanner(String title, BannerPosition position) {
        List<Banner> banners = bannerRepository.findAll();

        return banners.stream()
                .filter(banner -> banner.getTitle() != null)
                .filter(banner -> banner.getTitle().equalsIgnoreCase(title))
                .filter(banner -> banner.getPosition() == position)
                .findFirst()
                .orElse(null);
    }
}