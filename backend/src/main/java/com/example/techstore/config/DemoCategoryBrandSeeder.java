package com.example.techstore.config;

import com.example.techstore.entity.Brand;
import com.example.techstore.entity.Category;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.BrandRepository;
import com.example.techstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(2)
public class DemoCategoryBrandSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    @Override
    public void run(String... args) {
        seedCategories();
        seedBrands();
    }

    private void seedCategories() {
        createCategoryIfNotExists(
                "Laptop",
                "laptop",
                "Các dòng laptop học tập, văn phòng, gaming và đồ họa.",
                "https://cdn-icons-png.flaticon.com/512/3474/3474360.png",
                1
        );

        createCategoryIfNotExists(
                "Laptop Gaming",
                "laptop-gaming",
                "Laptop gaming hiệu năng cao cho game thủ.",
                "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
                2
        );

        createCategoryIfNotExists(
                "PC Gaming",
                "pc-gaming",
                "Máy tính để bàn gaming, workstation và build PC.",
                "https://cdn-icons-png.flaticon.com/512/3474/3474366.png",
                3
        );

        createCategoryIfNotExists(
                "Màn hình",
                "man-hinh",
                "Màn hình gaming, màn hình đồ họa, màn hình văn phòng.",
                "https://cdn-icons-png.flaticon.com/512/3474/3474362.png",
                4
        );

        createCategoryIfNotExists(
                "Chuột",
                "chuot",
                "Chuột gaming, chuột văn phòng, chuột không dây.",
                "https://cdn-icons-png.flaticon.com/512/3474/3474368.png",
                5
        );

        createCategoryIfNotExists(
                "Bàn phím",
                "ban-phim",
                "Bàn phím cơ, bàn phím gaming, bàn phím văn phòng.",
                "https://cdn-icons-png.flaticon.com/512/2659/2659360.png",
                6
        );

        createCategoryIfNotExists(
                "Tai nghe",
                "tai-nghe",
                "Tai nghe gaming, tai nghe bluetooth, headset.",
                "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
                7
        );

        createCategoryIfNotExists(
                "Linh kiện PC",
                "linh-kien-pc",
                "CPU, RAM, VGA, mainboard, SSD, nguồn máy tính.",
                "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
                8
        );

        createCategoryIfNotExists(
                "Ghế Gaming",
                "ghe-gaming",
                "Ghế gaming, ghế công thái học.",
                "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
                9
        );

        createCategoryIfNotExists(
                "Phụ kiện",
                "phu-kien",
                "Phụ kiện máy tính, hub, cáp, balo, lót chuột.",
                "https://cdn-icons-png.flaticon.com/512/679/679720.png",
                10
        );
    }

    private void seedBrands() {
        createBrandIfNotExists(
                "ASUS",
                "asus",
                "Thương hiệu laptop, linh kiện và thiết bị gaming.",
                "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg"
        );

        createBrandIfNotExists(
                "MSI",
                "msi",
                "Thương hiệu gaming laptop, mainboard, VGA.",
                "https://upload.wikimedia.org/wikipedia/commons/1/13/Msi-Logo.jpg"
        );

        createBrandIfNotExists(
                "Lenovo",
                "lenovo",
                "Thương hiệu laptop văn phòng, gaming và doanh nghiệp.",
                "https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg"
        );

        createBrandIfNotExists(
                "Acer",
                "acer",
                "Thương hiệu laptop, màn hình và thiết bị công nghệ.",
                "https://upload.wikimedia.org/wikipedia/commons/0/00/Acer_2011.svg"
        );

        createBrandIfNotExists(
                "Apple",
                "apple",
                "Thương hiệu MacBook, iMac và thiết bị cao cấp.",
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        );

        createBrandIfNotExists(
                "Dell",
                "dell",
                "Thương hiệu laptop, màn hình và máy trạm.",
                "https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg"
        );

        createBrandIfNotExists(
                "LG",
                "lg",
                "Thương hiệu màn hình, thiết bị hiển thị và điện tử.",
                "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg"
        );

        createBrandIfNotExists(
                "Samsung",
                "samsung",
                "Thương hiệu màn hình, SSD và thiết bị công nghệ.",
                "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
        );

        createBrandIfNotExists(
                "Logitech",
                "logitech",
                "Thương hiệu chuột, bàn phím và phụ kiện.",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Logitech_logo.svg"
        );

        createBrandIfNotExists(
                "Razer",
                "razer",
                "Thương hiệu thiết bị gaming cao cấp.",
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Razer_wordmark.svg"
        );

        createBrandIfNotExists(
                "Akko",
                "akko",
                "Thương hiệu bàn phím cơ và phụ kiện gaming.",
                "https://placehold.co/300x120?text=AKKO"
        );

        createBrandIfNotExists(
                "Gigabyte",
                "gigabyte",
                "Thương hiệu mainboard, VGA, laptop gaming.",
                "https://upload.wikimedia.org/wikipedia/commons/c/c3/Gigabyte_Technology_logo_20080107.svg"
        );

        createBrandIfNotExists(
                "Intel",
                "intel",
                "Thương hiệu CPU và linh kiện máy tính.",
                "https://upload.wikimedia.org/wikipedia/commons/6/64/Intel-logo-2022.png"
        );

        createBrandIfNotExists(
                "AMD",
                "amd",
                "Thương hiệu CPU và GPU hiệu năng cao.",
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg"
        );

        createBrandIfNotExists(
                "NVIDIA",
                "nvidia",
                "Thương hiệu GPU và công nghệ đồ họa.",
                "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg"
        );
    }

    private void createCategoryIfNotExists(
            String name,
            String slug,
            String description,
            String imageUrl,
            Integer sortOrder
    ) {
        if (categoryRepository.existsBySlug(slug)) {
            return;
        }

        Category category = Category.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .imageUrl(imageUrl)
                .sortOrder(sortOrder)
                .status(ProductStatus.ACTIVE)
                .build();

        categoryRepository.save(category);
    }

    private void createBrandIfNotExists(
            String name,
            String slug,
            String description,
            String logoUrl
    ) {
        if (brandRepository.existsBySlug(slug)) {
            return;
        }

        Brand brand = Brand.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .logoUrl(logoUrl)
                .status(ProductStatus.ACTIVE)
                .build();

        brandRepository.save(brand);
    }
}