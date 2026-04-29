package com.navops.api.domain.enums;

public enum PeopleStatusEnum {
    ACTIVE("User belongs to the company."),
    INACTIVE("User no longer belongs to the company."),
    VACATION("The user is on vacation."),
    MEDICAL_LEAVE("The user is on medical leave."),
    SUSPENDED("The user is temporarily suspended.");

    private final String description;

    PeopleStatusEnum(String description) {
        this.description = description;
    }
}
