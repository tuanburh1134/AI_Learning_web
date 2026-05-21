package com.aismart.learning.controller;

import com.aismart.learning.dto.request.UserRegisterRequest;
import com.aismart.learning.dto.response.AuthResponse;
import com.aismart.learning.service.base.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse error = new AuthResponse();
            error.setMessage("Lỗi đăng ký: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserRegisterRequest request) {
        try {
            String username = request.getUsername() != null ? request.getUsername() : request.getEmail();
            AuthResponse response = userService.login(username, request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse error = new AuthResponse();
            error.setMessage("Lỗi đăng nhập: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
