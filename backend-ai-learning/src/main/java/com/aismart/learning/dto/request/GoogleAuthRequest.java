package com.aismart.learning.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Request body chứa Google access_token gửi từ Frontend.
 */
@Getter
@NoArgsConstructor
public class GoogleAuthRequest {
    private String credential; // Google access_token
}
