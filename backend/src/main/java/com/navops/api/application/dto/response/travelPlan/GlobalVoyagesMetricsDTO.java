package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO con metricas globales de viajes para la card Lista de Viajes")
public record GlobalVoyagesMetricsDTO(

    @Schema(description = "Viajes en progreso")
    Long inProgressCount,

    @Schema(description = "Viajes planificados")
    Long plannedCount,

    @Schema(description = "Viajes demorados (delay_hours > 0 en IN_PROGRESS o PLANNED)")
    Long delayedCount,

    @Schema(description = "Total de viajes registrados")
    Long totalCount

) {}
