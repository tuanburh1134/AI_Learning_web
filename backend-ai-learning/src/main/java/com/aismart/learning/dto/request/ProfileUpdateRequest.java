package com.aismart.learning.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

/**
 * DTO chứa thông tin cập nhật hồ sơ (Onboarding) của học sinh.
 */
@Getter
@Setter
public class ProfileUpdateRequest {
    private String grade;
    private List<String> subjects;
    private String currentLevel;
    private String goal;
}
