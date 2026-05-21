package com.aismart.learning.service.impl;

import com.aismart.learning.service.base.UserService;
import com.aismart.learning.dto.request.UserRegisterRequest;
import com.aismart.learning.dto.response.AuthResponse;
import com.aismart.learning.entity.User;
import com.aismart.learning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public AuthResponse register(UserRegisterRequest request) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // TODO: implement password hashing
        user.setFullName(request.getFullName());
        
        User savedUser = userRepository.save(user);
        
        // Return auth response
        AuthResponse response = new AuthResponse();
        response.setUserId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setUsername(savedUser.getUsername());
        response.setToken(generateToken(savedUser.getId())); // TODO: implement JWT
        response.setMessage("Đăng ký thành công");
        
        return response;
    }
    
    @Override
    public AuthResponse login(String username, String password) {
        // Find user by username or email
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(username);
        }
        
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        User foundUser = user.get();
        
        // TODO: implement password verification (currently plain text comparison)
        if (!foundUser.getPassword().equals(password)) {
            throw new IllegalArgumentException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        // Return auth response
        AuthResponse response = new AuthResponse();
        response.setUserId(foundUser.getId());
        response.setEmail(foundUser.getEmail());
        response.setFullName(foundUser.getFullName());
        response.setUsername(foundUser.getUsername());
        response.setToken(generateToken(foundUser.getId())); // TODO: implement JWT
        response.setMessage("Đăng nhập thành công");
        
        return response;
    }
    
    private String generateToken(Long userId) {
        // TODO: implement JWT token generation
        // For now, just return a simple token
        return "token_" + UUID.randomUUID().toString();
    }
}
