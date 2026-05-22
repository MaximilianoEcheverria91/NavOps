package com.navops.api.application.dto.response.dashboardAdmin;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con el conteo de barcos por estado")
public record ShipStatusCountResponse(

        @Schema(example = "10", description = "Cantidad de barcos operativos")
        long operational,

        @Schema(example = "2", description = "Cantidad de barcos en mantenimiento")
        long maintenance,

        @Schema(example = "1", description = "Cantidad de barcos en reparación")
        long repair,

        @Schema(example = "0", description = "Cantidad de barcos en tránsito")
        long inTransit,

        @Schema(example = "1", description = "Cantidad de barcos fuera de servicio")
        long outOfService,

        @Schema(example = "0", description = "Cantidad de barcos inactivos")
        long inactive,

        @Schema(example = "14", description = "Total de barcos (suma de todos los estados)")
        long total
) {
}
