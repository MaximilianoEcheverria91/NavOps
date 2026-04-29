package com.navops.api.domain.enums;

public enum CrewMemberStatusEnum {

    AVAILABLE ("Crew member available to board."),
    ON_BOARD("The crew member is unavailable, is en route, or on board."),
    RESTING("The crew member is unavailable, on rest or leave."),
    MATERNITY_LEAVE("Crew member is on maternity or paternity leave"),
    UNAVAILABLE("Crew member temporarily unavailable.");

    private final String description;

    CrewMemberStatusEnum(String description){
        this.description = description;
    }
}
