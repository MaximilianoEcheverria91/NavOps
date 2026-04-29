package com.navops.api.domain.enums;

public enum GenderEnum {

    MALE("Male gender."),
    FEMALE("Female gender"),
    OTHER("The user prefers not to disclose their gender.");

    private final String description;

    GenderEnum(String description) {
        this.description = description;
    }
}
