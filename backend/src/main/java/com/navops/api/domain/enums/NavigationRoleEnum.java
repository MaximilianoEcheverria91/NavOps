package com.navops.api.domain.enums;

public enum NavigationRoleEnum {

    CAPTAIN("Supreme legal authority and responsible for the overall operation of the ship."),
    FIRST_OFFICER("Segundo al mando, supervisa la carga, descarga y personal."),
    SECOND_OFFICER("Responsible for navigation, charts and routes."),
    THIRD_OFFICER("Safety and rescue equipment manager."),
    BOATSWAIN("Chief of the sailors, in charge of deck maintenance."),
    HELMSMAN("Handles the rudder and performs maintenance tasks."),
    DECK_CADET("Trainee officer."),
    CHIEF_ENGINEER("Responsible for the engine and technical systems."),
    ENGINEERING_OFFICERS("Gestionan maquinaria y sistemas eléctricos."),
    ENGINEER("Performs maintenance tasks in the engine room."),
    PURCHASING_OFFICER("Manages passenger logistics."),
    COOK("Responsible for the food."),
    CLEANING_STAFF("Cleaning and cabin service staff."),
    ENTERTAINMENT_STAFF("They guide activities on cruises."),
    PILOT("Local expert who assists the captain in entering/leaving ports (not a permanent member of the crew)."),
    RADIO_OFFICER("Communications Officer."),
    ADMIN("responsible for installing, configuring, maintaining and securing a company's IT infrastructure" );

    private final String description;

    NavigationRoleEnum(String description){
        this.description = description;
    }
}
/*STEPATTERN, limpieza*/