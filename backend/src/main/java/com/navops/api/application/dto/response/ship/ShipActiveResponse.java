package com.navops.api.application.dto.response.ship;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "DTO para listado de barcos activos")
public record ShipActiveResponse(
    @Schema(description = "ID del barco", example = "2142aa32-b642-43df-ae67-74969d01065a") UUID id,
    @Schema(description = "Nombre del barco", example = "Libertador") String name,
    @Schema(description = "Tipo de barco", example = "CONTAINER_SHIP") String shipType,
    @Schema(description = "Matrícula", example = "2-SE-2-158-97") String registration,
    @Schema(description = "Estado operativo", example = "OPERATIONAL") String status,
    @Schema(description = "Capacidad de tripulantes", example = "30") Short crewCapacity,
    @Schema(description = "URL de la imagen principal") String mainImageUrl,
    @Schema(description = "Indica si el barco está activo", example = "true") boolean isActive
) {}
