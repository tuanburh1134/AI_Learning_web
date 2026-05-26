package com.aismart.learning.service.base;

import com.aismart.learning.dto.request.UserRegisterRequest;
import com.aismart.learning.dto.request.ProfileUpdateRequest;
import com.aismart.learning.dto.response.AuthResponse;

public interface UserService {
    AuthResponse register(UserRegisterRequest request);
    AuthResponse login(String username, String password);
    AuthResponse updateProfile(Long userId, ProfileUpdateRequest request);
}
