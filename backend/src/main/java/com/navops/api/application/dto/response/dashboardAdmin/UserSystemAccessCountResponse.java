package com.navops.api.application.dto.response.dashboardAdmin;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con el conteo de usuarios del sistema")
public record UserSystemAccessCountResponse(

        @Schema(example = "3", description = "Cantidad de usuarios con rol ADMIN")
        long adminUsers,

        @Schema(example = "5", description = "Cantidad de usuarios con rol CHIEF_NAVIGATION")
        long chiefNavigationUsers,

        @Schema(example = "4", description = "Cantidad de usuarios con rol CHIEF_OPERATIONS")
        long chiefOperationUsers,

        @Schema(example = "10", description = "Cantidad de usuarios activos")
        long activeUsers,

        @Schema(example = "1", description = "Cantidad de usuarios bloqueados")
        long blockedUsers,

        @Schema(example = "2", description = "Cantidad de usuarios inactivos (isActive = false)")
        long inactiveUsers,

        @Schema(example = "12", description = "Total de usuarios con roles ADMIN, CHIEF_NAVIGATION y CHIEF_OPERATIONS")
        long total
) {
}
