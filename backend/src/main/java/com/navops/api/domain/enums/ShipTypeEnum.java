package com.navops.api.domain.enums;

public enum ShipTypeEnum {
    //Comerciales
    CONTAINER_SHIP("Cargo vessel specialized in transporting containers."),
    BULK_CARRIER("Ship designed to transport bulk cargo such as grain or minerals."),
    TANKER("Vessel used to transport liquid cargo like oil or chemicals."),
    RO_RO("Roll-on/roll-off ship for transporting wheeled cargo."),
    FISHING_VESSEL("Boat used for commercial fishing operations."),

    // Pasajeros
    CRUISE_SHIP("Large passenger ship designed for leisure voyages."),
    FERRY("Passenger vessel used for short-distance transport routes."),
    PASSENGER_SHIP("Ship designed primarily for carrying passengers."),

    // Industria
    SUPPLY_SHIP("Vessel used to transport supplies to offshore platforms."),
    TUGBOAT("Powerful vessel used to tow or maneuver ships."),

    // Militar
    AIRCRAFT_CARRIER("Warship designed to deploy and recover aircraft."),
    DESTROYER("Fast and maneuverable warship for combat operations."),
    FRIGATE("Medium-sized warship used for escort and patrol missions."),
    CORVETTE("Small warship designed for coastal defense operations."),
    SUBMARINE("Underwater naval vessel for stealth and combat missions."),
    PATROL_BOAT("Small military vessel used for patrol and surveillance."),
    OCEAN_PATROL_OPV("Medium-sized military vessels. Designed for ocean surveillance missions."),
    LANDING_SHIP("Military vessel designed for amphibious assault operations."),
    NOTICE_SHIP("Naval support vessel used for assistance and logistics operations."),

    // Navegación menor / recreativa
    YACHT("Luxury recreational boat used for private leisure."),
    SAILBOAT("Boat propelled primarily by sails."),
    SPEEDBOAT("High-speed boat used for recreation or transport."),

    // Investigación y servicios
    RESEARCH_VESSEL("Ship equipped for scientific and marine research."),
    TRAINING_SHIP("Vessel used for maritime education and crew training."),
    HOSPITAL_SHIP("Ship equipped with medical facilities and hospitals."),
    PILOT_BOAT("Boat used to transport maritime pilots to ships."),

    // Otros
    BARGE("Flat-bottomed vessel used for transporting heavy cargo."),
    ICEBREAKER ("Buque diseñado para navegar a través de aguas cubiertas de hielo"),
    OTHER("Other type of vessel not classified above.");

    private final String description;

    ShipTypeEnum(String description){
        this.description = description;
    }








}
