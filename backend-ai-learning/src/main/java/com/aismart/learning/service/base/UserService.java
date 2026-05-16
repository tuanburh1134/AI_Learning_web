package com.aismart.learning.service.base;

import com.aismart.learning.dto.response.UserResponse;

public interface UserService {
    UserResponse register(String username, String password);
}
