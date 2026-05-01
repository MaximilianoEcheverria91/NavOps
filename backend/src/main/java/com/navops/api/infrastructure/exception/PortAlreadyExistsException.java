package com.navops.api.infrastructure.exception;

public class PortAlreadyExistsException extends RuntimeException {
    public PortAlreadyExistsException(String message) {
        super(message);
    }
}
