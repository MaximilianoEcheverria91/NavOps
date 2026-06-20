package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "DTO compuesto con el detalle completo del plan de travesía para la interfaz de usuario")
public record TravelPlanFullDetailDTO(

    @Schema(description = "ID del plan de travesía")
    UUID id,

    @Schema(description = "Estado del plan")
    String status,

    @Schema(description = "Fecha de creación")
    OffsetDateTime createdAt,

    @Schema(description = "Detalle del buque")
    ShipDetailDTO ship,

    @Schema(description = "Detalle de la ruta")
    RouteDetailDTO route,

    @Schema(description = "Detalle de la carga")
    CargoDetailDTO cargo,

    @Schema(description = "Detalle de la tripulación")
    List<CrewMemberDetailDTO> crewMembers

) {}
