package com.navops.api.domain.enums.travelPlanCargo;

public enum CargoStatusEnum {
    LOADED("Cargo has been loaded onto the vessel"),
    DISPATCHED("Cargo has been dispatched from origin"),
    DELIVERED("Cargo has been delivered to destination"),
    RETURNED("Cargo has been returned to sender"),
    CANCELED("Cargo shipment has been canceled");

    private final String description;

    CargoStatusEnum(String description) {
        this.description = description;
    }
}
