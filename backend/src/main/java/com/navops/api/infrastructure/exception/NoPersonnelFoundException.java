package com.navops.api.infrastructure.exception;

public class NoPersonnelFoundException extends RuntimeException {
    public NoPersonnelFoundException(String message) {
        super(message);
    }
}
