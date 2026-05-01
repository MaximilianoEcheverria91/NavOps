package com.navops.api.domain.enums;

public enum DockTypeEnum {

    SOLID_STRUCTURE("Solid concrete or stone docks, typical for heavy loads."),
    FLOATING("Floating type, common in marinas or places with strong tides."),
    PIER_JETTY("(Pyroof/Break): Structures that extend out to sea."),
    DOLPHIN("Duke of Alba, isolated structures for mooring.");

    private final String description;

    DockTypeEnum(String description){
        this.description = description;
    }
}
