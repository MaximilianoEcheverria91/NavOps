package com.navops.api.infrastructure.exception;

public class CargoValidationException extends RuntimeException {
    public CargoValidationException(String message) {
        super(message);
    }
}
