package com.navops.api.application.dto.request.travelPlanCargo;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Schema(description = "Request DTO para filtros avanzados de cargas en un plan de viaje.")
public record TravelPlanCargoFilterRequest(

        @NotNull(message = "El ID del plan de viaje es obligatorio")
        @Schema(description = "ID del plan de viaje")
        UUID planId,

        @Schema(description = "Filtrar por categoría de producto (coincidencia exacta)", example = "FOOD_AND_BEVERAGES")
        String productCategory,

        @Schema(description = "Filtrar por tipo de carga (coincidencia exacta)", example = "BULK")
        String cargoType,

        @Schema(description = "Filtrar por tipo de contenedor (coincidencia exacta)", example = "DRY_VAN")
        String containerType,

        @Schema(description = "Página (0-indexed)", implementation = Integer.class)
        @Min(value = 0, message = "La página no puede ser negativa")
        Integer page,

        @Schema(description = "Cantidad de elementos por página", implementation = Integer.class)
        @Min(value = 1, message = "El tamaño debe ser al menos 1")
        Integer size,

        @Schema(description = "Campo por el cual ordenar (productName, productCategory, cargoType, status, weightTonnes, volumeM3)")
        String sortBy,

        @Schema(description = "Dirección de ordenamiento (ASC o DESC)")
        String sortDirection
) {
    @Override
    public Integer page() {
        return page != null ? page : 0;
    }

    @Override
    public Integer size() {
        return size != null ? size : 20;
    }

    @Override
    public String sortDirection() {
        return sortDirection != null ? sortDirection.toUpperCase() : "ASC";
    }

    @Override
    public String sortBy() {
        return sortBy != null ? sortBy.toLowerCase() : "productName";
    }
}
