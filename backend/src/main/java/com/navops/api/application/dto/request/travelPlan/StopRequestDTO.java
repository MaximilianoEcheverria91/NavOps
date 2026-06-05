package com.navops.api.application.dto.request.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.OffsetDateTime;
import java.util.UUID;

@Schema(description = "DTO para una escala o parada intermedia dentro del plan de travesía")
public record StopRequestDTO(

    @NotNull(message = "El ID del puerto de la escala es obligatorio")
    @Schema(description = "ID del puerto de la escala")
    UUID portId,

    @NotNull(message = "La secuencia de la escala es obligatoria")
    @Positive(message = "La secuencia debe ser un número positivo")
    @Schema(description = "Número de orden de la escala", example = "1")
    Short sequence,

    @Schema(description = "Fecha y hora estimada de embarque en la escala")
    OffsetDateTime estBoardingTime,

    @Schema(description = "Fecha y hora estimada de desembarque en la escala")
    OffsetDateTime estDisembarkTime

) {}
