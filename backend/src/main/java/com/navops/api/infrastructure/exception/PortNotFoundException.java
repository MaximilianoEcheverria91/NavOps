package com.navops.api.infrastructure.exception;

public class PortNotFoundException extends RuntimeException {
    public PortNotFoundException(String message) {
        super(message);
    }
}
