package com.navops.api.application.dto.request.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Schema(description = "DTO para la creación de un plan de travesía con todas sus entidades anidadas")
public record TravelPlanRequestDTO(

    @NotNull(message = "El ID del buque es obligatorio")
    @Schema(description = "ID del buque asignado a la travesía")
    UUID shipId,

    @NotNull(message = "El ID del puerto de origen es obligatorio")
    @Schema(description = "ID del puerto de origen")
    UUID originPortId,

    @NotNull(message = "El ID del puerto de destino es obligatorio")
    @Schema(description = "ID del puerto de destino")
    UUID destinationPortId,

    @NotNull(message = "La fecha y hora de partida es obligatoria")
    @Schema(description = "Fecha y hora de partida estimada")
    OffsetDateTime departureTime,

    @NotNull(message = "La fecha y hora estimada de llegada es obligatoria")
    @Schema(description = "Fecha y hora estimada de llegada")
    OffsetDateTime eta,

    @Positive(message = "La distancia debe ser un valor positivo")
    @Schema(description = "Distancia total en millas náuticas", example = "1250.50")
    BigDecimal distanceMiles,

    @Positive(message = "Las horas estimadas deben ser un valor positivo")
    @Schema(description = "Horas estimadas de navegación", example = "48.5")
    BigDecimal estimatedHours,

    @Positive(message = "El total de toneladas de carga debe ser un valor positivo")
    @Schema(description = "Total de toneladas de carga (validación manual)", example = "5000.00")
    BigDecimal totalCargoTonnes,

    @Valid
    @Schema(description = "Lista de escalas o paradas intermedias")
    List<StopRequestDTO> stops,

    @Schema(description = "Lista de IDs de tripulantes asignados a la travesía")
    List<UUID> crewIds,

    @Valid
    @Schema(description = "Lista de ítems de carga del manifiesto")
    List<CargoItemRequestDTO> cargoItems

) {}
