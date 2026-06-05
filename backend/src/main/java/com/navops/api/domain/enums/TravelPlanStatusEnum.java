package com.navops.api.domain.enums;

public enum TravelPlanStatusEnum {

    PLANNED("Travel plan created and awaiting departure."),
    IN_PROGRESS("Vessel is en route following the planned route."),
    COMPLETED("Travel plan finished successfully."),
    CANCELLED("Travel plan has been cancelled."),
    DELAYED("Travel plan delayed due to unforeseen circumstances.");

    private final String description;

    TravelPlanStatusEnum(String description) {
        this.description = description;
    }
}
