package com.navops.api.domain.enums;

public enum PortStatusEnum {

    OPERATIONAL("The port is operating normally and can receive ships."),
    UNDER_MAINTENANCE(" There is construction or repair work underway. It can be viewed, but perhaps with restrictions."),
    CLOSED("The port is temporarily closed (due to weather, strike or emergency)."),
    FULL("The port has no available docks (maximum capacity reached)"),
    INACTIVE("The port has reached the end of its useful life within the organization and is no longer operated within the system.");

    private final String description;

    PortStatusEnum(String description) {
        this.description = description;
    }

}
