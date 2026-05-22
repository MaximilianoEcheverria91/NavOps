package com.navops.api.application.dto.request.ship;

import com.navops.api.domain.enums.ShipStatusEnum;
import com.navops.api.domain.enums.ShipTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;

import java.util.List;
import java.util.UUID;

@Schema(description = "Request DTO para filtros avanzados de barcos.")
public record ShipFilterRequest(

        @Schema(description = "Filtrar por tipo(s) de barco (CONTAINER_SHIP, BULK_CARRIER, TANKER, etc.)")
        List<ShipTypeEnum> shipTypes,

        @Schema(description = "Filtrar por país", implementation = UUID.class)
        UUID countryId,

        @Schema(description = "Filtrar por estado(s) (OPERATIONAL, MAINTENANCE, REPAIR, OUT_OF_SERVICE, IN_TRANSIT, INACTIVE)")
        List<ShipStatusEnum> statuses,

        @Schema(description = "Año de construcción mínimo", example = "1900")
        @Min(value = 1800, message = "El año de construcción mínimo no puede ser menor a 1800")
        Integer minBuildYear,

        @Schema(description = "Año de construcción máximo", example = "2000")
        @Min(value = 1800, message = "El año de construcción máximo no puede ser menor a 1800")
        Integer maxBuildYear,

        @Schema(description = "Eslora mínima en metros")
        @Min(value = 0, message = "La eslora mínima no puede ser negativa")
        Double minLength,

        @Schema(description = "Eslora máxima en metros")
        @Min(value = 0, message = "La eslora máxima no puede ser negativa")
        Double maxLength,

        @Schema(description = "Manga mínima en metros")
        @Min(value = 0, message = "La manga mínima no puede ser negativa")
        Double minBeam,

        @Schema(description = "Manga máxima en metros")
        @Min(value = 0, message = "La manga máxima no puede ser negativa")
        Double maxBeam,

        @Schema(description = "Calado mínimo en metros")
        @Min(value = 0, message = "El calado mínimo no puede ser negativa")
        Double minDraft,

        @Schema(description = "Calado máximo en metros")
        @Min(value = 0, message = "El calado máximo no puede ser negativa")
        Double maxDraft,

        @Schema(description = "Puntal mínimo en metros")
        @Min(value = 0, message = "El puntal mínimo no puede ser negativa")
        Double minDepth,

        @Schema(description = "Puntal máximo en metros")
        @Min(value = 0, message = "El puntal máximo no puede ser negativa")
        Double maxDepth,

        @Schema(description = "Capacidad de carga mínima en toneladas")
        @Min(value = 0, message = "La capacidad de carga mínima no puede ser negativa")
        Double minCargoCapacityTonnes,

        @Schema(description = "Capacidad de carga máxima en toneladas")
        @Min(value = 0, message = "La capacidad de carga máxima no puede ser negativa")
        Double maxCargoCapacityTonnes,

        @Schema(description = "Capacidad de tripulación mínima")
        @Min(value = 0, message = "La capacidad de tripulación mínima no puede ser negativa")
        Integer minCrewCapacity,

        @Schema(description = "Capacidad de tripulación máxima")
        @Min(value = 0, message = "La capacidad de tripulación máxima no puede ser negativa")
        Integer maxCrewCapacity,

        @Schema(description = "Cantidad mínima de bodegas")
        @Min(value = 0, message = "La cantidad mínima de bodegas no puede ser negativa")
        Integer minHoldCount,

        @Schema(description = "Cantidad máxima de bodegas")
        @Min(value = 0, message = "La cantidad máxima de bodegas no puede ser negativa")
        Integer maxHoldCount,

        @Schema(description = "Capacidad máxima en litros mínima")
        @Min(value = 0, message = "La capacidad máxima en litros mínima no puede ser negativa")
        Double minMaxCapacityLiters,

        @Schema(description = "Capacidad máxima en litros máxima")
        @Min(value = 0, message = "La capacidad máxima en litros máxima no puede ser negativa")
        Double maxMaxCapacityLiters,

        @Schema(description = "Página (0-indexed)")
        @Min(value = 0, message = "La página no puede ser negativa")
        Integer page,

        @Schema(description = "Cantidad de elementos por página")
        @Min(value = 1, message = "El tamaño debe ser al menos 1")
        Integer size,

        @Schema(description = "Campo por el cual ordenar (name, status, shipType, buildYear, length, beam, draft, depth, cargoCapacityTonnes, crewCapacity, holdCount)")
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
        return size != null ? size : 10;
    }

    @Override
    public String sortDirection() {
        return sortDirection != null ? sortDirection.toUpperCase() : "ASC";
    }

    @Override
    public String sortBy() {
        return sortBy != null ? sortBy.toLowerCase() : "name";
    }
}
