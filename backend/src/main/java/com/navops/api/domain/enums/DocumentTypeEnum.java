package com.navops.api.domain.enums;

public enum DocumentTypeEnum {

    DNI("National Identity Document."),
    PASSPORT("Passport"),
    CARD("Identity card"),
    ENROLLMENT_BOOKLET("Enrollment booklet");

    private final String description;

    DocumentTypeEnum(String description) {
        this.description = description;
    }
}
