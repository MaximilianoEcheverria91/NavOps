package com.navops.api.infrastructure.exception;

public class NoRoleFoundException extends RuntimeException {
    public NoRoleFoundException(String message) {
        super(message);
    }
}
