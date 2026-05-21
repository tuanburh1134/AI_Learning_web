package com.aismart.learning.service.base;

import com.aismart.learning.dto.request.GenerateQuizRequest;
import com.aismart.learning.dto.response.QuizResponse;

public interface QuizService {
    QuizResponse generateQuiz(GenerateQuizRequest request);
}
