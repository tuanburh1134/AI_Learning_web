package com.aismart.learning.dto.request;

<<<<<<< HEAD
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO chứa thông tin yêu cầu tạo bài kiểm tra AI.
 */
@Getter
@Setter
public class GenerateQuizRequest {

    @NotNull(message = "Lớp học không được để trống")
    @Min(value = 1, message = "Lớp học phải từ 1 đến 12")
    @Max(value = 12, message = "Lớp học phải từ 1 đến 12")
    private Integer gradeLevel;

    @NotBlank(message = "Môn học không được để trống")
    private String subject;

    @NotBlank(message = "Mức độ không được để trống")
    private String difficulty;

    @NotBlank(message = "Mục tiêu học tập không được để trống")
    private String goal;

    @NotNull(message = "Số câu hỏi không được để trống")
    @Min(value = 1, message = "Số câu hỏi phải ít nhất là 1")
    @Max(value = 50, message = "Số câu hỏi không được vượt quá 50")
    private Integer questionCount;
=======
public class GenerateQuizRequest {
    private Integer gradeLevel; // lớp mấy
    private String subject;
    private String difficulty; // basic/advanced
    private String goal; // "mất gốc" | "ôn tập" | "vượt"
    private Integer questionCount;
    // getters/setters
>>>>>>> origin/develop
}
