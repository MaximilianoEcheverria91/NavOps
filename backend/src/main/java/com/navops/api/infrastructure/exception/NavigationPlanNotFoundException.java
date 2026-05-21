package com.navops.api.infrastructure.exception;

public class NavigationPlanNotFoundException extends RuntimeException {
    public NavigationPlanNotFoundException(String message) {
        super(message);
    }
}
