package com.aismart.learning.service.impl;

import com.aismart.learning.dto.request.GoogleAuthRequest;
import com.aismart.learning.dto.response.AuthResponse;
import com.aismart.learning.entity.User;
import com.aismart.learning.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.Map;
import java.util.UUID;

/**
 * Service xác thực Google Access Token và tạo/tìm user.
 * Flow: FE gửi access_token → BE gọi Google userinfo endpoint → Lấy email/name → Tạo/tìm user → Trả về AuthResponse
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleAuthServiceImpl {

    private final UserRepository userRepository;

    @Value("${google.client-id}")
    private String googleClientId;

    @Transactional
    public AuthResponse loginWithGoogle(GoogleAuthRequest request) {
        log.info("Bắt đầu xác thực Google login");

        // Gọi Google userinfo API để lấy thông tin người dùng
        Map<String, Object> userInfo = fetchGoogleUserInfo(request.getCredential());

        String email    = (String) userInfo.get("email");
        String name     = (String) userInfo.getOrDefault("name", "Google User");
        String googleId = (String) userInfo.getOrDefault("sub", "");
        Boolean verified = (Boolean) userInfo.getOrDefault("email_verified", false);

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Không thể lấy email từ tài khoản Google");
        }

        if (Boolean.FALSE.equals(verified)) {
            throw new RuntimeException("Email Google chưa được xác minh");
        }

        log.info("Google xác thực thành công cho email: {}", email);

        // Tìm hoặc tạo user
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createGoogleUser(email, name, googleId));

        log.info("Đăng nhập Google thành công cho userId: {}", user.getId());

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .token("token_" + UUID.randomUUID()) // TODO: thay bằng JWT
                .message("Đăng nhập Google thành công")
                .grade(user.getGrade())
                .subjects(user.getSubjects())
                .currentLevel(user.getCurrentLevel())
                .goal(user.getGoal())
                .onboarded(user.getOnboarded())
                .build();
    }

    /**
     * Gọi Google userinfo endpoint bằng access_token.
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> fetchGoogleUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    entity,
                    Map.class
            );
            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                throw new RuntimeException("Phản hồi không hợp lệ từ Google");
            }
            return response.getBody();
        } catch (Exception e) {
            log.error("Lỗi khi gọi Google userinfo: {}", e.getMessage());
            throw new RuntimeException("Không thể xác thực token Google: " + e.getMessage());
        }
    }

    /**
     * Tạo user mới từ tài khoản Google.
     */
    private User createGoogleUser(String email, String name, String googleId) {
        log.info("Tạo user mới từ Google account: {}", email);
        // Username = phần trước @ của email, thêm random suffix nếu trùng
        String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        String username = userRepository.findByUsername(baseUsername).isPresent()
                ? baseUsername + "_" + UUID.randomUUID().toString().substring(0, 6)
                : baseUsername;

        User newUser = User.builder()
                .email(email)
                .username(username)
                .fullName(name)
                .password("GOOGLE_OAUTH_" + UUID.randomUUID()) // không dùng để login thường
                .build();

        return userRepository.save(newUser);
    }
}
