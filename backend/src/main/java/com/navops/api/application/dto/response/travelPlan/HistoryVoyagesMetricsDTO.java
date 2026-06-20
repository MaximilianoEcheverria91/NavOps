package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO con metricas historicas de viajes para la card Historial de Viaje")
public record HistoryVoyagesMetricsDTO(

    @Schema(description = "Viajes completados historicamente")
    Long completedCount,

    @Schema(description = "Viajes cancelados historicamente")
    Long cancelledCount,

    @Schema(description = "Total historico de viajes")
    Long totalCount

) {}
