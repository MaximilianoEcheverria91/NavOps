package com.navops.api.infrastructure.exception;

public class ShipAlreadyExistsException extends RuntimeException {
    public ShipAlreadyExistsException(String message) {
        super(message);
    }
}
