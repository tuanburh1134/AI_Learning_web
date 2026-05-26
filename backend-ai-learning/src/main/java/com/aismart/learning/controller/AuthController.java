package com.aismart.learning.controller;

<<<<<<< HEAD
import com.aismart.learning.dto.request.GoogleAuthRequest;
import com.aismart.learning.dto.request.UserRegisterRequest;
import com.aismart.learning.dto.request.ProfileUpdateRequest;
import com.aismart.learning.dto.response.ApiResponse;
import com.aismart.learning.dto.response.AuthResponse;
import com.aismart.learning.service.base.UserService;
import com.aismart.learning.service.impl.GoogleAuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các endpoint xác thực: đăng ký, đăng nhập.
 * Base URL: /api/auth
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final GoogleAuthServiceImpl googleAuthService;

    /**
     * Đăng ký tài khoản mới.
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {

        log.info("Nhận request đăng ký cho email: {}", request.getEmail());
        AuthResponse response = userService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Đăng ký thành công", response));
    }

    /**
     * Đăng nhập bằng username hoặc email.
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody UserRegisterRequest request) {

        String usernameOrEmail = request.getUsername() != null
                ? request.getUsername()
                : request.getEmail();

        log.info("Nhận request đăng nhập cho: {}", usernameOrEmail);
        AuthResponse response = userService.login(usernameOrEmail, request.getPassword());
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    /**
     * Đăng nhập bằng Google OAuth2.
     * POST /api/auth/google
     */
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
            @RequestBody GoogleAuthRequest request) {

        log.info("Nhận request đăng nhập Google");
        AuthResponse response = googleAuthService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập Google thành công", response));
    }

    /**
     * Cập nhật hồ sơ học sinh (Onboarding).
     * PUT /api/auth/profile/{userId}
     */
    @PutMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<AuthResponse>> updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequest request) {

        log.info("Nhận request cập nhật hồ sơ cho userId: {}", userId);
        AuthResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật hồ sơ thành công", response));
    }
=======
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    // TODO: Authentication endpoints (register/login)
>>>>>>> origin/develop
}
