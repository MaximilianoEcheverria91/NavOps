package com.navops.api.infrastructure.exception;

public class NoProvincesFoundException extends RuntimeException {
    public NoProvincesFoundException(String message) {
        super(message);
    }
}
