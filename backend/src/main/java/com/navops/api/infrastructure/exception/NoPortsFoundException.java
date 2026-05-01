package com.navops.api.infrastructure.exception;

public class NoPortsFoundException extends RuntimeException {
    public NoPortsFoundException(String message) {
        super(message);
    }
}
