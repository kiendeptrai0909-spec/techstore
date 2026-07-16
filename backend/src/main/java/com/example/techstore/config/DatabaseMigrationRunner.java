package com.example.techstore.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
@Slf4j
public class DatabaseMigrationRunner {

    public DatabaseMigrationRunner(DataSource dataSource) {
        log.info("Starting database migration for ProductVariant specifications and description...");
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            
            // 1. Thêm cột description vào product_variants nếu chưa có
            stmt.execute("ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS description TEXT;");
            log.info("Step 1: Ensured description column exists in product_variants");

            // 2. Thêm cột product_variant_id vào product_specifications nếu chưa có
            stmt.execute("ALTER TABLE product_specifications ADD COLUMN IF NOT EXISTS product_variant_id BIGINT;");
            log.info("Step 2: Ensured product_variant_id column exists in product_specifications");

            // 3. Di chuyển dữ liệu cũ: Ánh xạ product_id sang product_variant_id đầu tiên tìm thấy
            // Để tránh lỗi nếu cột product_id đã bị xóa từ trước, ta kiểm tra cột product_id có tồn tại hay không.
            boolean hasProductId = false;
            try {
                conn.prepareStatement("SELECT product_id FROM product_specifications LIMIT 1").execute();
                hasProductId = true;
            } catch (Exception ignored) {}

            if (hasProductId) {
                stmt.execute(
                    "UPDATE product_specifications ps " +
                    "SET product_variant_id = (SELECT id FROM product_variants pv WHERE pv.product_id = ps.product_id LIMIT 1) " +
                    "WHERE ps.product_variant_id IS NULL AND ps.product_id IS NOT NULL;"
                );
                log.info("Step 3: Migrated specification data from product_id to product_variant_id");
            }

            // 4. Xóa bỏ các dòng không hợp lệ (mồ côi) trước khi set NOT NULL
            stmt.execute("DELETE FROM product_specifications WHERE product_variant_id IS NULL;");

            // 5. Cài đặt các ràng buộc (Constraints) mới
            // 5.1 Thay đổi cột product_variant_id thành NOT NULL
            stmt.execute("ALTER TABLE product_specifications ALTER COLUMN product_variant_id SET NOT NULL;");
            
            // 5.2 Xóa unique constraint cũ
            stmt.execute("ALTER TABLE product_specifications DROP CONSTRAINT IF EXISTS uk_product_specification_key;");
            stmt.execute("ALTER TABLE product_specifications DROP CONSTRAINT IF EXISTS uq_product_specification_key;");
            
            // 5.3 Xóa foreign key cũ đến bảng products
            stmt.execute("ALTER TABLE product_specifications DROP CONSTRAINT IF EXISTS fk_product_specifications_product;");
            
            // 5.4 Xóa cột product_id cũ nếu có
            if (hasProductId) {
                stmt.execute("ALTER TABLE product_specifications DROP COLUMN IF EXISTS product_id;");
            }
            log.info("Step 4: Cleaned up old columns and constraints on product_specifications");

            // 5.5 Tạo unique constraint mới
            stmt.execute("ALTER TABLE product_specifications DROP CONSTRAINT IF EXISTS uk_variant_specification_key;");
            stmt.execute(
                "ALTER TABLE product_specifications " +
                "ADD CONSTRAINT uk_variant_specification_key UNIQUE (product_variant_id, specification_key_id);"
            );
            
            // 5.6 Tạo foreign key mới
            stmt.execute("ALTER TABLE product_specifications DROP CONSTRAINT IF EXISTS fk_product_specifications_variant;");
            stmt.execute(
                "ALTER TABLE product_specifications " +
                "ADD CONSTRAINT fk_product_specifications_variant " +
                "FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE;"
            );
            log.info("Step 5: Successfully configured foreign keys and unique constraints for product_specifications");

            log.info("Database migration completed successfully!");
        } catch (Exception e) {
            log.error("Database migration failed: ", e);
        }
    }
}
