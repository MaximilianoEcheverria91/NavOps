package com.navops.api.application.dto.request.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.List;

@Schema(description = "DTO con los criterios de filtrado dinámico para planes de travesía")
public record TravelPlanFilterRequest(

    @Schema(description = "Lista de estados a incluir (PLANNED, IN_PROGRESS, COMPLETED, etc.)")
    List<String> statuses,

    @Schema(description = "Filtro: fecha de salida desde (inclusive)")
    OffsetDateTime departureFrom,

    @Schema(description = "Filtro: fecha de salida hasta (inclusive)")
    OffsetDateTime departureTo,

    @Schema(description = "Filtro: fecha estimada de llegada desde (inclusive)")
    OffsetDateTime arrivalFrom,

    @Schema(description = "Filtro: fecha estimada de llegada hasta (inclusive)")
    OffsetDateTime arrivalTo,

    @Schema(description = "Filtrar por categorías de producto de la carga")
    List<String> productCategories,

    @Schema(description = "Filtrar por tipos de carga")
    List<String> cargoTypes,

    @Schema(description = "Filtrar por tipos de contenedor")
    List<String> containerTypes,

    @Schema(description = "Filtrar por material peligroso (true/false)")
    Boolean hazardousMaterial

) {}
