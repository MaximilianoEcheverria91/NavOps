package com.navops.api.application.dto.response.travelPlan;

import com.navops.api.application.dto.response.travelPlanCargo.TravelPlanCargoResponseDTO;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "DTO de respuesta con los datos completos del plan de travesía creado")
public record TravelPlanResponseDTO(

    @Schema(description = "ID único del plan de travesía")
    UUID id,

    @Schema(description = "ID del buque")
    UUID shipId,

    @Schema(description = "Nombre del buque")
    String shipName,

    @Schema(description = "ID del puerto de origen")
    UUID originPortId,

    @Schema(description = "Nombre del puerto de origen")
    String originPortName,

    @Schema(description = "ID del puerto de destino")
    UUID destinationPortId,

    @Schema(description = "Nombre del puerto de destino")
    String destinationPortName,

    @Schema(description = "Fecha y hora de partida")
    OffsetDateTime departureTime,

    @Schema(description = "Fecha y hora estimada de llegada")
    OffsetDateTime eta,

    @Schema(description = "Distancia total en millas náuticas")
    BigDecimal distanceMiles,

    @Schema(description = "Horas estimadas de navegación")
    BigDecimal estimatedHours,

    @Schema(description = "Estado del plan de travesía")
    String status,

    @Schema(description = "Porcentaje de progreso")
    BigDecimal progressPercentage,

    @Schema(description = "Total de toneladas de carga")
    BigDecimal totalCargoTonnes,

    @Schema(description = "Lista de tripulantes asignados (solo IDs)")
    List<UUID> crewMemberIds,

    @Schema(description = "Lista de escalas registradas")
    List<StopResponseDTO> stops,

    @Schema(description = "Lista de cargas del manifiesto")
    List<TravelPlanCargoResponseDTO> cargoItems,

    @Schema(description = "Fecha de creación")
    OffsetDateTime createdAt

) {}
