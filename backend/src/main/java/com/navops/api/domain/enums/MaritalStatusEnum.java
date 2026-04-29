package com.navops.api.domain.enums;

public enum MaritalStatusEnum {

    SINGLE("The user is single."),
    MARRIED("The user is married."),
    DIVORCED("The user is divorced."),
    WIDOWED("The user is a widower."),
    COHABITANT("The user is cohabiting.");

    private final String description;

    MaritalStatusEnum( String description){
        this.description = description;
    }

}
