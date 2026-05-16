package com.aismart.learning.dto.request;

public class GenerateQuizRequest {
    private Integer gradeLevel; // lớp mấy
    private String subject;
    private String difficulty; // basic/advanced
    private String goal; // "mất gốc" | "ôn tập" | "vượt"
    private Integer questionCount;
    // getters/setters
}
