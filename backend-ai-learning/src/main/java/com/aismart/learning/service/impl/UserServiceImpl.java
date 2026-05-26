package com.aismart.learning.service.impl;

<<<<<<< HEAD
import com.aismart.learning.dto.request.UserRegisterRequest;
import com.aismart.learning.dto.request.ProfileUpdateRequest;
import com.aismart.learning.dto.response.AuthResponse;
import com.aismart.learning.entity.User;
import com.aismart.learning.exception.AppRuntimeException;
import com.aismart.learning.repository.UserRepository;
import com.aismart.learning.service.base.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Triển khai các nghiệp vụ liên quan đến người dùng.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public AuthResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        log.info("Đang cập nhật hồ sơ cho userId: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppRuntimeException("Không tìm thấy người dùng với ID: " + userId));

        user.setGrade(request.getGrade());
        if (request.getSubjects() != null) {
            user.setSubjects(String.join(",", request.getSubjects()));
        }
        user.setCurrentLevel(request.getCurrentLevel());
        user.setGoal(request.getGoal());
        user.setOnboarded(true);

        User savedUser = userRepository.save(user);
        log.info("Cập nhật hồ sơ thành công cho userId: {}", savedUser.getId());
        return buildAuthResponse(savedUser, "Cập nhật hồ sơ thành công");
    }

    @Override
    @Transactional
    public AuthResponse register(UserRegisterRequest request) {
        log.info("Đang xử lý đăng ký cho email: {}", request.getEmail());

        validateEmailNotExists(request.getEmail());
        validateUsernameNotExists(request.getUsername());

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: hash mật khẩu bằng BCrypt
                .fullName(request.getFullName())
                .build();

        User savedUser = userRepository.save(user);
        log.info("Đăng ký thành công cho userId: {}", savedUser.getId());

        return buildAuthResponse(savedUser, "Đăng ký thành công");
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(String usernameOrEmail, String password) {
        log.info("Đang xử lý đăng nhập cho: {}", usernameOrEmail);

        User user = findUserByUsernameOrEmail(usernameOrEmail);
        validatePassword(password, user.getPassword());

        log.info("Đăng nhập thành công cho userId: {}", user.getId());
        return buildAuthResponse(user, "Đăng nhập thành công");
    }

    // ==================== Private helpers ====================

    private void validateEmailNotExists(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AppRuntimeException("Email '" + email + "' đã được sử dụng");
        }
    }

    private void validateUsernameNotExists(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new AppRuntimeException("Tên đăng nhập '" + username + "' đã được sử dụng");
        }
    }

    private User findUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new AppRuntimeException("Tên đăng nhập hoặc mật khẩu không đúng"));
    }

    private void validatePassword(String rawPassword, String storedPassword) {
        // TODO: thay bằng BCrypt khi tích hợp Spring Security
        if (!rawPassword.equals(storedPassword)) {
            throw new AppRuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
    }

    private AuthResponse buildAuthResponse(User user, String message) {
        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .token(generateSimpleToken()) // TODO: thay bằng JWT
                .message(message)
                .grade(user.getGrade())
                .subjects(user.getSubjects())
                .currentLevel(user.getCurrentLevel())
                .goal(user.getGoal())
                .onboarded(user.getOnboarded())
                .build();
    }

    private String generateSimpleToken() {
        // TODO: thay bằng JWT token khi tích hợp Spring Security
        return "token_" + UUID.randomUUID();
=======
import com.aismart.learning.service.base.UserService;
import com.aismart.learning.dto.response.UserResponse;

public class UserServiceImpl implements UserService {
    @Override
    public UserResponse register(String username, String password) {
        // TODO: implement registration
        return null;
>>>>>>> origin/develop
    }
}
