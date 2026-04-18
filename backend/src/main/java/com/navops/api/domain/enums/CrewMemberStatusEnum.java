package com.navops.api.domain.enums;

public enum CrewMemberStatusEnum {

    ACTIVE("Personal activo"),
    INACTIVE("Personal inactivo"),
    LICENSE("Personal con licencia por enfermedad, vacaciones, estudios, etc."),
    SUSPENDED("personal suspendido");

    private final String description;

    CrewMemberStatusEnum(String description){
        this.description = description;
    }
}
