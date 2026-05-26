package com.aismart.learning.exception;

<<<<<<< HEAD
/**
 * Ngoại lệ runtime cho các lỗi nghiệp vụ của ứng dụng.
 * Ví dụ: email đã tồn tại, mật khẩu không đúng...
 */
public class AppRuntimeException extends RuntimeException {

    public AppRuntimeException(String message) {
        super(message);
    }

    public AppRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }
=======
public class AppRuntimeException extends RuntimeException {
    public AppRuntimeException(String message) { super(message); }
>>>>>>> origin/develop
}
