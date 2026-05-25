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
@Order(34)
public class DemoMouseSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";
    private static final Map<String, List<String>> MOUSE_IMAGES = Map.ofEntries(
            Map.entry("CHU-RAPOO-V260-PRO", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654044/chu-rapoo-v260-pro_01_osmmfs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654047/chu-rapoo-v260-pro_04_ngwfk5.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654051/chu-rapoo-v260-pro_05_pxervx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654054/chu-rapoo-v260-pro_06_bwyv2s.jpg"
            )),
            Map.entry("CHU-ASUS-TUF-M3-GENII", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654229/chu-asus-tuf-m3-genii_01_jmzwlb.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654232/chu-asus-tuf-m3-genii_04_qjkxe8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654236/chu-asus-tuf-m3-genii_05_zbscqz.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654240/chu-asus-tuf-m3-genii_06_aonnmt.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654244/chu-asus-tuf-m3-genii_07_bvab68.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654247/chu-asus-tuf-m3-genii_08_x3g0o3.jpg"
            )),
            Map.entry("CHU-ASUS-ROG-IMPACT-III-WL-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654417/chu-asus-rog-impact-iii-wl-white_04_doaj5u.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654421/chu-asus-rog-impact-iii-wl-white_05_ayvs5l.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654425/chu-asus-rog-impact-iii-wl-white_06_qneg6b.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654429/chu-asus-rog-impact-iii-wl-white_07_luan8v.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654432/chu-asus-rog-impact-iii-wl-white_08_khdlnq.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654436/chu-asus-rog-impact-iii-wl-white_09_xrhj1n.png"
            )),
            Map.entry("CHU-ASUS-ROG-IMPACT-III-WL", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654591/chu-asus-rog-impact-iii-wl_01_jrixoi.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654595/chu-asus-rog-impact-iii-wl_05_cixchp.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654599/chu-asus-rog-impact-iii-wl_06_rlxrfk.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654604/chu-asus-rog-impact-iii-wl_07_eecw3j.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654608/chu-asus-rog-impact-iii-wl_08_dwmsrf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654612/chu-asus-rog-impact-iii-wl_09_cztrcc.png"
            )),
            Map.entry("CHU-LOG-G502-HERO", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654736/chu-log-g502-hero_01_xp096n.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654740/chu-log-g502-hero_04_xtpiop.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654744/chu-log-g502-hero_05_aiaavo.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654748/chu-log-g502-hero_06_jhwxmg.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654753/chu-log-g502-hero_07_tkjth3.png"
            )),
            Map.entry("CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654956/chu-logitech-g-pro-x-superlight-2-black_01_mbzarf.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654960/chu-logitech-g-pro-x-superlight-2-black_04_jaltbq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654964/chu-logitech-g-pro-x-superlight-2-black_05_fxpigx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654968/chu-logitech-g-pro-x-superlight-2-black_06_xrjom7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654972/chu-logitech-g-pro-x-superlight-2-black_07_a2inro.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654976/chu-logitech-g-pro-x-superlight-2-black_08_vetfj8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654980/chu-logitech-g-pro-x-superlight-2-black_09_cc67fh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654984/chu-logitech-g-pro-x-superlight-2-black_10_pip271.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779654988/chu-logitech-g-pro-x-superlight-2-black_11_t6qb6g.jpg"
            )),
            Map.entry("CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-DEX-WL-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655215/chu-logitech-g-pro-x-superlight-2-dex-wl-white_01_owqeec.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655219/chu-logitech-g-pro-x-superlight-2-dex-wl-white_04_eqokyx.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655223/chu-logitech-g-pro-x-superlight-2-dex-wl-white_05_bumul8.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655228/chu-logitech-g-pro-x-superlight-2-dex-wl-white_06_asnwab.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655232/chu-logitech-g-pro-x-superlight-2-dex-wl-white_07_gzg4ym.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655236/chu-logitech-g-pro-x-superlight-2-dex-wl-white_08_atzixi.png"
            )),
            Map.entry("CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655368/chu-logitech-g-pro-x-superlight-2-white_01_froumk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655372/chu-logitech-g-pro-x-superlight-2-white_04_b5qeln.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655376/chu-logitech-g-pro-x-superlight-2-white_05_yezic1.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655381/chu-logitech-g-pro-x-superlight-2-white_06_jmqe8f.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655385/chu-logitech-g-pro-x-superlight-2-white_07_tapgnp.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655389/chu-logitech-g-pro-x-superlight-2-white_08_un0fme.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655394/chu-logitech-g-pro-x-superlight-2-white_09_woy0oi.jpg"
            )),
            Map.entry("CHU-RAZER-VIPER-V3-PRO-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655521/chu-razer-viper-v3-pro-white_01_eox8vt.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655525/chu-razer-viper-v3-pro-white_04_vheiwh.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655532/chu-razer-viper-v3-pro-white_05_g9zpx2.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655536/chu-razer-viper-v3-pro-white_06_vzkzim.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655542/chu-razer-viper-v3-pro-white_07_dpfqwa.png"
            )),
            Map.entry("CHU-RAZER-VIPER-V3-PRO-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655707/chu-razer-viper-v3-pro-blk_01_rzbacb.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655712/chu-razer-viper-v3-pro-blk_04_bap50m.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655716/chu-razer-viper-v3-pro-blk_05_ekxdxk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655721/chu-razer-viper-v3-pro-blk_06_snjc1n.jpg"
            )),
            Map.entry("CHU-ACER-CESTUS-330", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655865/chu-acer-predator-cestus-353_01_a80xfx.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655870/chu-acer-predator-cestus-353_04_j0kmqb.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779655875/chu-acer-predator-cestus-353_05_b8om8o.png"
            )),
            Map.entry("CHU-DAREU-EM911T-WHI", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656169/chu-dareu-em911t-blk_01_h8m1cg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656173/chu-dareu-em911t-blk_04_eoa5z1.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656178/chu-dareu-em911t-blk_05_tugzr9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656183/chu-dareu-em911t-blk_06_a1krpi.jpg"
            )),
            Map.entry("CHU-LOGITECH-X2-SUPERSTRIKE-LP", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656288/chu-logitech-x2-superstrike-lp_01_ifk125.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656293/chu-logitech-x2-superstrike-lp_04_x1fljj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656298/chu-logitech-x2-superstrike-lp_05_uplg6t.jpg"
            )),
            Map.entry("CHU-ASUS-P722-KERIS-II-ORIGIN-WL-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656399/chu-asus-p722-keris-ii-origin-wl-blk_01_c1asbf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656404/chu-asus-p722-keris-ii-origin-wl-blk_05_ymvnlq.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656408/chu-asus-p722-keris-ii-origin-wl-blk_06_a2nqvi.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656413/chu-asus-p722-keris-ii-origin-wl-blk_07_dhgy3n.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656451/chu-asus-p722-keris-ii-origin-wl-blk_08_xykq81.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656456/chu-asus-p722-keris-ii-origin-wl-blk_09_qisaqk.png"
            )),
            Map.entry("CHU-LOG-G102-LIGHTSYNC-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656610/chu-log-g102-lightsync-black_01_pzurem.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779656615/chu-log-g102-lightsync-black_04_zeabfz.jpg"
            ))
    );
    private static final String CATEGORY_SLUG = "chuot";
    private static final String CATEGORY_NAME = "Chuột";

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
        seedMice();
    }

    private void seedMice() {
        List<MouseSeed> mice = List.of(
                mouse("Chuột gaming có dây Rapoo V260 Pro", "Rapoo", "CHU-RAPOO-V260-PRO", "329000", 15),
                mouse("Chuột Asus TUF Gaming M3 Gen II", "ASUS", "CHU-ASUS-TUF-M3-GENII", "400000", 16),
                mouse("Chuột ASUS ROG Strix Impact III Wireless White", "ASUS", "CHU-ASUS-ROG-IMPACT-III-WL-WHITE", "1090000", 17),
                mouse("Chuột ASUS ROG Strix Impact III Wireless", "ASUS", "CHU-ASUS-ROG-IMPACT-III-WL", "1090000", 18),
                mouse("Chuột Logitech G502 Hero Gaming", "Logitech", "CHU-LOG-G502-HERO", "940000", 19),
                mouse("Chuột Logitech G Pro X Superlight 2 Black", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-BLACK", "3250000", 20),
                mouse("Chuột Logitech G Pro X Superlight 2 Dex Wireless White", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-DEX-WL-WHITE", "3250000", 21),
                mouse("Chuột Logitech G Pro X Superlight 2 White", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-WHITE", "3250000", 22),
                mouse("Chuột Razer Không dây Viper V3 Pro Trắng", "Razer", "CHU-RAZER-VIPER-V3-PRO-WHITE", "3690000", 23),
                mouse("Chuột Razer Không dây Viper V3 Pro Đen", "Razer", "CHU-RAZER-VIPER-V3-PRO-BLK", "3690000", 24),
                mouse("Chuột Logitech G Pro X Superlight 2 Dex Wireless Black", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-DEX-WL-BLACK", "3250000", 25),
                mouse("Chuột Logitech G Pro X Superlight 2 Dex Wireless Pink", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-DEX-WL-PINK", "3250000", 26),
                mouse("Chuột gaming Acer Predator Cestus 330", "ACER", "CHU-ACER-CESTUS-330", "1200000", 27),
                mouse("Chuột gaming không dây Predator Cestus 353", "ACER", "CHU-ACER-PREDATOR-CESTUS-353", "2500000", 28),
                mouse("Chuột Razer DeathAdder V4 Pro Black", "Razer", "CHU-RAZER-DA-V4-PRO-BLK", "3690000", 29),
                mouse("Chuột Razer Không dây Viper V4 Pro Trắng", "Razer", "CHU-RAZER-VIPER-V4-PRO-WHITE", "4490000", 30),
                mouse("Chuột Razer Không dây Viper V4 Pro Đen", "Razer", "CHU-RAZER-VIPER-V4-PRO-BLK", "4490000", 15),
                mouse("Chuột Logitech G Pro X Superlight 2 SE Black", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-SE-BLACK", "2740000", 16),
                mouse("Chuột không dây Razer Viper V3 Pro SE", "Razer", "CHU-RAZER-VIPER-V3-PRO-SE", "2370000", 17),
                mouse("Chuột DareU Không dây EM911T RGB Đen", "DareU", "CHU-DAREU-EM911T-BLK", "400000", 18),
                mouse("Chuột DareU Không dây EM911T RGB Trắng", "DareU", "CHU-DAREU-EM911T-WHI", "400000", 19),
                mouse("Chuột gaming không dây Logitech Pro X2 Superstrike Lightspeed", "Logitech", "CHU-LOGITECH-X2-SUPERSTRIKE-LP", "4690000", 20),
                mouse("Chuột Razer Viper V3 Pro Counter-Strike 2 Edition", "Razer", "CHU-RAZER-VIPER-V3-PRO-CS2", "4680000", 21),
                mouse("Chuột ASUS P722 ROG KERIS II Origin WL Black", "ASUS", "CHU-ASUS-P722-KERIS-II-ORIGIN-WL-BLK", "3350000", 22),
                mouse("Chuột Logitech G102 LightSync Black", "Logitech", "CHU-LOG-G102-LIGHTSYNC-BLACK", "400000", 23),
                mouse("Chuột Razer DeathAdder Essential (RZ01-03850100-R3M1)", "Razer", "CHU-RAZ-DA-ESSENTIAL", "370000", 24),
                mouse("Chuột Logitech G304 Wireless", "Logitech", "CHU-LOG-G304", "725000", 25),
                mouse("Chuột Razer Deathadder Essential White", "Razer", "CHU-RAZ-DE-WHI", "370000", 26),
                mouse("Chuột không dây ASUS TUF Gaming Mini Hatsune Miku", "ASUS", "CHU-ASUS-TUF-MINI-MIKU", "2490000", 27),
                mouse("Chuột không dây Logitech M331 Silent Black", "Logitech", "CHU-LOG-M331-SIL-BLA", "360000", 28),
                mouse("Chuột ASUS ROG Strix Impact III", "ASUS", "CHU-ASUS-ROG-IMPACT-III", "990000", 29),
                mouse("Chuột DareU EM901X RGB Superlight Wireless Pink", "DareU", "CHU-EM901X-RGB-SL-WL-PINK", "700000", 30),
                mouse("Chuột Logitech G102 LightSync White", "Logitech", "CHU-LOG-G102-LIGHTSYNC-WHITE", "400000", 15),
                mouse("Chuột DareU EM901X RGB Superlight Wireless Black", "DareU", "CHU-EM901X-RGB-SL-WL-BLACK", "700000", 16),
                mouse("Chuột Razer Basilisk V3", "Razer", "CHU-RAZ-BASI-V3", "940000", 17),
                mouse("Chuột Logitech G304 Wireless White", "Logitech", "CHU-LOG-G304-WL-WHITE", "725000", 18),
                mouse("Chuột Logitech Pebble Mouse 2 M350S Graphite", "Logitech", "CHU-LOGITECH-PEB-MOUSE-2-M350S-GRA", "470000", 19),
                mouse("Chuột không dây Logitech M331 Silent Blue", "Logitech", "CHU-LOG-M331-SIL-BLU", "360000", 20),
                mouse("Chuột Razer Cobra", "Razer", "CHU-RAZER-COBRA", "660000", 21),
                mouse("Chuột Logitech G Pro X Superlight Wireless Black", "Logitech", "CHU-LOG-G-PRO-X-SUP-W-BLA", "2530000", 22),
                mouse("Chuột Razer Basilisk V3 X HyperSpeed", "Razer", "CHU-RAZER-BASI-V3-X-HS", "1490000", 23),
                mouse("Chuột Gaming Asus TUF M4 Wireless", "ASUS", "CHU-ASUS-TUF-M4-WL", "990000", 24),
                mouse("Chuột Logitech Pebble Mouse 2 M350S Rose", "Logitech", "CHU-LOGITECH-PEB-MOUSE-2-M350S-ROSE", "490000", 25),
                mouse("Chuột Logitech MX Master 3S Graphite", "Logitech", "CHU-LOGITECH-MX-MASTER-3S-GRA", "2400000", 26),
                mouse("Chuột Logitech G502 X Plus LightSpeed White", "Logitech", "CHU-LOGITECH-G502X-PLUS-LS-WHITE", "3490000", 27),
                mouse("Chuột Logitech G309 Lightspeed Wireless Bluetooth Trắng", "Logitech", "CHU-LOG-G309-TRANG", "1630000", 28),
                mouse("Chuột Logitech G309 Lightspeed Wireless Bluetooth Đen", "Logitech", "CHU-LOG-G309-DEN", "1630000", 29),
                mouse("Chuột Logitech Pebble Mouse 2 M350S White", "Logitech", "CHU-LOGITECH-PEB-MOUSE-2-M350S-WHITE", "490000", 30),
                mouse("Chuột Logitech G Pro X Superlight Wireless White", "Logitech", "CHU-LOG-G-PRO-X-SUP-W-WHI", "2530000", 15),
                mouse("Chuột Logitech G Pro X Superlight 2 Magneta", "Logitech", "CHU-LOGITECH-G-PRO-X-SUPERLIGHT-2-MAG", "3250000", 16)
        );

        for (MouseSeed mouse : mice) {
            upsertMouse(mouse);
        }
    }

    private void upsertMouse(MouseSeed seed) {
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
        List<String> imageUrls = getMouseImages(seed.getSku());
        variant.setProduct(savedProduct);
        variant.setName("Phiên bản tiêu chuẩn");
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
    private List<String> getMouseImages(String sku) {
        return MOUSE_IMAGES.getOrDefault(sku, List.of(DEMO_IMAGE_URL));
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
            MouseSeed seed
    ) {
        List<SpecSeed> specs = List.of(
                spec("Hãng sản xuất", seed.getBrandName(), null, 1),
                spec("Bảo hành", "24 tháng", null, 2),
                spec("Loại chuột", inferMouseType(seed.getName()), null, 3),
                spec("Kết nối", inferConnection(seed.getName()), null, 4),
                spec("Độ nhạy DPI", "Đang cập nhật", null, 5),
                spec("Cảm biến", "Đang cập nhật", null, 6),
                spec("Số nút bấm", "Đang cập nhật", null, 7),
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
                            .description("Chuột máy tính, chuột gaming, chuột không dây và chuột văn phòng.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(5)
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

    private String buildDescription(MouseSeed seed) {
        return """
                %s là sản phẩm chuột máy tính thuộc thương hiệu %s, phù hợp cho nhu cầu làm việc, học tập và giải trí.

                Thông số nổi bật:
                - Hãng sản xuất: %s
                - Loại chuột: %s
                - Kết nối: %s
                - Bảo hành: 24 tháng
                """.formatted(
                seed.getName(),
                seed.getBrandName(),
                seed.getBrandName(),
                inferMouseType(seed.getName()),
                inferConnection(seed.getName())
        ).trim();
    }

    private String inferMouseType(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("gaming") || value.contains("rog") || value.contains("tuf")) {
            return "Chuột gaming";
        }

        if (value.contains("pebble") || value.contains("m331") || value.contains("mx master")) {
            return "Chuột văn phòng";
        }

        return "Chuột máy tính";
    }

    private String inferConnection(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("không dây")
                        || value.contains("wireless")
                        || value.contains("lightspeed")
                        || value.contains("bluetooth")
        ) {
            return "Không dây";
        }

        if (value.contains("có dây")) {
            return "Có dây";
        }

        return "Có dây / Không dây tùy phiên bản";
    }

    private MouseSeed mouse(
            String name,
            String brandName,
            String sku,
            String price,
            Integer stock
    ) {
        return new MouseSeed(
                name,
                generateSlug(name),
                brandName,
                sku,
                price,
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
    private static class MouseSeed {
        private String name;
        private String slug;
        private String brandName;
        private String sku;
        private String price;
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