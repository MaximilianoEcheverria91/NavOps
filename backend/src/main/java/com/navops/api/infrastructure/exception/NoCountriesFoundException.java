package com.navops.api.infrastructure.exception;

public class NoCountriesFoundException extends RuntimeException {
    public NoCountriesFoundException(String message) {
        super(message);
    }
}
