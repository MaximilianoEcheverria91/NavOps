package com.navops.api.infrastructure.exception;

public class NoCitiesFoundException extends RuntimeException {
    public NoCitiesFoundException(String message) {
        super(message);
    }
}
