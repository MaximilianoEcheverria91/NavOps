package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(description = "Detalle del buque asignado al plan de travesía")
public record ShipDetailDTO(

    @Schema(description = "ID del buque")
    UUID id,

    @Schema(description = "Nombre del buque")
    String name,

    @Schema(description = "Tipo de buque")
    String shipType,

    @Schema(description = "Matrícula del buque")
    String registration,

    @Schema(description = "Estado operacional del buque")
    String status,

    @Schema(description = "Cantidad de bodegas")
    int holdCount,

    @Schema(description = "Capacidad de carga en toneladas")
    double cargoCapacityTonnes,

    @Schema(description = "Número de casco")
    String hullNumber,

    @Schema(description = "URL de la imagen principal del buque")
    String mainImageUrl

) {}
