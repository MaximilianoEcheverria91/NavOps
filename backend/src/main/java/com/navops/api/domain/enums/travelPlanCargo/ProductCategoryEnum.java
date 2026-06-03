package com.navops.api.domain.enums.travelPlanCargo;

public enum ProductCategoryEnum {
    FOOD_AND_BEVERAGES("Edible provisions and drinks for crew or passengers"),
    APPLIANCES_AND_TECHNOLOGY("Electronic and household appliances"),
    WEAPONS("Armaments, munitions and defense materials"),
    VEHICLES_ACCESSORIES("Motor vehicles, parts and accessories"),
    HOME_AND_FURNITURE("Household goods and furnishings"),
    CLOTHING_FOOTWEAR_AND_ACCESSORIES("Textiles, apparel and personal accessories"),
    PHARMACEUTICAL(""),
    INDUSTRIAL(""),
    OTHER("Other types of generic categories");

    private final String description;

    ProductCategoryEnum(String description) {
        this.description = description;
    }
}
