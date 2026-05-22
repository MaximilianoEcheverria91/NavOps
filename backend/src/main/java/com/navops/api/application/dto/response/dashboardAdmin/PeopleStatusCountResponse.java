package com.navops.api.application.dto.response.dashboardAdmin;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con el conteo de usuarios por estado")
public record PeopleStatusCountResponse(

        @Schema(example = "15", description = "Cantidad de usuarios activos")
        long active,

        @Schema(example = "3", description = "Cantidad de usuarios inactivos")
        long inactive,

        @Schema(example = "2", description = "Cantidad de usuarios de vacaciones")
        long vacation,

        @Schema(example = "1", description = "Cantidad de usuarios con licencia médica")
        long medicalLeave,

        @Schema(example = "0", description = "Cantidad de usuarios suspendidos")
        long suspended,

        @Schema(example = "21", description = "Total de personas (suma de todos los estados)")
        long total,

        @Schema(example = "12", description = "Total de personas con acceso al sistema")
        long totalUsersWithSystemAccess
) {
}
