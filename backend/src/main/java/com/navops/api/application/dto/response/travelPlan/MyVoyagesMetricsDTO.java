package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO con metricas personales de viajes para la card Mis Viajes")
public record MyVoyagesMetricsDTO(

    @Schema(description = "Viajes completados por el usuario")
    Long completedCount,

    @Schema(description = "Viajes planificados por el usuario")
    Long plannedCount,

    @Schema(description = "Viajes cancelados por el usuario")
    Long cancelledCount,

    @Schema(description = "Total de viajes del usuario")
    Long totalCount

) {}
