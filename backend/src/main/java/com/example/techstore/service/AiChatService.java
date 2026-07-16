package com.example.techstore.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.techstore.entity.ChatMessage;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiChatService {

    private final JdbcTemplate jdbcTemplate;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(List<ChatMessage> chatHistory) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API Key is missing. Returning default message.");
            return "Xin lỗi, hiện tại không có nhân viên trực. Vui lòng để lại tin nhắn hoặc liên hệ hotline.";
        }

        try {
            String url = GEMINI_API_URL + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Xây dựng payload request
            Map<String, Object> requestBody = new HashMap<>();
            
            // Truy vấn lấy danh sách sản phẩm
            String productContext = "Hiện tại cửa hàng chưa có thông tin sản phẩm.";
            try {
                String sql = "SELECT p.name, MIN(COALESCE(v.sale_price, v.price)), c.name " +
                             "FROM products p " +
                             "JOIN product_variants v ON p.id = v.product_id " +
                             "JOIN categories c ON p.category_id = c.id " +
                             "WHERE p.status = 'ACTIVE' AND p.deleted_at IS NULL AND v.deleted_at IS NULL AND v.status = 'ACTIVE' " +
                             "GROUP BY p.id, c.name LIMIT 500";
                
                List<String> products = jdbcTemplate.query(sql, (rs, rowNum) -> 
                    "- [" + rs.getString(3) + "] " + rs.getString(1) + " (Giá từ: " + String.format("%,.0f", rs.getBigDecimal(2)) + "đ)"
                );
                if (!products.isEmpty()) {
                    productContext = "Danh sách sản phẩm cửa hàng đang kinh doanh (hãy dựa vào đây để tư vấn, không tự bịa ra sản phẩm khác):\n" 
                                     + String.join("\n", products);
                }
            } catch (Exception e) {
                log.error("Lỗi khi lấy dữ liệu sản phẩm cho AI", e);
            }

            // Xây dựng nội dung system prompt
            Map<String, Object> systemInstruction = new HashMap<>();
            Map<String, Object> sysPart = new HashMap<>();
            sysPart.put("text", "Bạn là AI hỗ trợ khách hàng của cửa hàng TechStore chuyên bán đồ điện tử (Laptop, PC, điện thoại, phụ kiện). " +
                                "Nhiệm vụ của bạn là giải đáp thắc mắc, tư vấn sản phẩm hoặc chính sách cho khách hàng một cách lịch sự, thân thiện và ngắn gọn.\n\n" +
                                productContext);
            systemInstruction.put("parts", List.of(sysPart));
            requestBody.put("systemInstruction", systemInstruction);

            // Xây dựng lịch sử hội thoại
            List<Map<String, Object>> contents = new ArrayList<>();
            for (ChatMessage msg : chatHistory) {
                Map<String, Object> content = new HashMap<>();
                // Nếu sender == null, đây là tin nhắn của AI (model)
                content.put("role", msg.getSender() == null ? "model" : "user");
                
                Map<String, Object> part = new HashMap<>();
                part.put("text", msg.getMessage());
                content.put("parts", List.of(part));
                
                contents.add(content);
            }

            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    Map<String, Object> resContent = (Map<String, Object>) firstCandidate.get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) resContent.get("parts");
                    
                    if (resParts != null && !resParts.isEmpty()) {
                        return (String) resParts.get(0).get("text");
                    }
                }
            }
            
            return "Xin lỗi, hệ thống AI của tôi đang gặp chút sự cố, vui lòng đợi nhân viên hỗ trợ.";
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Gemini Error", e);

            return "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.\n" + e.getMessage();
        }
    }
}
