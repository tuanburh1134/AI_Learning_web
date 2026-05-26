package com.aismart.learning.exception;

/**
 * Ngoại lệ khi không tìm thấy tài nguyên trong hệ thống.
 * Ví dụ: không tìm thấy user với id đã cho.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("Không tìm thấy %s với %s = '%s'", resourceName, fieldName, fieldValue));
    }
}
