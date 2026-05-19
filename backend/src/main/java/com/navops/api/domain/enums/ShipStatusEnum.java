package com.navops.api.domain.enums;

public enum ShipStatusEnum {
    OPERATIONAL("vessel in active service"),
    MAINTENANCE("structure subjected to rigorous inspections"),
    REPAIR("meticulous process where wear and tear are corrected, breakdowns are repaired, and navigation systems are updated"),
    OUT_OF_SERVICE("Vessel temporarily suspended from operations."),
    IN_TRANSIT(" Vessel moving towards its destination"),
    INACTIVE("Vessel permanently removed from the system.");

    private final String description;

    ShipStatusEnum(String description){
        this.description = description;
    }
}
