package com.example.techstore.config;

import com.example.techstore.entity.ContactMessage;
import com.example.techstore.enums.ContactStatus;
import com.example.techstore.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(80)
public class DemoContactMessageSeeder implements CommandLineRunner {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedContactMessages();
    }

    private void seedContactMessages() {
        List<ContactMessageSeed> messages = List.of(
                new ContactMessageSeed(
                        "Nguyễn Minh Anh",
                        "minhanh@example.com",
                        "0901234567",
                        "Tư vấn build PC khoảng 20 triệu",
                        "Chào TechStore, tôi muốn build một bộ PC khoảng 20 triệu để học lập trình, làm việc văn phòng và chơi một số game eSports. Nhờ shop tư vấn giúp cấu hình phù hợp.",
                        ContactStatus.NEW
                ),
                new ContactMessageSeed(
                        "Trần Quốc Huy",
                        "quochuy@example.com",
                        "0912345678",
                        "Hỏi về bảo hành màn hình LG",
                        "Tôi muốn hỏi màn hình LG mua tại TechStore được bảo hành bao lâu? Nếu màn hình bị lỗi điểm ảnh thì quy trình bảo hành như thế nào?",
                        ContactStatus.PROCESSING
                ),
                new ContactMessageSeed(
                        "Lê Thị Thanh",
                        "thanhle@example.com",
                        "0923456789",
                        "Hỗ trợ kiểm tra đơn hàng",
                        "Tôi đã đặt một đơn hàng laptop gaming nhưng muốn kiểm tra hiện tại đơn hàng đang ở trạng thái nào và dự kiến khi nào giao.",
                        ContactStatus.REPLIED
                ),
                new ContactMessageSeed(
                        "Phạm Hoàng Nam",
                        "hoangnam@example.com",
                        "0934567890",
                        "Tư vấn laptop học tập",
                        "Tôi cần mua laptop cho sinh viên ngành công nghệ thông tin, ngân sách khoảng 15 triệu. Shop có thể tư vấn mẫu phù hợp không?",
                        ContactStatus.NEW
                ),
                new ContactMessageSeed(
                        "Võ Gia Bảo",
                        "giabao@example.com",
                        "0945678901",
                        "Hỏi về nâng cấp RAM và SSD",
                        "Tôi đang dùng laptop có RAM 8GB và SSD 256GB. Tôi muốn nâng cấp lên RAM 16GB và SSD 1TB, shop có hỗ trợ kiểm tra tương thích không?",
                        ContactStatus.PROCESSING
                ),
                new ContactMessageSeed(
                        "Đặng Thu Hà",
                        "thuha@example.com",
                        "0956789012",
                        "Yêu cầu xuất hóa đơn",
                        "Tôi muốn mua linh kiện máy tính cho công ty và cần xuất hóa đơn VAT. Nhờ TechStore hướng dẫn thông tin cần cung cấp.",
                        ContactStatus.REPLIED
                ),
                new ContactMessageSeed(
                        "Bùi Đức Long",
                        "duclong@example.com",
                        "0967890123",
                        "Hỏi chính sách đổi trả laptop",
                        "Nếu laptop nhận hàng bị lỗi phần cứng hoặc không đúng cấu hình đã đặt thì tôi có thể đổi trả trong bao lâu?",
                        ContactStatus.CLOSED
                ),
                new ContactMessageSeed(
                        "Ngô Phương Linh",
                        "phuonglinh@example.com",
                        "0978901234",
                        "Tư vấn màn hình làm thiết kế",
                        "Tôi cần mua màn hình để thiết kế đồ họa, chỉnh ảnh và làm video. Shop tư vấn giúp nên chọn màn hình 2K hay 4K.",
                        ContactStatus.NEW
                ),
                new ContactMessageSeed(
                        "Huỳnh Anh Khoa",
                        "anhkhoa@example.com",
                        "0989012345",
                        "Báo lỗi áp mã giảm giá",
                        "Tôi nhập mã TECHSTORE10 ở bước thanh toán nhưng hệ thống báo không đủ điều kiện. Nhờ shop kiểm tra giúp điều kiện sử dụng mã.",
                        ContactStatus.PROCESSING
                ),
                new ContactMessageSeed(
                        "Mai Ngọc Trâm",
                        "ngoctram@example.com",
                        "0990123456",
                        "Hỏi dịch vụ kỹ thuật tại nhà",
                        "TechStore có hỗ trợ kỹ thuật tại nhà để vệ sinh máy, cài đặt phần mềm và kiểm tra lỗi máy tính không?",
                        ContactStatus.CLOSED
                )
        );

        for (ContactMessageSeed seed : messages) {
            upsertContactMessage(seed);
        }
    }

    private void upsertContactMessage(ContactMessageSeed seed) {
        ContactMessage contactMessage = findExistingMessage(seed.email(), seed.subject());

        if (contactMessage == null) {
            contactMessage = new ContactMessage();
        }

        contactMessage.setFullName(seed.fullName());
        contactMessage.setEmail(seed.email());
        contactMessage.setPhone(seed.phone());
        contactMessage.setSubject(seed.subject());
        contactMessage.setMessage(seed.message());
        contactMessage.setStatus(seed.status());
        contactMessage.setDeletedAt(null);

        contactMessageRepository.save(contactMessage);
    }

    private ContactMessage findExistingMessage(String email, String subject) {
        return contactMessageRepository.findAll()
                .stream()
                .filter(message -> message.getEmail() != null)
                .filter(message -> message.getSubject() != null)
                .filter(message -> message.getEmail().equalsIgnoreCase(email))
                .filter(message -> message.getSubject().equalsIgnoreCase(subject))
                .findFirst()
                .orElse(null);
    }

    private record ContactMessageSeed(
            String fullName,
            String email,
            String phone,
            String subject,
            String message,
            ContactStatus status
    ) {
    }
}