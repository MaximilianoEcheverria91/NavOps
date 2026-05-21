package com.navops.api.domain.enums;

public enum TypePortEnum {

    COMMERCIAL("Type of commercial port"),
    INDUSTRIAL("Type of Industrial port."),
    LOGISTIC("Type of Logistics port."),
    TOURISTIC("type of passenger port"),
    FISHING("type of fishing port");

    private final String description;

    TypePortEnum(String description) {
        this.description = description;
    }
}
