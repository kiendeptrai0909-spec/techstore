package com.example.techstore.config;

import com.example.techstore.entity.Faq;
import com.example.techstore.enums.ProductStatus;
import com.example.techstore.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(60)
public class DemoFaqSeeder implements CommandLineRunner {

    private final FaqRepository faqRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedFaqs();
    }

    private void seedFaqs() {
        List<FaqSeed> faqs = List.of(
                new FaqSeed(
                        "TechStore có bán sản phẩm chính hãng không?",
                        "Có. TechStore chỉ kinh doanh các sản phẩm có nguồn gốc rõ ràng, đầy đủ thông tin thương hiệu, cấu hình và chính sách bảo hành. Với các sản phẩm laptop, màn hình, linh kiện và phụ kiện, khách hàng sẽ được tư vấn kỹ trước khi mua.",
                        1,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Thời gian bảo hành sản phẩm là bao lâu?",
                        "Thời gian bảo hành tùy thuộc vào từng sản phẩm và chính sách của nhà sản xuất. Thông thường laptop, màn hình và linh kiện có thời gian bảo hành từ 12 đến 36 tháng. Thông tin bảo hành cụ thể sẽ được hiển thị trong chi tiết sản phẩm hoặc hóa đơn mua hàng.",
                        2,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "TechStore có hỗ trợ giao hàng toàn quốc không?",
                        "Có. TechStore hỗ trợ giao hàng toàn quốc. Phí vận chuyển và thời gian giao hàng sẽ phụ thuộc vào địa chỉ nhận hàng, kích thước sản phẩm và đơn vị vận chuyển.",
                        3,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Tôi có thể kiểm tra trạng thái đơn hàng ở đâu?",
                        "Sau khi đăng nhập, khách hàng có thể vào mục Tài khoản của tôi, chọn Đơn hàng của tôi để xem trạng thái đơn hàng. Các trạng thái bao gồm chờ xác nhận, đã xác nhận, đang giao hàng, hoàn thành hoặc đã hủy.",
                        4,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "TechStore có hỗ trợ thanh toán khi nhận hàng không?",
                        "Có. Khách hàng có thể chọn phương thức thanh toán khi nhận hàng nếu đơn hàng đủ điều kiện hỗ trợ COD. Ngoài ra, hệ thống có thể mở rộng thêm các phương thức thanh toán trực tuyến trong tương lai.",
                        5,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Tôi có thể sử dụng mã giảm giá như thế nào?",
                        "Tại bước thanh toán, khách hàng nhập mã giảm giá vào ô áp mã. Nếu mã còn hiệu lực, đơn hàng đủ điều kiện giá trị tối thiểu và chưa vượt quá lượt sử dụng, hệ thống sẽ tự động tính số tiền được giảm.",
                        6,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Mỗi đơn hàng có thể dùng nhiều mã giảm giá không?",
                        "Hiện tại mỗi đơn hàng chỉ được áp dụng một mã giảm giá. Khách hàng nên chọn mã phù hợp nhất với giá trị đơn hàng để nhận ưu đãi tốt nhất.",
                        7,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Tôi có thể đổi trả sản phẩm sau khi mua không?",
                        "Khách hàng có thể yêu cầu đổi trả nếu sản phẩm gặp lỗi kỹ thuật, giao sai mẫu, sai cấu hình hoặc không đúng mô tả. Sản phẩm cần còn đầy đủ phụ kiện, hộp, hóa đơn và không bị hư hỏng do người dùng.",
                        8,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "TechStore có hỗ trợ build PC theo nhu cầu không?",
                        "Có. TechStore hỗ trợ tư vấn build PC theo nhu cầu học tập, làm việc, thiết kế đồ họa, dựng video, livestream hoặc chơi game. Khách hàng có thể liên hệ để được tư vấn cấu hình phù hợp với ngân sách.",
                        9,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Tôi có thể yêu cầu xuất hóa đơn không?",
                        "Có. Nếu khách hàng cần xuất hóa đơn, vui lòng cung cấp đầy đủ thông tin trong quá trình đặt hàng hoặc liên hệ bộ phận hỗ trợ sau khi đặt hàng thành công.",
                        10,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Sản phẩm hết hàng thì khi nào có lại?",
                        "Thời gian nhập lại hàng tùy thuộc vào nhà cung cấp và từng dòng sản phẩm. Khách hàng có thể theo dõi website hoặc liên hệ TechStore để được tư vấn sản phẩm thay thế phù hợp.",
                        11,
                        ProductStatus.ACTIVE
                ),
                new FaqSeed(
                        "Tôi có thể hủy đơn hàng sau khi đặt không?",
                        "Khách hàng có thể yêu cầu hủy đơn khi đơn hàng chưa được giao cho đơn vị vận chuyển. Nếu đơn hàng đã chuyển sang trạng thái đang giao hàng, việc hủy đơn sẽ phụ thuộc vào tình trạng vận chuyển thực tế.",
                        12,
                        ProductStatus.ACTIVE
                )
        );

        for (FaqSeed faq : faqs) {
            upsertFaq(faq);
        }
    }

    private void upsertFaq(FaqSeed seed) {
        Faq faq = findExistingFaq(seed.question());

        if (faq == null) {
            faq = new Faq();
        }

        faq.setQuestion(seed.question());
        faq.setAnswer(seed.answer());
        faq.setSortOrder(seed.sortOrder());
        faq.setStatus(seed.status());
        faq.setDeletedAt(null);

        faqRepository.save(faq);
    }

    private Faq findExistingFaq(String question) {
        return faqRepository.findAll()
                .stream()
                .filter(faq -> faq.getQuestion() != null)
                .filter(faq -> faq.getQuestion().equalsIgnoreCase(question))
                .findFirst()
                .orElse(null);
    }

    private record FaqSeed(
            String question,
            String answer,
            Integer sortOrder,
            ProductStatus status
    ) {
    }
}