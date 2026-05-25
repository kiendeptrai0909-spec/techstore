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
@Order(40)
public class DemoAcerLaptopSeeder implements CommandLineRunner {

    private static final String DEMO_IMAGE_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779383312/avatar_test_hejmvl.png";
    private static final Map<String, List<String>> ACER_LAPTOP_IMAGES = Map.ofEntries(
            Map.entry("LAP-ACER-SWIFT-X14-SFX14-72G-79UW", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673492/lap-acer-swift-x14-sfx14-72g-79uw_01_azryft.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-AG14-72P-563L", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673548/lap-acer-aspire-go-ag14-72p-563l_01_nu4lqt.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673549/lap-acer-aspire-go-ag14-72p-563l_04_vqxarn.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673549/lap-acer-aspire-go-ag14-72p-563l_05_qlisft.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673553/lap-acer-aspire-go-ag14-72p-563l_06_ckjmfp.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673553/lap-acer-aspire-go-ag14-72p-563l_07_jfxkfq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673554/lap-acer-aspire-go-ag14-72p-563l_08_ap0sex.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-AG15-72P-54GY", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673682/lap-acer-aspire-go-ag15-72p-54gy_01_yiegxk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673682/lap-acer-aspire-go-ag15-72p-54gy_04_wvkvlh.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673683/lap-acer-aspire-go-ag15-72p-54gy_05_agtevu.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673683/lap-acer-aspire-go-ag15-72p-54gy_06_qvuehq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673683/lap-acer-aspire-go-ag15-72p-54gy_07_khuefa.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-48P-R5MN", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673778/lap-acer-aspire-lite-al15-48p-r5mn_01_yzu4mo.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673778/lap-acer-aspire-lite-al15-48p-r5mn_04_k5x3hz.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673781/lap-acer-aspire-lite-al15-48p-r5mn_05_vgjftu.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673782/lap-acer-aspire-lite-al15-48p-r5mn_06_eeolwg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673782/lap-acer-aspire-lite-al15-48p-r5mn_07_lze13w.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673782/lap-acer-aspire-lite-al15-48p-r5mn_08_u9rbk3.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL14-52P-309T", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673874/lap-acer-aspire-lite-al14-52p-309t_01_ajsfst.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673875/lap-acer-aspire-lite-al14-52p-309t_04_uczqss.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673875/lap-acer-aspire-lite-al14-52p-309t_05_igqcmc.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673875/lap-acer-aspire-lite-al14-52p-309t_06_xdedo5.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673875/lap-acer-aspire-lite-al14-52p-309t_07_zenhrg.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673877/lap-acer-aspire-lite-al14-52p-309t_08_fqku0r.jpg"
            )),
            Map.entry("LAP-ACER-SWIFT-GO-14-AI-SFG14-75-5264", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673969/lap-acer-swift-go-14-ai-sfg14-75-5264_01_wwtbmb.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673969/lap-acer-swift-go-14-ai-sfg14-75-5264_04_sx7xeo.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673969/lap-acer-swift-go-14-ai-sfg14-75-5264_05_yw3zoc.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673970/lap-acer-swift-go-14-ai-sfg14-75-5264_06_xahuey.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779673970/lap-acer-swift-go-14-ai-sfg14-75-5264_07_xhbpx6.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-15-AG15-71P-58X1", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674080/lap-acer-aspire-go-15-ag15-71p-58x1_01_ewecbp.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674082/lap-acer-aspire-go-15-ag15-71p-58x1_04_sdhunm.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674083/lap-acer-aspire-go-15-ag15-71p-58x1_05_uognmd.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674084/lap-acer-aspire-go-15-ag15-71p-58x1_06_b0utzs.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674084/lap-acer-aspire-go-15-ag15-71p-58x1_07_rt4f8s.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-16-AI-A16-71M-71U7", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674178/lap-acer-aspire-16-ai-a16-71m-71u7_01_bhogaz.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674178/lap-acer-aspire-16-ai-a16-71m-71u7_04_gqndgf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674179/lap-acer-aspire-16-ai-a16-71m-71u7_05_hevzl3.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674179/lap-acer-aspire-16-ai-a16-71m-71u7_06_hztmob.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674180/lap-acer-aspire-16-ai-a16-71m-71u7_07_yxct1c.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674181/lap-acer-aspire-16-ai-a16-71m-71u7_08_gryo6b.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-14-AI-A14-61M-R9RA", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674296/lap-acer-aspire-14-ai-a14-61m-r9ra_01_d902ps.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674296/lap-acer-aspire-14-ai-a14-61m-r9ra_04_xzwz1x.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674297/lap-acer-aspire-14-ai-a14-61m-r9ra_05_oo9eyt.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674298/lap-acer-aspire-14-ai-a14-61m-r9ra_06_c7pwec.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-14-AL14-71P-55P9", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674382/lap-acer-aspire-lite-14-al14-71p-55p9_01_mebt11.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674382/lap-acer-aspire-lite-14-al14-71p-55p9_04_naubrv.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674383/lap-acer-aspire-lite-14-al14-71p-55p9_05_lgotxz.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674384/lap-acer-aspire-lite-14-al14-71p-55p9_06_qox1yh.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674385/lap-acer-aspire-lite-14-al14-71p-55p9_07_sfztdf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674386/lap-acer-aspire-lite-14-al14-71p-55p9_08_sxshb1.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674387/lap-acer-aspire-lite-14-al14-71p-55p9_09_nngorr.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-72P-581V", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674474/lap-acer-aspire-lite-al15-72p-581v_01_gbl6ys.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674475/lap-acer-aspire-lite-al15-72p-581v_04_vkfnl4.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674475/lap-acer-aspire-lite-al15-72p-581v_05_yvgaxf.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674476/lap-acer-aspire-lite-al15-72p-581v_06_dusraj.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-AG14-71M-57WR", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674547/lap-acer-aspire-go-ag14-71m-57wr_01_gsyeqv.png",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674548/lap-acer-aspire-go-ag14-71m-57wr_04_e24rmh.png"
            )),
            Map.entry("LAP-ACER-SWIFT-GO-SFG14-74T-55HD", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674610/lap-acer-swift-go-sfg14-74t-55hd_01_utgnq6.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-16-AL16-52P-76DU", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674665/lap-acer-aspire-lite-16-al16-52p-76du_01_vxbvpb.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-15-AL15-41P-R3U5", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779674733/lap-acer-aspire-lite-15-al15-41p-r3u5_01_qaujyz.png"
            )),
            Map.entry("LAP-ACER-ASPIRE-5-A515-58P-9841", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675320/lap-acer-aspire-5-a515-58p-9841_01_fjqiiw.png"
            )),
            Map.entry("LAP-ACER-SWIFT-LITE-14-SFL14-51M-56HS", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675388/lap-acer-swift-lite-14-sfl14-51m-56hs_01_slptm2.jpg"
            )),
            Map.entry("LAP-ACER-SWIFT-14-SF14-51-53P9", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675453/lap-acer-swift-14-sf14-51-53p9_01_sopd8a.png"
            )),
            Map.entry("LAP-ACER-SWIFT-GO-14-SFG14-73-57FZ", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675520/lap-acer-swift-go-14-sfg14-73-57fz_01_mwwd6x.png"
            )),
            Map.entry("LAP-ACER-SWIFT-X14-SFX14-71G-78SY", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675577/lap-acer-swift-x14-sfx14-71g-78sy_01_adyw0q.png"
            )),
            Map.entry("LAP-ACER-SWIFT-GO-SFG14-I71-70RP", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675710/lap-acer-swift-go-sfg14-i71-70rp_01_hzpids.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675712/lap-acer-swift-go-sfg14-i71-70rp_05_qnwyag.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675721/lap-acer-swift-go-sfg14-i71-70rp_06_nmreul.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675723/lap-acer-swift-go-sfg14-i71-70rp_07_wgkev9.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675724/lap-acer-swift-go-sfg14-i71-70rp_08_yqyul7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675726/lap-acer-swift-go-sfg14-i71-70rp_09_h9p4rk.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL16-71P-582Q", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675907/lap-acer-aspire-lite-al16-71p-582q_01_j12lcr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675908/lap-acer-aspire-lite-al16-71p-582q_04_wt6cg8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675945/lap-acer-aspire-lite-al16-71p-582q_05_b4973l.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675946/lap-acer-aspire-lite-al16-71p-582q_06_r1yofc.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675948/lap-acer-aspire-lite-al16-71p-582q_07_ajxhlr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779675949/lap-acer-aspire-lite-al16-71p-582q_08_opnr45.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-AG15-52P-52WT", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676081/lap-acer-aspire-go-ag15-52p-52wt_01_rd5ere.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676082/lap-acer-aspire-go-ag15-52p-52wt_04_w8dami.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676084/lap-acer-aspire-go-ag15-52p-52wt_05_ji23ju.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676086/lap-acer-aspire-go-ag15-52p-52wt_06_taxwwf.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676088/lap-acer-aspire-go-ag15-52p-52wt_07_mgplgq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676132/lap-acer-aspire-go-ag15-52p-52wt_08_rfsudn.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676140/lap-acer-aspire-go-ag15-52p-52wt_09_psyqhk.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-GO-AG14-I71M-50AL", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676279/lap-acer-aspire-go-ag14-i71m-50al_01_vszu3a.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676281/lap-acer-aspire-go-ag14-i71m-50al_04_sycajq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676284/lap-acer-aspire-go-ag14-i71m-50al_05_ygjzbn.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676286/lap-acer-aspire-go-ag14-i71m-50al_06_mw7yd7.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676303/lap-acer-aspire-go-ag14-i71m-50al_07_rox9ey.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676304/lap-acer-aspire-go-ag14-i71m-50al_08_fackvw.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-53P-56QH", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676403/lap-acer-aspire-lite-al15-53p-56qh_01_bgvgcm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676420/lap-acer-aspire-lite-al15-53p-56qh_04_kdpwam.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676422/lap-acer-aspire-lite-al15-53p-56qh_05_xahbwb.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676425/lap-acer-aspire-lite-al15-53p-56qh_06_omxfqm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676426/lap-acer-aspire-lite-al15-53p-56qh_07_n0yjke.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676428/lap-acer-aspire-lite-al15-53p-56qh_08_u9os9l.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-44P-R4UH", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676518/lap-acer-aspire-lite-al15-44p-r4uh_01_klhjfk.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676520/lap-acer-aspire-lite-al15-44p-r4uh_04_ktojvj.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676522/lap-acer-aspire-lite-al15-44p-r4uh_05_cip02i.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676545/lap-acer-aspire-lite-al15-44p-r4uh_06_wnjkcn.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676547/lap-acer-aspire-lite-al15-44p-r4uh_07_xrthpm.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-21P-R91W", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676658/lap-acer-aspire-lite-al15-21p-r91w_01_cojgrd.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676675/lap-acer-aspire-lite-al15-21p-r91w_04_fgmdt1.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676702/lap-acer-aspire-lite-al15-21p-r91w_05_vcwnml.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676773/lap-acer-aspire-lite-al15-21p-r91w_06_n56fu6.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL14-44P-R0SP", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676867/lap-acer-aspire-lite-al14-44p-r0sp_01_jlcjif.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676869/lap-acer-aspire-lite-al14-44p-r0sp_04_zpdgkl.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676871/lap-acer-aspire-lite-al14-44p-r0sp_05_bdrraq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676873/lap-acer-aspire-lite-al14-44p-r0sp_06_n7kobq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676874/lap-acer-aspire-lite-al14-44p-r0sp_07_yv7zib.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779676876/lap-acer-aspire-lite-al14-44p-r0sp_08_pzutqu.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-36P-30TN", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677055/lap-acer-aspire-lite-al15-36p-30tn_01_cwkoeq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677057/lap-acer-aspire-lite-al15-36p-30tn_04_dbzigm.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677071/lap-acer-aspire-lite-al15-36p-30tn_05_nujyth.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677103/lap-acer-aspire-lite-al15-36p-30tn_06_iby1qq.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677111/lap-acer-aspire-lite-al15-36p-30tn_07_feix0y.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677113/lap-acer-aspire-lite-al15-36p-30tn_08_bv0wql.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL14-45P-R7Z3", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677233/lap-acer-aspire-lite-al14-45p-r7z3_01_dko84a.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677235/lap-acer-aspire-lite-al14-45p-r7z3_04_syhmn4.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677237/lap-acer-aspire-lite-al14-45p-r7z3_05_j6fowo.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677240/lap-acer-aspire-lite-al14-45p-r7z3_06_ws7e54.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677242/lap-acer-aspire-lite-al14-45p-r7z3_07_fmy4d1.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677244/lap-acer-aspire-lite-al14-45p-r7z3_08_djdbfa.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-46P-R73C", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677396/lap-acer-aspire-lite-al15-46p-r73c_01_srqqqw.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677419/lap-acer-aspire-lite-al15-46p-r73c_04_oqp4lr.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677421/lap-acer-aspire-lite-al15-46p-r73c_05_xjfndv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677423/lap-acer-aspire-lite-al15-46p-r73c_06_kcsbg8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677425/lap-acer-aspire-lite-al15-46p-r73c_07_cz96mv.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677429/lap-acer-aspire-lite-al15-46p-r73c_08_zunnz8.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677432/lap-acer-aspire-lite-al15-46p-r73c_09_nwjeu2.jpg"
            )),
            Map.entry("LAP-ACER-SWIFT-EDGE-SFE14-51T-52KD", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677559/lap-acer-swift-edge-sfe14-51t-52kd_01_mosa0p.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677565/lap-acer-swift-edge-sfe14-51t-52kd_04_oazko6.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677567/lap-acer-swift-edge-sfe14-51t-52kd_05_qa6gvt.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677570/lap-acer-swift-edge-sfe14-51t-52kd_06_jhdave.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677582/lap-acer-swift-edge-sfe14-51t-52kd_07_txfur4.jpg"
            )),
            Map.entry("LAP-ACER-ASPIRE-LITE-AL15-42P-R8E6", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677674/lap-acer-aspire-lite-al15-42p-r8e6_01_jdbnxa.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677677/lap-acer-aspire-lite-al15-42p-r8e6_04_hwhxxx.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677680/lap-acer-aspire-lite-al15-42p-r8e6_05_qsphia.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677686/lap-acer-aspire-lite-al15-42p-r8e6_06_v1sdel.jpg",
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677688/lap-acer-aspire-lite-al15-42p-r8e6_08_fqvuvd.jpg"
            )),
            Map.entry("LAP-ACER-A5-A515-58M-79R7", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677772/lap-acer-a5-a515-58m-79r7_01_gfxnzz.png"
            )),
            Map.entry("LAP-ACER-A5-A514-56P-562P", List.of(
                    "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779677873/lap-acer-a5-a514-56p-562p_01_iukjtq.png"
            ))
    );
    private static final String CATEGORY_SLUG = "laptop";
    private static final String CATEGORY_NAME = "Laptop";
    private static final String BRAND_NAME = "ACER";

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
        seedAcerLaptops();
    }

    private void seedAcerLaptops() {
        List<LaptopSeed> laptops = List.of(
                laptop("Laptop Acer Swift X14 SFX14 72G 79UW", "LAP-ACER-SWIFT-X14-SFX14-72G-79UW", "52990000", 10),
                laptop("Laptop Acer Aspire Go 14 AG14-72P-563L", "LAP-ACER-ASPIRE-GO-AG14-72P-563L", "19990000", 10),
                laptop("Laptop Acer Aspire Go 15 AI AG15 72P 54GY", "LAP-ACER-ASPIRE-GO-AG15-72P-54GY", "19490000", 10),
                laptop("Laptop Acer Aspire Lite 15 AL15-48P-R5MN", "LAP-ACER-ASPIRE-LITE-AL15-48P-R5MN", "15990000", 10),
                laptop("Laptop Acer Aspire Lite 14 AL14-52P-309T", "LAP-ACER-ASPIRE-LITE-AL14-52P-309T", "14490000", 10),
                laptop("Laptop Acer Swift Go 14 AI SFG14 75 5264", "LAP-ACER-SWIFT-GO-14-AI-SFG14-75-5264", "29990000", 10),
                laptop("Laptop Acer Aspire Go 15 AG15 71P 58X1", "LAP-ACER-ASPIRE-GO-15-AG15-71P-58X1", "14490000", 10),
                laptop("Laptop Acer Aspire 16 AI A16 71M 71U7", "LAP-ACER-ASPIRE-16-AI-A16-71M-71U7", "18890000", 10),
                laptop("Laptop Acer Aspire 14 AI A14 61M R9RA", "LAP-ACER-ASPIRE-14-AI-A14-61M-R9RA", "23890000", 10),
                laptop("Laptop Acer Aspire Lite 14 AL14 71P 55P9", "LAP-ACER-ASPIRE-LITE-14-AL14-71P-55P9", "17490000", 10),
                laptop("Laptop Acer Aspire Lite AL15 72P 581V", "LAP-ACER-ASPIRE-LITE-AL15-72P-581V", "15290000", 10),
                laptop("Laptop Acer Aspire Go AG14 71M 57WR", "LAP-ACER-ASPIRE-GO-AG14-71M-57WR", "16790000", 10),
                laptop("Laptop Acer Swift Go SFG14 74T 55HD", "LAP-ACER-SWIFT-GO-SFG14-74T-55HD", "31490000", 10),
                laptop("Laptop Acer Aspire Lite 16 AL16 52P 76DU", "LAP-ACER-ASPIRE-LITE-16-AL16-52P-76DU", "17690000", 10),
                laptop("Laptop Acer Aspire Lite 15 AL15 41P R3U5", "LAP-ACER-ASPIRE-LITE-15-AL15-41P-R3U5", "12790000", 10),
                laptop("Laptop Acer Aspire 5 A515 58P 9841", "LAP-ACER-ASPIRE-5-A515-58P-9841", "21690000", 10),
                laptop("Laptop ACER Swift Lite 14 SFL14 51M 56HS", "LAP-ACER-SWIFT-LITE-14-SFL14-51M-56HS", "16990000", 10),
                laptop("Laptop Acer Swift 14 AI SF14 51 53P9", "LAP-ACER-SWIFT-14-SF14-51-53P9", "28990000", 10),
                laptop("Laptop Acer Swift Go 14 SFG14 73 57FZ", "LAP-ACER-SWIFT-GO-14-SFG14-73-57FZ", "23790000", 10),
                laptop("Laptop Acer Swift X14 SFX14 71G 78SY", "LAP-ACER-SWIFT-X14-SFX14-71G-78SY", "33990000", 10),
                laptop("Laptop Acer Swift 3 SF314 511 55QE", "LAP-ACER-SWIFT-3-SF314-511-55QE", "12990000", 10),
                laptop("Laptop Acer Swift Go 14 AI SFG14 I71 70RP", "LAP-ACER-SWIFT-GO-SFG14-I71-70RP", "49990000", 0),
                laptop("Laptop Acer Aspire Lite 16 AI AL16 71P 582Q", "LAP-ACER-ASPIRE-LITE-AL16-71P-582Q", "24990000", 0),
                laptop("Laptop Acer Aspire Go 15 AI AG15 52P 52WT", "LAP-ACER-ASPIRE-GO-AG15-52P-52WT", "23490000", 0),
                laptop("Laptop Acer Aspire Go 14 AI AG14 I71M 50AL", "LAP-ACER-ASPIRE-GO-AG14-I71M-50AL", "23990000", 0),
                laptop("Laptop Acer Aspire Lite 15 AL15 53P 56QH", "LAP-ACER-ASPIRE-LITE-AL15-53P-56QH", "22990000", 0),
                laptop("Laptop Acer Aspire Lite 15 AL15 44P R4UH", "LAP-ACER-ASPIRE-LITE-AL15-44P-R4UH", "21990000", 0),
                laptop("Laptop Acer Aspire Lite 15 AL15 21P R91W", "LAP-ACER-ASPIRE-LITE-AL15-21P-R91W", "20990000", 0),
                laptop("Laptop Acer Aspire Lite 14 AL14 44P R0SP", "LAP-ACER-ASPIRE-LITE-AL14-44P-R0SP", "20990000", 0),
                laptop("Laptop Acer Aspire Lite 14 AL15 36P 30TN", "LAP-ACER-ASPIRE-LITE-AL15-36P-30TN", "16990000", 0),
                laptop("Laptop Acer Aspire Lite 14 AL14 45P R7Z3", "LAP-ACER-ASPIRE-LITE-AL14-45P-R7Z3", "15990000", 0),
                laptop("Laptop Acer Aspire Lite 15 AL15 46P R73C", "LAP-ACER-ASPIRE-LITE-AL15-46P-R73C", "14490000", 0),
                laptop("Laptop Acer Swift Edge 14 AI SFE14-51T-52KD", "LAP-ACER-SWIFT-EDGE-SFE14-51T-52KD", "40990000", 0),
                laptop("Laptop Acer Aspire Lite 15 AL15-42P-R8E6", "LAP-ACER-ASPIRE-LITE-AL15-42P-R8E6", "14990000", 0),
                laptop("Laptop Acer Aspire 5 A515 58M 79R7", "LAP-ACER-A5-A515-58M-79R7", "16990000", 0),
                laptop("Laptop Acer Aspire 5 A514 56P 562P", "LAP-ACER-A5-A514-56P-562P", "12790000", 0)
        );

        for (LaptopSeed laptop : laptops) {
            upsertLaptop(laptop);
        }
    }

    private void upsertLaptop(LaptopSeed seed) {
        Category category = getOrCreateCategory();
        Brand brand = getOrCreateBrand();

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
        List<String> imageUrls = getAcerLaptopImages(seed.getSku());
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
    private List<String> getAcerLaptopImages(String sku) {
        return ACER_LAPTOP_IMAGES.getOrDefault(sku, List.of(DEMO_IMAGE_URL));
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

    private void overwriteSpecifications(Product product, Category category, LaptopSeed seed) {
        List<SpecSeed> specs = List.of(
                spec("Hãng sản xuất", BRAND_NAME, null, 1),
                spec("Bảo hành", "12 tháng", null, 2),
                spec("Dòng laptop", inferLaptopLine(seed.getName()), null, 3),
                spec("Nhu cầu sử dụng", inferUsage(seed.getName()), null, 4),
                spec("Kích thước màn hình", inferScreenSize(seed.getName()), null, 5),
                spec("CPU", "Đang cập nhật", null, 6),
                spec("RAM", "Đang cập nhật", null, 7),
                spec("Ổ cứng", "SSD, dung lượng tùy phiên bản", null, 8),
                spec("Card đồ họa", inferGraphics(seed.getName()), null, 9),
                spec("Hệ điều hành", "Windows 11", null, 10),
                spec("Màu sắc", inferColor(seed.getName()), null, 11),
                spec("Trọng lượng", inferWeight(seed.getName()), null, 12),
                spec("Tình trạng", seed.getStock() > 0 ? "Còn hàng" : "Hết hàng", null, 13)
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
                            .findByProductIdAndSpecificationKeyId(product.getId(), key.getId())
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
                            .description("Laptop học tập, làm việc, văn phòng, đồ họa và giải trí.")
                            .imageUrl(DEMO_IMAGE_URL)
                            .sortOrder(1)
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return categoryRepository.save(category);
                });
    }

    private Brand getOrCreateBrand() {
        String slug = generateSlug(BRAND_NAME);

        return brandRepository.findBySlug(slug)
                .orElseGet(() -> {
                    Brand brand = Brand.builder()
                            .name(BRAND_NAME)
                            .slug(slug)
                            .logoUrl(DEMO_IMAGE_URL)
                            .description("ACER là thương hiệu laptop phổ biến với nhiều dòng sản phẩm phục vụ học tập, làm việc và sáng tạo.")
                            .status(ProductStatus.ACTIVE)
                            .build();

                    return brandRepository.save(brand);
                });
    }

    private BigDecimal makeSalePrice(BigDecimal price) {
        return price.multiply(new BigDecimal("0.95"))
                .setScale(0, RoundingMode.HALF_UP);
    }

    private String buildDescription(LaptopSeed seed) {
        return """
                %s là sản phẩm laptop thuộc thương hiệu ACER, phù hợp cho nhu cầu học tập, làm việc, giải trí và xử lý tác vụ hằng ngày.

                Thông số nổi bật:
                - Thương hiệu: ACER
                - Dòng laptop: %s
                - Nhu cầu sử dụng: %s
                - Kích thước màn hình: %s
                - Hệ điều hành: Windows 11
                - Bảo hành: 12 tháng
                """.formatted(
                seed.getName(),
                inferLaptopLine(seed.getName()),
                inferUsage(seed.getName()),
                inferScreenSize(seed.getName())
        ).trim();
    }

    private String inferLaptopLine(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("swift edge")) return "Acer Swift Edge";
        if (value.contains("swift x14") || value.contains("swift x")) return "Acer Swift X";
        if (value.contains("swift go")) return "Acer Swift Go";
        if (value.contains("swift lite")) return "Acer Swift Lite";
        if (value.contains("swift 14 ai")) return "Acer Swift AI";
        if (value.contains("swift 3")) return "Acer Swift 3";
        if (value.contains("aspire lite")) return "Acer Aspire Lite";
        if (value.contains("aspire go")) return "Acer Aspire Go";
        if (value.contains("aspire 5") || value.contains("a515") || value.contains("a514")) return "Acer Aspire 5";
        if (value.contains("aspire 16 ai")) return "Acer Aspire 16 AI";
        if (value.contains("aspire 14 ai")) return "Acer Aspire 14 AI";

        return "Acer Laptop";
    }

    private String inferUsage(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("swift x")) {
            return "Đồ họa, sáng tạo nội dung, học tập và làm việc";
        }

        if (value.contains("ai")) {
            return "Học tập, làm việc văn phòng và tác vụ AI cơ bản";
        }

        if (value.contains("aspire go") || value.contains("aspire lite")) {
            return "Học tập, văn phòng và làm việc hằng ngày";
        }

        if (value.contains("swift")) {
            return "Làm việc di động, văn phòng và giải trí";
        }

        return "Học tập và làm việc";
    }

    private String inferScreenSize(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("x14")
                        || value.contains(" 14 ")
                        || value.contains("-14")
                        || value.contains("ag14")
                        || value.contains("al14")
                        || value.contains("sf14")
                        || value.contains("sfg14")
                        || value.contains("sfe14")
        ) {
            return "Khoảng 14 inch";
        }

        if (
                value.contains(" 15 ")
                        || value.contains("-15")
                        || value.contains("ag15")
                        || value.contains("al15")
                        || value.contains("a515")
        ) {
            return "Khoảng 15.6 inch";
        }

        if (
                value.contains(" 16 ")
                        || value.contains("-16")
                        || value.contains("al16")
                        || value.contains("a16")
        ) {
            return "Khoảng 16 inch";
        }

        return "Đang cập nhật";
    }

    private String inferGraphics(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("swift x14") || value.contains("sfx14")) {
            return "NVIDIA GeForce RTX / Intel Arc tùy phiên bản";
        }

        if (value.contains("swift go") || value.contains("aspire ai")) {
            return "Intel Arc / Intel UHD / AMD Radeon tùy phiên bản";
        }

        return "Card đồ họa tích hợp";
    }

    private String inferColor(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (value.contains("silver") || value.contains("bạc")) return "Bạc";
        if (value.contains("gray") || value.contains("grey") || value.contains("steel")) return "Xám";
        if (value.contains("blue")) return "Xanh";

        return "Đang cập nhật";
    }

    private String inferWeight(String name) {
        String value = name.toLowerCase(Locale.ROOT);

        if (
                value.contains("swift edge")
                        || value.contains("swift go")
                        || value.contains("swift 14")
                        || value.contains("swift x14")
        ) {
            return "Khoảng 1.2kg - 1.5kg";
        }

        if (value.contains(" 14 ") || value.contains("ag14") || value.contains("al14")) {
            return "Khoảng 1.4kg - 1.5kg";
        }

        if (value.contains(" 15 ") || value.contains("ag15") || value.contains("al15") || value.contains("a515")) {
            return "Khoảng 1.7kg - 1.8kg";
        }

        if (value.contains(" 16 ") || value.contains("al16") || value.contains("a16")) {
            return "Khoảng 1.6kg - 1.8kg";
        }

        return "Đang cập nhật";
    }

    private LaptopSeed laptop(String name, String sku, String price, Integer stock) {
        return new LaptopSeed(
                name,
                generateSlug(name),
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
    private static class LaptopSeed {
        private String name;
        private String slug;
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