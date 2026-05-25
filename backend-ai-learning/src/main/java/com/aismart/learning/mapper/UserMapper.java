package com.aismart.learning.mapper;

import com.aismart.learning.dto.response.UserResponse;
import com.aismart.learning.entity.User;
import org.mapstruct.Mapper;

/**
 * MapStruct mapper chuyển đổi giữa User entity và các DTO.
 * Spring sẽ tự inject implementation được generate lúc compile.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Chuyển User entity sang UserResponse DTO (loại bỏ password).
     */
    UserResponse toUserResponse(User user);
}
