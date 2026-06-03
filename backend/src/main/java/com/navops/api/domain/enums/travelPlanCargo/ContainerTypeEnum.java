package com.navops.api.domain.enums.travelPlanCargo;

public enum ContainerTypeEnum {
    DRY_VAN("Standard enclosed container for general cargo"),
    REEFER("Refrigerated container for temperature-sensitive goods"),
    OPEN_TOP("Container with removable roof for top-loading"),
    TANK("Container designed for liquid bulk transport"),
    HIGH_CUBE("large capacity container or high volume container"),
    FLAT_RACK("It is a type of maritime and land transport unit without a roof or side walls, specifically designed for oversized or extra-heavy loads that do not fit in a standard container."),
    OTHER("Other types of generic container");

    private final String description;

    ContainerTypeEnum(String description) {
        this.description = description;
    }
}
