package com.navops.api.infrastructure.exception;

public class NoShipsFoundException extends RuntimeException {
    public NoShipsFoundException(String message) {
        super(message);
    }
}