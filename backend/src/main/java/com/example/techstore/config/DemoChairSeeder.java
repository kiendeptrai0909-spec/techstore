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
@Order(38)
public class DemoChairSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";
    private static final Map<String, List<String>> CHAIR_IMAGES = Map.ofEntries(
            Map.entry("GHE-WARRIOR-PAWN-WEC105-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663201/ghe-warrior-pawn-wec105-black_01_chhq2t.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663207/ghe-warrior-pawn-wec105-black_04_vpptib.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663214/ghe-warrior-pawn-wec105-black_05_p33fzx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663220/ghe-warrior-pawn-wec105-black_06_nrnyqm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663227/ghe-warrior-pawn-wec105-black_07_sgvhq7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663234/ghe-warrior-pawn-wec105-black_08_kxem07.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663240/ghe-warrior-pawn-wec105-black_09_kvqnrv.jpg"
            )),
            Map.entry("GHE-WAR-HERO-WEC502-GREY", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663375/ghe-war-hero-wec502-grey_01_hyush6.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663382/ghe-war-hero-wec502-grey_04_u2fyac.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663388/ghe-war-hero-wec502-grey_05_uixkfq.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663395/ghe-war-hero-wec502-grey_06_wsien7.gif",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663402/ghe-war-hero-wec502-grey_07_jrtgwv.gif"
            )),
            Map.entry("GHE-ISKUR-V2-NEWGEN-BLK-GREEN-RZ38-05310700-R3CA", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663607/ghe-iskur-v2-newgen-blk-green-rz38-05310700-r3ca_01_czjrtj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663614/ghe-iskur-v2-newgen-blk-green-rz38-05310700-r3ca_04_ckgf4n.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663621/ghe-iskur-v2-newgen-blk-green-rz38-05310700-r3ca_05_hu7cyy.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663628/ghe-iskur-v2-newgen-blk-green-rz38-05310700-r3ca_06_ssbeni.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663635/ghe-iskur-v2-newgen-blk-green-rz38-05310700-r3ca_07_z3yobx.jpg"
            )),
            Map.entry("GHE-EDRA-EEC228", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663731/ghe-edra-eec228_01_tfhour.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663738/ghe-edra-eec228_05_okhjyl.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663745/ghe-edra-eec228_06_eryleq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663752/ghe-edra-eec228_07_tzrzyf.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663759/ghe-edra-eec228_08_qqoonp.jpg"
            )),
            Map.entry("GHE-RAZER-ENKI-BLK-GREEN-RZ38-03720100-R3U1", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663880/ghe-razer-enki-full-blk-rz38-03720300-r3u1_01_p6phna.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663891/ghe-razer-enki-full-blk-rz38-03720300-r3u1_04_dryrev.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663901/ghe-razer-enki-full-blk-rz38-03720300-r3u1_05_hqri0k.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663908/ghe-razer-enki-full-blk-rz38-03720300-r3u1_06_jdowqm.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779663916/ghe-razer-enki-full-blk-rz38-03720300-r3u1_07_haav64.png"
            )),
            Map.entry("GHE-WARRIOR-RAIDER-WGC207-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664125/ghe-warrior-raider-wgc207-black_01_wa4lr2.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664142/ghe-warrior-raider-wgc207-black_04_dyokms.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664148/ghe-warrior-raider-wgc207-black_05_gcbzhz.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664156/ghe-warrior-raider-wgc207-black_06_se9gvp.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664164/ghe-warrior-raider-wgc207-black_07_kwy4jj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664171/ghe-warrior-raider-wgc207-black_08_eqxsu1.jpg"
            )),
            Map.entry("GHE-EDRA-EGC-229", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664321/ghe-edra-egc229-black-grey_01_ojkmrp.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664328/ghe-edra-egc229-black-grey_04_m8gsgm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664336/ghe-edra-egc229-black-grey_05_vybv7d.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664343/ghe-edra-egc229-black-grey_06_uileg8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664350/ghe-edra-egc229-black-grey_07_cyeaaw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664358/ghe-edra-egc229-black-grey_08_tohak4.jpg"
            )),
            Map.entry("GHE-WAR-HERO-WEC509-BLA-RED", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664631/ghe-war-hero-wec509-bla-red_01_keafvk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664639/ghe-war-hero-wec509-bla-red_05_zfd3py.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664647/ghe-war-hero-wec509-bla-red_06_xjn9q8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664654/ghe-war-hero-wec509-bla-red_07_fgautz.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664662/ghe-war-hero-wec509-bla-red_08_akucqy.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664669/ghe-war-hero-wec509-bla-red_09_jvl8wc.jpg"
            )),
            Map.entry("GHE-EDRA-HER-EGC203-BLA", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664811/ghe-edra-her-egc203-bla_01_aff1lr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664819/ghe-edra-her-egc203-bla_17_a5e0vx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664826/ghe-edra-her-egc203-bla_18_cgou1e.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664834/ghe-edra-her-egc203-bla_19_b2x6nn.jpg"
            )),
            Map.entry("GHE-WARRIOR-IMMORTAL-SERIES-WGC225-BLK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664941/ghe-warrior-immortal-series-wgc225-blk_01_ox2981.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664950/ghe-warrior-immortal-series-wgc225-blk_05_zpq9hm.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664957/ghe-warrior-immortal-series-wgc225-blk_06_fk5cjk.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779664965/ghe-warrior-immortal-series-wgc225-blk_07_iutbxq.png"
            )),
            Map.entry("GHE-COR-T3-RUSH-CHAR-2023", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665079/ghe-cor-t3-rush-char-2023_01_mf9xyy.png"
            )),
            Map.entry("GHE-SIHOO-M57", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665153/ghe-sihoo-m57_01_lbrmpa.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665161/ghe-sihoo-m57_04_pu4smo.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665168/ghe-sihoo-m57_05_cokrwo.jpg"
            )),
            Map.entry("GHE-SIHOO-M102C", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665280/ghe-sihoo-m102c_01_sjjmto.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665288/ghe-sihoo-m102c_04_v6lygn.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665296/ghe-sihoo-m102c_05_giyhio.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665304/ghe-sihoo-m102c_06_rk9fez.png"
            )),
            Map.entry("GHE-COR-TC500-LUXE-SHADOW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665374/ghe-cor-tc500-luxe-shadow_01_plozvt.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665397/ghe-cor-tc500-luxe-shadow_05_krpw4s.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665405/ghe-cor-tc500-luxe-shadow_06_xc8grq.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665413/ghe-cor-tc500-luxe-shadow_07_lzq7qg.png"
            )),
            Map.entry("GHE-EDRA-EGC231-WD-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665520/ghe-edra-egc231-wd-black_01_qms2vl.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665528/ghe-edra-egc231-wd-black_04_dlsatq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665536/ghe-edra-egc231-wd-black_05_e9birm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665544/ghe-edra-egc231-wd-black_06_rcr6zn.jpg"
            )),
            Map.entry("GHE-CORSAIR-TC100-LB-90010050-WW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665704/ghe-corsair-tc100-lb-90010050-ww_01_ah2pi7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665712/ghe-corsair-tc100-lb-90010050-ww_06_vsxdvf.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665720/ghe-corsair-tc100-lb-90010050-ww_07_ag7tqo.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665728/ghe-corsair-tc100-lb-90010050-ww_08_etb56z.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665736/ghe-corsair-tc100-lb-90010050-ww_09_lqzlkj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665744/ghe-corsair-tc100-lb-90010050-ww_10_sizife.jpg"
            )),
            Map.entry("GHE-RAZER-ISKUR-V2-DARK-GREY-FABRIC", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665858/ghe-razer-iskur-v2-dark-grey-fabric_01_ytqwhc.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665866/ghe-razer-iskur-v2-dark-grey-fabric_04_du6fs5.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665875/ghe-razer-iskur-v2-dark-grey-fabric_05_yuexlg.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665883/ghe-razer-iskur-v2-dark-grey-fabric_06_oax9ci.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779665891/ghe-razer-iskur-v2-dark-grey-fabric_07_i0xusm.png"
            )),
            Map.entry("GHE-EDRA-EGC234-BLACK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666006/ghe-edra-egc234-black_01_rob8tg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666014/ghe-edra-egc234-black_04_wewlyw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666022/ghe-edra-egc234-black_05_cbc483.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666030/ghe-edra-egc234-black_06_wxbzbm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666038/ghe-edra-egc234-black_07_torol0.jpg"
            )),
            Map.entry("GHE-WARR-RAIDER-WGC206-WHI-PINK", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666169/ghe-warr-raider-wgc206-whi-pink_01_rfw4cm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666177/ghe-warr-raider-wgc206-whi-pink_04_xhkeee.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666185/ghe-warr-raider-wgc206-whi-pink_05_ozalbx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666193/ghe-warr-raider-wgc206-whi-pink_06_hn4srd.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666201/ghe-warr-raider-wgc206-whi-pink_07_fq5wg2.jpg"
            )),
            Map.entry("GHE-SIHOO-M57B-KC", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666309/ghe-sihoo-m57b-kc_01_fflhwk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666317/ghe-sihoo-m57b-kc_04_lq1crw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666326/ghe-sihoo-m57b-kc_05_miwbk2.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666334/ghe-sihoo-m57b-kc_06_oixqku.jpg"
            )),
            Map.entry("GHE-SIHOO-M77C-GRAY", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666457/ghe-sihoo-m77c-gray_01_xz4rt9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666466/ghe-sihoo-m77c-gray_04_v1ma2u.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666482/ghe-sihoo-m77c-gray_06_ubfyjs.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666491/ghe-sihoo-m77c-gray_07_dxi8hh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666499/ghe-sihoo-m77c-gray_08_wnsgdq.jpg"
            )),
            Map.entry("GHE-EDRA-CITIZEN-EGC236-FABRIC", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666587/ghe-edra-citizen-egc236-fabric_01_vmxm3c.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666595/ghe-edra-citizen-egc236-fabric_04_oemyzv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666603/ghe-edra-citizen-egc236-fabric_05_kvgakx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666612/ghe-edra-citizen-egc236-fabric_06_g6g7et.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666620/ghe-edra-citizen-egc236-fabric_07_lbjsbo.jpg"
            )),
            Map.entry("GHE-WARRIOR-WGC210-BLK-GRAY", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666753/ghe-warrior-wgc210-blk-gray_01_mu8nmg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666762/ghe-warrior-wgc210-blk-gray_10_raorj3.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666771/ghe-warrior-wgc210-blk-gray_11_ia7gjd.jpg"
            )),
            Map.entry("GHE-RAZER-ENKI-FULL-BLK-RZ38-03720300-R3U1", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666854/ghe-razer-enki-full-blk-rz38-03720300-r3u1_01_yubxa0.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666864/ghe-razer-enki-full-blk-rz38-03720300-r3u1_04_qfnn65.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666871/ghe-razer-enki-full-blk-rz38-03720300-r3u1_05_uj0shx.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779666879/ghe-razer-enki-full-blk-rz38-03720300-r3u1_06_elku1n.png"
            ))
    );
    private static final String CATEGORY_SLUG = "ghe";
    private static final String CATEGORY_NAME = "Ghế";

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
        seedChairs();
    }

    private void seedChairs() {
        List<ChairSeed> chairs = List.of(
                chair("Ghế công thái học Ergonomic Warrior Pawn Series WEC105 Black", "Warrior", "GHE-WARRIOR-PAWN-WEC105-BLACK", "1590000", 10),
                chair("Ghế Ergonomic Warrior Hero series WEC502 Grey", "Warrior", "GHE-WAR-HERO-WEC502-GREY", "2590000", 10),
                chair("Ghế gaming Razer Iskur V2 X NewGen Black Green", "Razer", "GHE-ISKUR-V2-NEWGEN-BLK-GREEN-RZ38-05310700-R3CA", "8900000", 10),
                chair("Ghế công thái học E-Dra EEC228", "E-Dra", "GHE-EDRA-EEC228", "1390000", 10),
                chair("Ghế Gaming Razer Enki Black Green", "Razer", "GHE-RAZER-ENKI-BLK-GREEN-RZ38-03720100-R3U1", "12500000", 10),
                chair("Ghế gaming Razer Iskur V2 X Light Gray Fabric", "Razer", "GHE-RAZER-ISKUR-V2-X-RZ38-05310200-R3UA", "7290000", 10),
                chair("Ghế chơi game Warrior Raider Series WGC207 Black", "Warrior", "GHE-WARRIOR-RAIDER-WGC207-BLACK", "2690000", 10),
                chair("Ghế game E-Dra Level E EGC229 Black Red", "E-Dra", "GHE-EDRA-EGC-229", "2750000", 10),
                chair("Ghế Ergonomic Warrior Hero series WEC506 Black V2.0", "Warrior", "GHE-WAR-WEC-506-BLA-V2", "3690000", 10),
                chair("Ghế Ergonomic Warrior Hero series WEC509 Black Red", "Warrior", "GHE-WAR-HERO-WEC509-BLA-RED", "3390000", 10),
                chair("Ghế chơi game E-Dra Hercules EGC203 V2 Black", "E-Dra", "GHE-EDRA-HER-EGC203-BLA", "3490000", 10),
                chair("Ghế chơi game Warrior Immortal Series WGC225 Black", "Warrior", "GHE-WARRIOR-IMMORTAL-SERIES-WGC225-BLK", "3290000", 10),
                chair("Ghế Corsair T3 RUSH Charcoal 2023", "Corsair", "GHE-COR-T3-RUSH-CHAR-2023", "7390000", 10),
                chair("Ghế công thái học Sihoo M57", "Sihoo", "GHE-SIHOO-M57", "4090000", 10),
                chair("Ghế công thái học Sihoo M102C", "Sihoo", "GHE-SIHOO-M102C", "2800000", 10),
                chair("Ghế Gaming Corsair TC500 LUXE Shadow", "Corsair", "GHE-COR-TC500-LUXE-SHADOW", "11890000", 10),
                chair("Ghế game E-Dra EGC231 WISDOM Black", "E-Dra", "GHE-EDRA-EGC231-WD-BLACK", "3590000", 10),
                chair("Ghế Corsair TC100 Leatherette Black", "Corsair", "GHE-CORSAIR-TC100-LB-90010050-WW", "5290000", 10),
                chair("Ghế gaming Razer Iskur V2 Dark Grey Fabric", "Razer", "GHE-RAZER-ISKUR-V2-DARK-GREY-FABRIC", "15420000", 10),
                chair("Ghế Gaming E-Dra Dignity EGC234 Black", "E-Dra", "GHE-EDRA-EGC234-BLACK", "1690000", 10),
                chair("Ghế Warrior Raider Series WGC206 White Pink", "Warrior", "GHE-WARR-RAIDER-WGC206-WHI-PINK", "2890000", 10),
                chair("Ghế công thái học Sihoo M57B có kê chân", "Sihoo", "GHE-SIHOO-M57B-KC", "4590000", 10),
                chair("Ghế công thái học Sihoo M18", "Sihoo", "GHE-SIHOO-M18", "3190000", 10),
                chair("Ghế công thái học Sihoo M77C Xám", "Sihoo", "GHE-SIHOO-M77C-GRAY", "2490000", 0),
                chair("Ghế Gaming E-Dra EGC236 Fabric", "E-Dra", "GHE-EDRA-CITIZEN-EGC236-FABRIC", "1990000", 0),
                chair("Ghế chơi game Warrior Raider Series WGC210 Black Gray", "Warrior", "GHE-WARRIOR-WGC210-BLK-GRAY", "1690000", 0),
                chair("Ghế Gaming Razer Enki Full Black", "Razer", "GHE-RAZER-ENKI-FULL-BLK-RZ38-03720300-R3U1", "12500000", 0)
        );

        for (ChairSeed chair : chairs) {
            upsertChair(chair);
        }
    }

    private void upsertChair(ChairSeed seed) {
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
        List<String> imageUrls = getChairImages(seed.getSku());
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
    private List<String> getChairImages(String sku) {
        return CHAIR_IMAGES.getOrDefault(sku, List.of(DEMO_IMAGE_URL));
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
            ChairSeed seed
    ) {
        List<SpecSeed> specs = List.of(
                spec("Hãng sản xuất", seed.getBrandName(), null, 1),
                spec("Bảo hành", "12 tháng", null, 2),
                spec("Loại ghế", inferChairType(seed.getName()), null, 3),
                spec("Màu sắc", inferColor(seed.getName()), null, 4),
                spec("Chất liệu", inferMaterial(seed.getName()), null, 5),
                spec("Tay vịn", inferArmrest(seed.getName()), null, 6),
                spec("Tải trọng", inferLoad(seed.getName()), null, 7),
                spec("Trục thủy lực", inferHydraulic(seed.getName()), null, 8),
                spec("Tình trạng", seed.getStock() > 0 ? "Còn hàng" : "Hết hàng", null, 9)
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
                            .description("Ghế gaming, ghế công thái học và ghế làm việc dành cho game thủ, văn phòng.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(7)
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
                            .description(brandName + " là thương hiệu ghế gaming, ghế công thái học và phụ kiện setup.")
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return brandRepository.save(brand);
                });
    }

    private BigDecimal makeSalePrice(BigDecimal price) {
        return price.multiply(new BigDecimal("0.95"))
                .setScale(0, RoundingMode.HALF_UP);
    }

    private String buildDescription(ChairSeed seed) {
        return """
                %s là sản phẩm ghế thuộc thương hiệu %s, phù hợp cho nhu cầu chơi game, học tập, làm việc và setup góc máy.

                Thông số nổi bật:
                - Hãng sản xuất: %s
                - Loại ghế: %s
                - Màu sắc: %s
                - Chất liệu: %s
                - Tay vịn: %s
                - Bảo hành: 12 tháng
                """.formatted(
                seed.getName(),
                seed.getBrandName(),
                seed.getBrandName(),
                inferChairType(seed.getName()),
                inferColor(seed.getName()),
                inferMaterial(seed.getName()),
                inferArmrest(seed.getName())
        ).trim();
    }

    private String inferChairType(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("ergonomic") || value.contains("công thái học")) {
            return "Ghế công thái học";
        }

        if (
                value.contains("gaming")
                        || value.contains("game")
                        || value.contains("chơi game")
                        || value.contains("raider")
                        || value.contains("iskur")
                        || value.contains("enki")
        ) {
            return "Ghế gaming";
        }

        return "Ghế làm việc";
    }

    private String inferColor(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("black red") || value.contains("black/red") || value.contains("đen đỏ")) {
            return "Đen đỏ";
        }

        if (value.contains("black green") || value.contains("black - green") || value.contains("đen xanh")) {
            return "Đen xanh";
        }

        if (value.contains("white pink") || value.contains("trắng hồng")) {
            return "Trắng hồng";
        }

        if (value.contains("black gray") || value.contains("black/gray") || value.contains("đen xám")) {
            return "Đen xám";
        }

        if (value.contains("light gray") || value.contains("grey") || value.contains("gray") || value.contains("xám")) {
            return "Xám";
        }

        if (value.contains("black") || value.contains("đen")) {
            return "Đen";
        }

        return "Đang cập nhật";
    }

    private String inferMaterial(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("fabric")) {
            return "Vải";
        }

        if (value.contains("leatherette") || value.contains("gaming") || value.contains("game")) {
            return "Da PU / Da tổng hợp";
        }

        if (value.contains("ergonomic") || value.contains("công thái học") || value.contains("sihoo")) {
            return "Lưới thoáng khí";
        }

        return "Đang cập nhật";
    }

    private String inferArmrest(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("razer") || value.contains("warrior") || value.contains("corsair")) {
            return "Tay vịn điều chỉnh";
        }

        return "Đang cập nhật";
    }

    private String inferLoad(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("edra") || value.contains("warrior")) {
            return "Tối đa khoảng 120kg - 150kg";
        }

        if (value.contains("razer") || value.contains("corsair")) {
            return "Tối đa khoảng 136kg";
        }

        return "Đang cập nhật";
    }

    private String inferHydraulic(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("edra") || value.contains("warrior")) {
            return "Class 3 / Class 4";
        }

        return "Đang cập nhật";
    }

    private ChairSeed chair(
            String name,
            String brandName,
            String sku,
            String price,
            Integer stock
    ) {
        return new ChairSeed(
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
    private static class ChairSeed {
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