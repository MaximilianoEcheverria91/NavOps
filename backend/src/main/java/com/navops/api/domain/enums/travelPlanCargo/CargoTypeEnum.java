package com.navops.api.domain.enums.travelPlanCargo;

public enum CargoTypeEnum {
    CONTAINER("Standardized steel box for intermodal freight transport"),
    PALLET("Flat transport structure for stacking goods"),
    BINER("Specialized bin for bulk or grouped materials"),
    DRUM("Cylindrical container for liquids or powders"),
    BULK("Loose material transported without packaging"),
    OTHER("Other types of generic the cargo type");

    private final String description;

    CargoTypeEnum(String description) {
        this.description = description;
    }
}
