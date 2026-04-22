package com.navops.api.application.dto.response.user;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de cantidad de usuarios total, activos y disponibles")
public record StatsUserResponse(

        @Schema(example = "10", description = "Cantidad total de usuarios registrados")
        long totalUsers,

        @Schema(example = "8", description = "Cantidad de usuarios con estado activo")
        long activeUsers

/*
 * @Schema(example = "5", description =
 * "Tripulantes que no están asignados a ningún viaje actual")
 * long availableCrewMembers
 */
) {
}
