package com.navops.api.application.dto.response.dashboardAdmin;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con el conteo de puertos por estado")
public record PortStatusCountResponse(

        @Schema(example = "8", description = "Cantidad de puertos operativos")
        long operational,

        @Schema(example = "2", description = "Cantidad de puertos en mantenimiento")
        long underMaintenance,

        @Schema(example = "1", description = "Cantidad de puertos cerrados")
        long closed,

        @Schema(example = "3", description = "Cantidad de puertos con capacidad completa")
        long full,

        @Schema(example = "0", description = "Cantidad de puertos inactivos")
        long inactive,

        @Schema(example = "14", description = "Total de puertos (suma de todos los estados)")
        long total
) {
}
