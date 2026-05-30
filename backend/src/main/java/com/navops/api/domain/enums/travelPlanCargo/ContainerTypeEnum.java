package com.navops.api.domain.enums.travelPlanCargo;

public enum ContainerTypeEnum {
    DRY_VAN("Standard enclosed container for general cargo"),
    REEFER("Refrigerated container for temperature-sensitive goods"),
    OPEN_TOP("Container with removable roof for top-loading"),
    TANK("Container designed for liquid bulk transport"),
    OTHER("Other types of generic container");

    private final String description;

    ContainerTypeEnum(String description) {
        this.description = description;
    }
}
