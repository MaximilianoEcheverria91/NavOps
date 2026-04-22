package com.navops.api.application.dto.response.user;

import java.util.UUID;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta que representa un resumen de los datos de personal (lista general).")
public record PersonnelSummaryResponse(

        @Schema(description = "ID único de la persona ", example = "550e8400-e29b-41d4-a716-446655440000") UUID id,

        @Schema(description = "Nombres de la persona", example = "Carlos")
        String name,

        @Schema(description = "Apellidos de la persona", example = "Gómez")
        String surname,

        @Schema(description = "Cargo o categoría marítima de la persona", example = "Capitán")
        String position,

        @Schema(description = "Legajo único de la tripulación en el sistema", example = "LG00001")
        String fileNumber,

        @Schema(description = "Años de antigüedad calculados desde la fecha de ingreso", example = "5")
        int yearsOfService,

        @Schema(description = "Rol del usuario en el sistema", example = "ADMIN")
        String systemRole,

        @Schema(description = "Número de libreta marítima", example = "AR-12345678")
        String maritimeBookNumber,

        @Schema(description = "URL del avatar o foto de perfil", example = "https://res.cloudinary.com/demo/image/upload/sample.jpg")
        String avatarUrl,

        @Schema(description = "Estado actual del tripulante", example = "ACTIVE")
        String crewMemberStatus) {
}
