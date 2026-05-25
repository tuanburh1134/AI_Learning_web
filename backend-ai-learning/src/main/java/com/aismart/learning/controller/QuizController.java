package com.aismart.learning.controller;

import com.aismart.learning.dto.request.GenerateQuizRequest;
import com.aismart.learning.dto.response.ApiResponse;
import com.aismart.learning.dto.response.QuizResponse;
import com.aismart.learning.service.base.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các endpoint liên quan đến bài kiểm tra.
 * Base URL: /api/quizzes
 */
@Slf4j
@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    /**
     * Tạo đề kiểm tra bằng AI.
     * POST /api/quizzes/generate
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<QuizResponse>> generateQuiz(
            @Valid @RequestBody GenerateQuizRequest request) {

        log.info("Nhận request tạo đề kiểm tra: môn={}, lớp={}", request.getSubject(), request.getGradeLevel());
        QuizResponse response = quizService.generateQuiz(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đề kiểm tra thành công", response));
    }
}
