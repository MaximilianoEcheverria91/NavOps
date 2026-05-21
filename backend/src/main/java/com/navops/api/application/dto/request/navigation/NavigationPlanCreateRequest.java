package com.navops.api.application.dto.request.navigation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NavigationPlanCreateRequest(
        @NotBlank(message = "El nombre del plan es obligatorio")
        String name,

        @NotNull(message = "El ID del barco es obligatorio")
        UUID shipId,

        UUID originPortId,
        UUID destinationPortId,
        OffsetDateTime departureTime,
        OffsetDateTime estimatedArrivalTime,
        Double distanceNauticalMiles,
        String notes
) {}
