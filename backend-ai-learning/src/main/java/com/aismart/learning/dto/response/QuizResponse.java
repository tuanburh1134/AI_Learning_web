package com.aismart.learning.dto.response;

<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO trả về thông tin bài kiểm tra đã tạo.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponse {

    private Long id;
    private String title;
    private String subject;
    private Integer gradeLevel;
    private String difficulty;
    private List<String> questions;
=======
import java.util.List;

public class QuizResponse {
    private Long id;
    private String title;
    private List<String> questions;
    // getters/setters
>>>>>>> origin/develop
}
