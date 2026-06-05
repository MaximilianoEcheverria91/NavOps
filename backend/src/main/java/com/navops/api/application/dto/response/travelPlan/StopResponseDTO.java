package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.UUID;

@Schema(description = "DTO de respuesta para una escala del plan de travesía")
public record StopResponseDTO(

    @Schema(description = "ID único de la escala")
    UUID id,

    @Schema(description = "ID del puerto")
    UUID portId,

    @Schema(description = "Nombre del puerto")
    String portName,

    @Schema(description = "Número de orden de la escala")
    Short sequence,

    @Schema(description = "Fecha y hora estimada de embarque")
    OffsetDateTime estBoardingTime,

    @Schema(description = "Fecha y hora estimada de desembarque")
    OffsetDateTime estDisembarkTime

) {}
