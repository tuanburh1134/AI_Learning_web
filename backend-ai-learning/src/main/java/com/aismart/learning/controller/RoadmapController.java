package com.aismart.learning.controller;

<<<<<<< HEAD
import com.aismart.learning.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý các endpoint liên quan đến lộ trình học tập.
 * Base URL: /api/roadmaps
 */
@Slf4j
@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    /**
     * Lấy danh sách lộ trình học tập theo môn học và lớp.
     * GET /api/roadmaps?subject=Toan&gradeLevel=10
     */
    @GetMapping
    public ResponseEntity<ApiResponse<String>> getRoadmap(
            @RequestParam String subject,
            @RequestParam Integer gradeLevel) {

        log.info("Nhận request lộ trình học tập: môn={}, lớp={}", subject, gradeLevel);
        // TODO: Tích hợp AI để tạo lộ trình cá nhân hóa
        return ResponseEntity.ok(ApiResponse.success("Tính năng lộ trình đang được phát triển"));
    }
=======
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoadmapController {
    // TODO: Endpoints to provide learning roadmaps
>>>>>>> origin/develop
}
