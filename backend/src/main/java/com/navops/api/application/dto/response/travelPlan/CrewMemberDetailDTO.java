package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Detalle de un tripulante asignado al plan de travesía")
public record CrewMemberDetailDTO(

    @Schema(description = "ID del tripulante")
    UUID id,

    @Schema(description = "Nombre completo del tripulante")
    String fullName,

    @Schema(description = "Rol o rango asignado en esta travesía")
    String role,

    @Schema(description = "Número de legajo")
    String fileNumber,

    @Schema(description = "URL del avatar del tripulante")
    String avatarUrl

) {}
