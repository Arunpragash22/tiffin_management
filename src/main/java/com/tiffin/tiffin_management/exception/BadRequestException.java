package com.tiffin.tiffin_management.exception;

import java.util.Map;

public class BadRequestException extends RuntimeException {

    private final Map<String, String> validationErrors;

    public BadRequestException(String message) {
        super(message);
        this.validationErrors = null;
    }

    public BadRequestException(String message, Map<String, String> validationErrors) {
        super(message);
        this.validationErrors = validationErrors;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }
}
