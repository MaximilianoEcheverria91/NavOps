package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Schema(description = "DTO resumen para la grilla de tarjetas de planes de travesía activos")
public record TravelPlanSummaryResponseDTO(

    @Schema(description = "ID único del plan de travesía")
    UUID id,

    @Schema(description = "Nombre del buque", example = "ARA Almirante Brown")
    String shipName,

    @Schema(description = "URL de la imagen principal del buque")
    String shipMainImageUrl,

    @Schema(description = "Nombre del puerto de origen", example = "Puerto Buenos Aires")
    String originPortName,

    @Schema(description = "Nombre del puerto de destino", example = "Puerto Mar del Plata")
    String destinationPortName,

    @Schema(description = "Distancia total en millas náuticas", example = "250.50")
    BigDecimal distanceMiles,

    @Schema(description = "Fecha y hora de partida")
    OffsetDateTime departureTime,

    @Schema(description = "Fecha y hora estimada de llegada")
    OffsetDateTime eta,

    @Schema(description = "Estado del plan de travesía", example = "PLANNED")
    String status,

    @Schema(description = "Cantidad de escalas del viaje", example = "3")
    Integer stopCount

) {}
