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
@Order(36)
public class DemoHeadsetSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";
    private static final Map<String, List<String>> HEADSET_IMAGES = Map.ofEntries(
            Map.entry("TAI-HP-HYPERX-CLOUD-EARBUDS-II-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658574/tai-hp-hyperx-cloud-earbuds-ii-black_01_magz9r.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658586/tai-hp-hyperx-cloud-earbuds-ii-black_04_cwjyw7.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658592/tai-hp-hyperx-cloud-earbuds-ii-black_05_knxcya.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658597/tai-hp-hyperx-cloud-earbuds-ii-black_06_q45m3z.gif"
            )),
            Map.entry("TAI-ACER-PRE-GALEA-550-WL", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658730/tai-acer-pre-galea-550-wl_01_ftholv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658735/tai-acer-pre-galea-550-wl_04_af9srz.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658740/tai-acer-pre-galea-550-wl_05_imdcas.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658745/tai-acer-pre-galea-550-wl_06_u505yw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658751/tai-acer-pre-galea-550-wl_07_eudjpr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658756/tai-acer-pre-galea-550-wl_08_slklfh.jpg"
            )),
            Map.entry("TAI-AKKO-VERGE-S9-ULTRA-WHI", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658872/tai-akko-verge-s9-ultra-whi_01_yyeh2m.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658877/tai-akko-verge-s9-ultra-whi_04_xy0wgh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658882/tai-akko-verge-s9-ultra-whi_05_vbygvh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658887/tai-akko-verge-s9-ultra-whi_06_tgno5b.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658893/tai-akko-verge-s9-ultra-whi_07_zlfkda.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779658898/tai-akko-verge-s9-ultra-whi_08_whmywe.jpg"
            )),
            Map.entry("TAI-AKKO-GH300-WHI", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659064/tai-akko-gh300-whi_01_n6jbeg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659069/tai-akko-gh300-whi_04_rr6l2e.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659074/tai-akko-gh300-whi_05_b7timy.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659080/tai-akko-gh300-whi_06_n9nxkv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659085/tai-akko-gh300-whi_07_krolym.jpg"
            )),
            Map.entry("TAI-LOGITECH-G325-LIGHTSPEED-WHI", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659245/tai-logitech-g325-lightspeed-whi_01_qj6mrk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659251/tai-logitech-g325-lightspeed-whi_04_zsx9sv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659257/tai-logitech-g325-lightspeed-whi_05_xnqt5o.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659263/tai-logitech-g325-lightspeed-whi_06_gqztyj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659268/tai-logitech-g325-lightspeed-whi_07_apn1ab.jpg"
            )),
            Map.entry("TAI-ASUS-ROG-PELTA-WL-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659413/tai-asus-rog-pelta-wl-blk_01_pakenm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659418/tai-asus-rog-pelta-wl-blk_04_jbgv4e.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659424/tai-asus-rog-pelta-wl-blk_05_wkshzh.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659430/tai-asus-rog-pelta-wl-blk_06_sljthj.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659435/tai-asus-rog-pelta-wl-blk_07_e2niid.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659441/tai-asus-rog-pelta-wl-blk_08_s2otef.png"
            )),
            Map.entry("TAI-ASU-ROG-CETRA-II-CORE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659588/tai-asu-rog-cetra-ii-core_01_fdyttd.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659593/tai-asu-rog-cetra-ii-core_04_bon7u3.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659598/tai-asu-rog-cetra-ii-core_05_dad9ol.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659604/tai-asu-rog-cetra-ii-core_06_lox8dw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659611/tai-asu-rog-cetra-ii-core_08_umk17f.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659616/tai-asu-rog-cetra-ii-core_09_xtro4u.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659622/tai-asu-rog-cetra-ii-core_10_uwzuzj.jpg"
            )),
            Map.entry("TAI-LOGITECH-G321-LIGHTSPEED-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659758/tai-logitech-g321-lightspeed-blk_01_s2gy89.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659764/tai-logitech-g321-lightspeed-blk_05_siyvjq.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659769/tai-logitech-g321-lightspeed-blk_06_qjnpmv.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659775/tai-logitech-g321-lightspeed-blk_07_pj2bxd.png"
            )),
            Map.entry("TAI-RAZER-BLACKSHARK-V3-PRO-CS2", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659873/tai-razer-blackshark-v3-pro-cs2_01_nguzob.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659878/tai-razer-blackshark-v3-pro-cs2_04_veggh0.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659884/tai-razer-blackshark-v3-pro-cs2_05_yjmae8.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659889/tai-razer-blackshark-v3-pro-cs2_06_twinq7.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779659895/tai-razer-blackshark-v3-pro-cs2_07_d1jj1y.png"
            )),
            Map.entry("TAI-HYPERX-CLOUD-FLIGHT-2-WL-B5VC4AA", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660034/tai-hyperx-cloud-flight-2-wl-b5vc4aa_01_hlmgd3.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660039/tai-hyperx-cloud-flight-2-wl-b5vc4aa_04_phjxkr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660045/tai-hyperx-cloud-flight-2-wl-b5vc4aa_05_dj60vv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660051/tai-hyperx-cloud-flight-2-wl-b5vc4aa_06_tzroe9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660057/tai-hyperx-cloud-flight-2-wl-b5vc4aa_07_tscm2e.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660062/tai-hyperx-cloud-flight-2-wl-b5vc4aa_08_hf5f58.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660068/tai-hyperx-cloud-flight-2-wl-b5vc4aa_09_horknn.jpg"
            )),
            Map.entry("TAI-RAZER-BARRACUDA-X-CHROMA-PHANTOM-WHITE", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660262/tai-razer-barracuda-x-chroma-phantom-white_01_enmu7b.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660267/tai-razer-barracuda-x-chroma-phantom-white_04_o1fpyw.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660273/tai-razer-barracuda-x-chroma-phantom-white_05_rf3de6.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660279/tai-razer-barracuda-x-chroma-phantom-white_06_eh7u0e.png"
            )),
            Map.entry("TAI-DAR-EH416-RGB", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660391/tai-dar-eh416-rgb_01_n5wbum.jpg"
            )),
            Map.entry("TAI-LOG-G435-LW-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660512/tai-log-g435-lw-black_01_nxuqjq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660518/tai-log-g435-lw-black_04_mtjla7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660524/tai-log-g435-lw-black_05_y1dhcd.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660530/tai-log-g435-lw-black_06_wf8xuq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660535/tai-log-g435-lw-black_07_j8osnu.jpg"
            )),
            Map.entry("TAI-LOG-G733-LS-WL-BL", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660656/tai-log-g733-ls-wl-bl_01_cgveo0.png"
            )),
            Map.entry("TAI-HS55-WL-CORE-BLACK-CA-9011290-AP", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660746/tai-corsair-h35-v2-carbon_01_ztdjkj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660752/tai-corsair-h35-v2-carbon_04_mpt7kq.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660758/tai-corsair-h35-v2-carbon_05_j7w0xv.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660764/tai-corsair-h35-v2-carbon_06_govcxt.png"
            )),
            Map.entry("TAI-RAPOO-VH160", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660908/tai-rapoo-vh160_01_plikmc.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660914/tai-rapoo-vh160_04_qeu2tl.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660920/tai-rapoo-vh160_05_euvnge.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660927/tai-rapoo-vh160_06_vzujpd.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779660933/tai-rapoo-vh160_07_irpewr.png"
            )),
            Map.entry("TAI-RAZER-BARRACUDA-X-2022", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661098/tai-razer-barracuda-x-2022_01_wr68tn.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661104/tai-razer-barracuda-x-2022_07_hzrh9u.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661110/tai-razer-barracuda-x-2022_08_bzzekw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661117/tai-razer-barracuda-x-2022_09_loa9l1.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661123/tai-razer-barracuda-x-2022_10_ou0tfh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661129/tai-razer-barracuda-x-2022_11_hxhhk6.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661135/tai-razer-barracuda-x-2022_12_g5gp5f.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661141/tai-razer-barracuda-x-2022_13_ow3gzq.png"
            )),
            Map.entry("TAI-HP-HYPERX-CLOUD-III-RED", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661327/tai-hp-hyperx-cloud-iii-red_01_cl4rnd.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661333/tai-hp-hyperx-cloud-iii-red_06_qetfal.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661339/tai-hp-hyperx-cloud-iii-red_07_t9kvah.gif"
            )),
            Map.entry("TAI-ONIKUMA-INEAR-T209-LIVE-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661592/tai-onikuma-inear-t209-live-blk_01_lmdvrq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661598/tai-onikuma-inear-t209-live-blk_04_qgmtbd.jpg"
            )),
            Map.entry("TAI-ONIKUMA-INEAR-T18-ENC-BT-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661710/tai-onikuma-inear-t18-enc-bt-blk_01_kjdipf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661717/tai-onikuma-inear-t18-enc-bt-blk_04_lygu2d.png"
            )),
            Map.entry("TAI-RAZER-KRAKEN-KITTY-V2-BT-QUARTZ", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661821/tai-razer-kraken-kitty-v2-bt-quartz_01_bbr2o3.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661828/tai-razer-kraken-kitty-v2-bt-quartz_04_u1o8ow.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661834/tai-razer-kraken-kitty-v2-bt-quartz_05_eqqkev.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661841/tai-razer-kraken-kitty-v2-bt-quartz_06_y16vuo.png"
            )),
            Map.entry("TAI-HP-HYPERX-CLOUD-JET-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661933/tai-hp-hyperx-cloud-jet-black_01_ljo3bj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661939/tai-hp-hyperx-cloud-jet-black_04_aww1gx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661946/tai-hp-hyperx-cloud-jet-black_05_ph9ihh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661952/tai-hp-hyperx-cloud-jet-black_06_ytwivw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779661959/tai-hp-hyperx-cloud-jet-black_07_t90mhq.jpg"
            )),
            Map.entry("TAI-EDRA-EH414W-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779662055/tai-edra-eh414w-blk_01_s3lgb1.png"
            ))
    );
    private static final String CATEGORY_SLUG = "tai-nghe";
    private static final String CATEGORY_NAME = "Tai nghe";

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
        seedHeadsets();
    }

    private void seedHeadsets() {
        List<HeadsetSeed> headsets = List.of(
                headset("Tai nghe HP HYPERX Cloud Earbuds II Black", "HyperX", "TAI-HP-HYPERX-CLOUD-EARBUDS-II-BLACK", "750000", 10),
                headset("Tai nghe gaming không dây Logitech Astro A20 X", "Logitech", "TAI-LOGITECH-AX20", "3590000", 10),
                headset("Tai nghe gaming Acer Predator Galea 550 Wireless", "ACER", "TAI-ACER-PRE-GALEA-550-WL", "3000000", 10),
                headset("Tai nghe gaming không dây Akko Verge S9 Ultra White", "AKKO", "TAI-AKKO-VERGE-S9-ULTRA-WHI", "1390000", 10),
                headset("Tai nghe không dây AKKO GH300 White", "AKKO", "TAI-AKKO-GH300-WHI", "890000", 10),
                headset("Tai nghe không dây Logitech G325 LIGHTSPEED White", "Logitech", "TAI-LOGITECH-G325-LIGHTSPEED-WHI", "2390000", 10),
                headset("Tai nghe Razer Hammerhead V3 Wired Earbuds", "Razer", "TAI-RAZ-HAMER-V3-EARBUDS", "1260000", 10),
                headset("Tai nghe Asus ROG Pelta WL RGB Black", "ASUS", "TAI-ASUS-ROG-PELTA-WL-BLK", "3190000", 10),
                headset("Tai nghe Asus ROG Cetra II Core", "ASUS", "TAI-ASU-ROG-CETRA-II-CORE", "990000", 10),
                headset("Tai nghe không dây Logitech G321 LIGHTSPEED Black", "Logitech", "TAI-LOGITECH-G321-LIGHTSPEED-BLK", "1380000", 10),
                headset("Tai nghe không dây Razer Blackshark V3 Pro Counter-Strike 2 Edition", "Razer", "TAI-RAZER-BLACKSHARK-V3-PRO-CS2", "7780000", 10),
                headset("Tai nghe không dây HyperX Cloud Flight 2 WL Black", "HyperX", "TAI-HYPERX-CLOUD-FLIGHT-2-WL-B5VC4AA", "3190000", 10),
                headset("Tai nghe Razer Barracuda X Chroma Phantom White Edition", "Razer", "TAI-RAZER-BARRACUDA-X-CHROMA-PHANTOM-WHITE", "3680000", 10),
                headset("Tai nghe DareU EH416 RGB", "DareU", "TAI-DAR-EH416-RGB", "390000", 10),
                headset("Tai nghe Logitech G435 Lightspeed Wireless Black", "Logitech", "TAI-LOG-G435-LW-BLACK", "1390000", 10),
                headset("Tai nghe Logitech G733 LIGHTSPEED Wireless Black", "Logitech", "TAI-LOG-G733-LS-WL-BL", "2440000", 10),
                headset("Tai nghe Corsair HS55 Wireless Core Black", "Corsair", "TAI-HS55-WL-CORE-BLACK-CA-9011290-AP", "1590000", 10),
                headset("Tai nghe Gaming Rapoo VH160", "Rapoo", "TAI-RAPOO-VH160", "690000", 10),
                headset("Tai nghe Razer Barracuda X 2022", "Razer", "TAI-RAZER-BARRACUDA-X-2022", "2490000", 10),
                headset("Tai nghe HP HyperX Cloud III Red", "HyperX", "TAI-HP-HYPERX-CLOUD-III-RED", "2290000", 10),
                headset("Tai nghe MSI H991", "MSI", "TAI-MSI-H991", "1400000", 10),
                headset("Tai nghe Logitech G Pro X Gaming Black", "Logitech", "TAI-LOG-G-PRO-X", "2420000", 10),
                headset("Tai nghe Logitech G333 Black", "Logitech", "TAI-LOG-G333-BLA", "910000", 10),
                headset("Tai nghe Razer Kraken V3 X USB", "Razer", "TAI-RAZ-KRA-V3X-USB", "1250000", 10),
                headset("Tai nghe DAREU EH469 7.1 RGB Black", "DareU", "TAI-DAR-EH469-RGB-BLA", "400000", 10),
                headset("Tai nghe E-Dra EH494W Black", "E-Dra", "TAI-EDRA-EH494W-BLACK", "950000", 10),
                headset("Tai nghe HyperX Cloud Stinger Core II", "HyperX", "TAI-HYPERX-STINGER-CORE-II", "790000", 10),
                headset("Tai nghe Razer BlackShark V2 X", "Razer", "TAI-RAZ-BLACK-SHARK-V2-X", "990000", 10),
                headset("Tai nghe Logitech G PRO X 2 LIGHTSPEED Black", "Logitech", "TAI-LOGITECH-G-PRO-X2-LS-BLACK", "4970000", 10),
                headset("Tai nghe Bluetooth SoundPeats Air 3 Pro", "Soundpeats", "TAI-SPEAT-AIR-3-PRO", "1590000", 10),
                headset("Tai nghe Corsair HS35 Surround v2 Carbon", "Corsair", "TAI-CORSAIR-H35-SUR-V2-CARBON", "1290000", 10),
                headset("Tai nghe Corsair HS35 V2 Carbon", "Corsair", "TAI-CORSAIR-H35-V2-CARBON", "890000", 10),
                headset("Tai nghe Steelseries Arctis Nova 7 Dragon Edition", "Steelseries", "TAI-STEEL-ARCTIS-NOVA-7-DE", "3990000", 10),
                headset("Tai nghe Onikuma In-ear T209 Bluetooth Live Translation Đen", "ONIKUMA", "TAI-ONIKUMA-INEAR-T209-LIVE-BLK", "590000", 10),
                headset("Tai nghe Onikuma In-ear T18 ENC Bluetooth Đen", "ONIKUMA", "TAI-ONIKUMA-INEAR-T18-ENC-BT-BLK", "590000", 10),
                headset("Tai nghe Razer Kraken Kitty V2 BT Quartz", "Razer", "TAI-RAZER-KRAKEN-KITTY-V2-BT-QUARTZ", "2680000", 10),
                headset("Tai nghe HP HyperX Cloud JET Black Wireless", "HyperX", "TAI-HP-HYPERX-CLOUD-JET-BLACK", "1690000", 0),
                headset("Tai nghe E-Dra EH414W Black", "E-Dra", "TAI-EDRA-EH414W-BLK", "990000", 10)
        );

        for (HeadsetSeed headset : headsets) {
            upsertHeadset(headset);
        }
    }

    private void upsertHeadset(HeadsetSeed seed) {
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
        List<String> imageUrls = getHeadsetImages(seed.getSku());
        variant.setProduct(savedProduct);
        variant.setName("Phiên bản tiêu chuẩn");
        variant.setSku(seed.getSku());
        variant.setPrice(priceValue);
        variant.setSalePrice(salePriceValue);
        variant.setSaleStartAt(LocalDateTime.now().minusDays(7));
        variant.setSaleEndAt(LocalDateTime.now().plusDays(120));
        variant.setStock(seed.getStock());
        variant.setThumbnailUrl(imageUrls.get(0));
        variant.setStatus(seed.getStock() > 0 ? ProductStatus.ACTIVE : ProductStatus.INACTIVE);

        productVariantRepository.save(variant);

        overwriteProductImages(savedProduct, imageUrls);
        overwriteSpecifications(savedProduct, category, seed);
    }
    private List<String> getHeadsetImages(String sku) {
        return HEADSET_IMAGES.getOrDefault(sku, List.of(DEMO_IMAGE_URL));
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
            HeadsetSeed seed
    ) {
        List<SpecSeed> specs = List.of(
                spec("Hãng sản xuất", seed.getBrandName(), null, 1),
                spec("Bảo hành", "24 tháng", null, 2),
                spec("Loại tai nghe", inferHeadsetType(seed.getName()), null, 3),
                spec("Kiểu kết nối", inferConnection(seed.getName()), null, 4),
                spec("Microphone", inferMicrophone(seed.getName()), null, 5),
                spec("LED", inferLed(seed.getName()), null, 6),
                spec("Tương thích", "PC, laptop, điện thoại và thiết bị chơi game hỗ trợ kết nối phù hợp", null, 7),
                spec("Tình trạng", seed.getStock() > 0 ? "Còn hàng" : "Hết hàng", null, 8)
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
                            .description("Tai nghe gaming, tai nghe không dây, tai nghe in-ear và phụ kiện âm thanh.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(6)
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
                            .description(brandName + " là thương hiệu thiết bị âm thanh và phụ kiện máy tính.")
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return brandRepository.save(brand);
                });
    }

    private BigDecimal makeSalePrice(BigDecimal price) {
        return price.multiply(new BigDecimal("0.95"))
                .setScale(0, RoundingMode.HALF_UP);
    }

    private String buildDescription(HeadsetSeed seed) {
        return """
                %s là sản phẩm tai nghe thuộc thương hiệu %s, phù hợp cho nhu cầu chơi game, học tập, làm việc và giải trí.

                Thông số nổi bật:
                - Hãng sản xuất: %s
                - Loại tai nghe: %s
                - Kiểu kết nối: %s
                - Microphone: %s
                - LED: %s
                - Bảo hành: 24 tháng
                """.formatted(
                seed.getName(),
                seed.getBrandName(),
                seed.getBrandName(),
                inferHeadsetType(seed.getName()),
                inferConnection(seed.getName()),
                inferMicrophone(seed.getName()),
                inferLed(seed.getName())
        ).trim();
    }

    private String inferHeadsetType(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("earbuds")
                        || value.contains("in-ear")
                        || value.contains("cetra")
                        || value.contains("g333")
                        || value.contains("air 3 pro")
        ) {
            return "Tai nghe in-ear";
        }

        if (
                value.contains("gaming")
                        || value.contains("rog")
                        || value.contains("kraken")
                        || value.contains("blackshark")
                        || value.contains("cloud")
                        || value.contains("g pro")
                        || value.contains("arctis")
        ) {
            return "Tai nghe gaming";
        }

        return "Tai nghe máy tính";
    }

    private String inferConnection(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("không dây")
                        || value.contains("wireless")
                        || value.contains("lightspeed")
                        || value.contains("bluetooth")
                        || value.contains("wl")
                        || value.contains("bt")
        ) {
            return "Không dây";
        }

        if (value.contains("usb")) {
            return "USB";
        }

        if (
                value.contains("earbuds")
                        || value.contains("in-ear")
                        || value.contains("wired")
                        || value.contains("cetra")
                        || value.contains("g333")
        ) {
            return "Có dây";
        }

        return "Có dây / Không dây tùy phiên bản";
    }

    private String inferMicrophone(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("earbuds")
                        || value.contains("in-ear")
                        || value.contains("cetra")
                        || value.contains("g333")
                        || value.contains("air 3 pro")
        ) {
            return "Micro tích hợp";
        }

        return "Có micro";
    }

    private String inferLed(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("rgb")) {
            return "RGB";
        }

        return "Không";
    }

    private HeadsetSeed headset(
            String name,
            String brandName,
            String sku,
            String price,
            Integer stock
    ) {
        return new HeadsetSeed(
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
    private static class HeadsetSeed {
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