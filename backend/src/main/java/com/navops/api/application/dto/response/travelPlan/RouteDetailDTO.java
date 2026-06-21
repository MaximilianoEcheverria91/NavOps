package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import java.util.List;

@Schema(description = "Detalle de la ruta del plan de travesía")
public record RouteDetailDTO(

    @Schema(description = "Nombre del puerto de origen")
    String originPortName,

    @Schema(description = "Nombre del puerto de destino")
    String destinationPortName,

    @Schema(description = "Fecha y hora de partida")
    OffsetDateTime departureTime,

    @Schema(description = "Fecha y hora estimada de llegada")
    OffsetDateTime eta,

    @Schema(description = "Distancia total en millas náuticas")
    double distanceMiles,

    @Schema(description = "Horas estimadas de navegación")
    int estimatedHours,

    @Schema(description = "Cantidad de escalas intermedias")
    int stopsCount,

    @Schema(description = "Latitud del puerto de origen")
    double originLatitude,

    @Schema(description = "Longitud del puerto de origen")
    double originLongitude,

    @Schema(description = "Latitud del puerto de destino")
    double destinationLatitude,

    @Schema(description = "Longitud del puerto de destino")
    double destinationLongitude,

    @Schema(description = "Lista de escalas")
    List<StopDetailDTO> stops

) {}
