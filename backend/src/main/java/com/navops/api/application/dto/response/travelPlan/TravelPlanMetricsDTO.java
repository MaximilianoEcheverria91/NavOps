package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO con métricas resumen de planes de travesía")
public record TravelPlanMetricsDTO(

    @Schema(description = "Cantidad de planes en estado PLANNED", example = "12")
    Long scheduledCount,

    @Schema(description = "Histórico total de planes en estado COMPLETED", example = "45")
    Long totalCompletedCount

) {}
