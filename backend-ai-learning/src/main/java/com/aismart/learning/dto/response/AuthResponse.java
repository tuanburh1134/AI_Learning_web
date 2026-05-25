package com.aismart.learning.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO trả về sau khi đăng ký / đăng nhập thành công.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String token;
    private String message;
    private String grade;
    private String subjects;
    private String currentLevel;
    private String goal;
    private Boolean onboarded;
}
