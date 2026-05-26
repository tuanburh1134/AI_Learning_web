package com.aismart.learning.service.impl;

<<<<<<< HEAD
import com.aismart.learning.dto.request.GenerateQuizRequest;
import com.aismart.learning.dto.response.QuizResponse;
import com.aismart.learning.service.base.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Triển khai nghiệp vụ tạo bài kiểm tra.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        log.info("Đang tạo đề kiểm tra: môn={}, lớp={}, số câu={}",
                request.getSubject(), request.getGradeLevel(), request.getQuestionCount());

        // TODO: Tích hợp AI service để tạo câu hỏi tự động
        throw new UnsupportedOperationException("Tính năng tạo đề kiểm tra AI đang được phát triển");
=======
import com.aismart.learning.service.base.QuizService;
import com.aismart.learning.dto.request.GenerateQuizRequest;
import com.aismart.learning.dto.response.QuizResponse;

public class QuizServiceImpl implements QuizService {
    @Override
    public QuizResponse generateQuiz(GenerateQuizRequest request) {
        // TODO: integrate with AI service to generate quiz
        return null;
>>>>>>> origin/develop
    }
}
