package com.example.techstore.config;

import com.example.techstore.entity.NewsPost;
import com.example.techstore.entity.User;
import com.example.techstore.enums.NewsStatus;
import com.example.techstore.enums.UserRole;
import com.example.techstore.repository.NewsPostRepository;
import com.example.techstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Order(70)
public class DemoNewsSeeder implements CommandLineRunner {

    private static final String DEMO_THUMBNAIL_URL =
            "https://res.cloudinary.com/dlbgs5wps/image/upload/v1779470207/Yellow_Blue_and_Pink_Modern_New_Game_Banner_Landscape_pqdfqk.png";

    private final NewsPostRepository newsPostRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedNewsPosts();
    }

    private void seedNewsPosts() {
        User author = findDefaultAuthor();

        List<NewsSeed> newsPosts = List.of(
                new NewsSeed(
                        "Kinh nghiệm chọn laptop gaming phù hợp năm 2026",
                        "kinh-nghiem-chon-laptop-gaming-phu-hop-nam-2026",
                        "Laptop gaming không chỉ cần cấu hình mạnh mà còn phải cân bằng giữa hiệu năng, tản nhiệt, màn hình và ngân sách.",
                        """
                        Khi chọn laptop gaming, người dùng không nên chỉ nhìn vào card đồ họa hoặc dung lượng RAM. Một chiếc laptop gaming tốt cần có sự cân bằng giữa CPU, GPU, hệ thống tản nhiệt, màn hình và khả năng nâng cấp.

                        Với nhu cầu chơi game phổ thông, các dòng máy sử dụng CPU Intel Core i5 hoặc AMD Ryzen 5 kết hợp GPU rời tầm trung đã có thể đáp ứng tốt các tựa game eSports. Nếu bạn chơi game AAA, dựng video hoặc livestream, nên ưu tiên CPU mạnh hơn, GPU cao hơn và RAM tối thiểu 16GB.

                        Màn hình cũng là yếu tố quan trọng. Tần số quét 144Hz trở lên giúp trải nghiệm game mượt hơn, đặc biệt với các tựa game FPS. Ngoài ra, người dùng nên kiểm tra khả năng nâng cấp SSD, RAM và chính sách bảo hành trước khi mua.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Nên mua màn hình 2K hay 4K cho học tập, làm việc và chơi game?",
                        "nen-mua-man-hinh-2k-hay-4k-cho-hoc-tap-lam-viec-va-choi-game",
                        "Màn hình 2K và 4K đều có ưu điểm riêng. Lựa chọn phù hợp phụ thuộc vào kích thước màn hình, nhu cầu sử dụng và cấu hình máy.",
                        """
                        Màn hình 2K thường là lựa chọn cân bằng cho người dùng cần không gian hiển thị rộng, hình ảnh sắc nét và mức giá hợp lý. Với kích thước 27 inch, độ phân giải 2K mang lại trải nghiệm tốt cho học tập, làm việc văn phòng, lập trình và chơi game.

                        Màn hình 4K phù hợp hơn với người làm thiết kế, dựng video, chỉnh ảnh hoặc cần hiển thị nội dung độ phân giải cao. Tuy nhiên, nếu dùng để chơi game, màn hình 4K sẽ yêu cầu cấu hình máy mạnh hơn để đạt được FPS ổn định.

                        Nếu ngân sách vừa phải và cần hiệu năng tốt, màn hình 2K 144Hz là lựa chọn rất đáng cân nhắc. Nếu ưu tiên độ sắc nét, làm việc sáng tạo nội dung và có cấu hình đủ mạnh, màn hình 4K sẽ phù hợp hơn.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Build PC học tập và làm việc từ 15 triệu nên chọn linh kiện nào?",
                        "build-pc-hoc-tap-va-lam-viec-tu-15-trieu-nen-chon-linh-kien-nao",
                        "Với ngân sách khoảng 15 triệu, người dùng có thể build một bộ PC ổn định cho học tập, văn phòng, lập trình và giải trí cơ bản.",
                        """
                        Với ngân sách từ 15 triệu, cấu hình PC nên ưu tiên CPU có hiệu năng ổn định, RAM tối thiểu 16GB và SSD NVMe để đảm bảo tốc độ khởi động, mở phần mềm và xử lý đa nhiệm.

                        Nếu nhu cầu chủ yếu là học tập, làm việc văn phòng, lập trình hoặc sử dụng phần mềm nhẹ, người dùng có thể chọn CPU có đồ họa tích hợp để tiết kiệm chi phí. Nếu có nhu cầu chơi game hoặc thiết kế đồ họa, nên cân nhắc thêm card đồ họa rời phù hợp.

                        Ngoài hiệu năng, nguồn máy tính và mainboard cũng rất quan trọng. Một bộ nguồn chất lượng tốt giúp hệ thống hoạt động ổn định, trong khi mainboard phù hợp sẽ hỗ trợ nâng cấp RAM, SSD và CPU trong tương lai.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Cách chọn RAM và SSD phù hợp cho laptop, PC",
                        "cach-chon-ram-va-ssd-phu-hop-cho-laptop-pc",
                        "RAM và SSD ảnh hưởng trực tiếp tới tốc độ xử lý đa nhiệm, mở ứng dụng và trải nghiệm sử dụng hằng ngày.",
                        """
                        RAM là bộ nhớ tạm giúp máy tính xử lý nhiều tác vụ cùng lúc. Với nhu cầu cơ bản, 8GB RAM vẫn có thể sử dụng được, nhưng 16GB là mức khuyến nghị cho học tập, làm việc, lập trình, thiết kế nhẹ và chơi game.

                        SSD giúp máy tính khởi động nhanh hơn, mở ứng dụng nhanh hơn và giảm thời gian chờ khi xử lý dữ liệu. Người dùng nên ưu tiên SSD NVMe nếu mainboard hoặc laptop có hỗ trợ. Dung lượng 512GB là mức phù hợp cho đa số nhu cầu hiện nay.

                        Khi nâng cấp RAM hoặc SSD, cần kiểm tra chuẩn hỗ trợ của máy, số khe cắm còn trống và giới hạn dung lượng tối đa. Nếu không chắc chắn, khách hàng nên liên hệ kỹ thuật viên để được tư vấn trước khi nâng cấp.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Top phụ kiện gaming nên có cho góc máy cá nhân",
                        "top-phu-kien-gaming-nen-co-cho-goc-may-ca-nhan",
                        "Một góc máy gaming tốt không chỉ cần PC mạnh mà còn cần màn hình, bàn phím, chuột, tai nghe và ghế ngồi phù hợp.",
                        """
                        Phụ kiện gaming giúp cải thiện trải nghiệm chơi game và làm việc hằng ngày. Một chiếc màn hình có tần số quét cao sẽ giúp hình ảnh mượt hơn, đặc biệt trong các tựa game FPS hoặc MOBA.

                        Bàn phím cơ, chuột gaming và tai nghe chất lượng tốt cũng là những phụ kiện đáng đầu tư. Bàn phím cơ cho cảm giác gõ tốt, chuột gaming có độ nhạy cao và tai nghe giúp người chơi nghe rõ âm thanh trong game.

                        Ngoài ra, người dùng nên quan tâm tới sự thoải mái khi sử dụng lâu dài. Ghế ngồi, bàn làm việc và cách bố trí dây cáp gọn gàng cũng góp phần tạo nên một góc máy đẹp và hiệu quả.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Hướng dẫn bảo quản laptop để dùng bền hơn",
                        "huong-dan-bao-quan-laptop-de-dung-ben-hon",
                        "Bảo quản laptop đúng cách giúp máy hoạt động ổn định, giảm hư hỏng và kéo dài tuổi thọ linh kiện.",
                        """
                        Để laptop hoạt động bền bỉ, người dùng nên đặt máy ở nơi thoáng mát, tránh che khe tản nhiệt khi sử dụng. Không nên đặt laptop lên chăn, gối hoặc bề mặt mềm vì có thể làm máy nóng nhanh hơn.

                        Người dùng nên vệ sinh laptop định kỳ, đặc biệt là khu vực bàn phím, màn hình và khe tản nhiệt. Với máy sử dụng lâu, việc vệ sinh bên trong và thay keo tản nhiệt có thể giúp cải thiện nhiệt độ đáng kể.

                        Ngoài ra, cần tránh để laptop tiếp xúc với nước, va đập mạnh hoặc sạc bằng bộ sạc không rõ nguồn gốc. Khi di chuyển, nên sử dụng balo chống sốc để bảo vệ máy tốt hơn.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Khi nào nên nâng cấp card đồ họa cho PC?",
                        "khi-nao-nen-nang-cap-card-do-hoa-cho-pc",
                        "Card đồ họa ảnh hưởng lớn tới hiệu năng chơi game, dựng video, thiết kế 3D và các tác vụ xử lý hình ảnh.",
                        """
                        Người dùng nên cân nhắc nâng cấp card đồ họa khi máy không còn đáp ứng tốt nhu cầu chơi game, dựng video hoặc xử lý đồ họa. Dấu hiệu thường gặp là FPS thấp, giật lag, render chậm hoặc không thể chạy phần mềm mới.

                        Trước khi nâng cấp GPU, cần kiểm tra công suất nguồn, kích thước case, chuẩn kết nối mainboard và khả năng tương thích với CPU. Nếu CPU quá yếu, việc nâng cấp GPU mạnh có thể không mang lại hiệu quả tối đa.

                        Ngoài ra, nên xác định rõ nhu cầu sử dụng. Với game eSports, GPU tầm trung có thể đủ. Với game AAA, dựng video 4K hoặc thiết kế 3D, người dùng nên chọn GPU mạnh hơn và có dung lượng VRAM phù hợp.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                ),
                new NewsSeed(
                        "Chính sách bảo hành và đổi trả tại TechStore",
                        "chinh-sach-bao-hanh-va-doi-tra-tai-techstore",
                        "TechStore hỗ trợ bảo hành, đổi trả theo điều kiện sản phẩm và chính sách của từng nhà sản xuất.",
                        """
                        TechStore áp dụng chính sách bảo hành theo từng nhóm sản phẩm và quy định của nhà sản xuất. Khi mua hàng, khách hàng nên giữ lại hóa đơn, hộp sản phẩm và phụ kiện đi kèm để quá trình bảo hành thuận tiện hơn.

                        Sản phẩm có thể được hỗ trợ đổi trả nếu phát sinh lỗi kỹ thuật, giao sai mẫu, sai cấu hình hoặc không đúng mô tả. Điều kiện đổi trả sẽ phụ thuộc vào tình trạng sản phẩm, thời gian nhận hàng và chính sách cụ thể tại thời điểm mua.

                        Nếu cần hỗ trợ, khách hàng có thể liên hệ TechStore qua trang Liên hệ hoặc đến trực tiếp cửa hàng để được kiểm tra và tư vấn phương án xử lý phù hợp.
                        """,
                        DEMO_THUMBNAIL_URL,
                        NewsStatus.PUBLISHED
                )
        );

        for (NewsSeed seed : newsPosts) {
            upsertNews(seed, author);
        }
    }

    private void upsertNews(NewsSeed seed, User author) {
        NewsPost newsPost = newsPostRepository.findBySlugIgnoreCase(seed.slug())
                .orElseGet(NewsPost::new);

        newsPost.setTitle(seed.title());
        newsPost.setSlug(seed.slug());
        newsPost.setSummary(seed.summary());
        newsPost.setContent(seed.content());
        newsPost.setThumbnailUrl(seed.thumbnailUrl());
        newsPost.setAuthor(author);
        newsPost.setStatus(seed.status());
        newsPost.setDeletedAt(null);

        newsPostRepository.save(newsPost);
    }

    private User findDefaultAuthor() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getDeletedAt() == null)
                .filter(user ->
                        user.getRole() == UserRole.ROLE_ADMIN ||
                                user.getRole() == UserRole.ROLE_STAFF
                )
                .findFirst()
                .orElse(null);
    }

    private record NewsSeed(
            String title,
            String slug,
            String summary,
            String content,
            String thumbnailUrl,
            NewsStatus status
    ) {
    }
}