package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import java.util.UUID;

@Schema(description = "Detalle de una escala intermedia")
public record StopDetailDTO(

    @Schema(description = "ID de la escala")
    UUID id,

    @Schema(description = "Nombre del puerto de escala")
    String portName,

    @Schema(description = "Orden de la escala en la ruta")
    Short sequence,

    @Schema(description = "Fecha y hora estimada de embarque")
    OffsetDateTime estBoardingTime,

    @Schema(description = "Fecha y hora estimada de desembarque")
    OffsetDateTime estDisembarkTime

) {}
