package com.navops.api.application.dto.response.navigation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NavigationRouteResponse(
        UUID id,
        UUID originPortId,
        String originPortName,
        UUID destinationPortId,
        String destinationPortName,
        OffsetDateTime departureTime,
        OffsetDateTime estimatedArrivalTime,
        Double distanceNauticalMiles,
        String notes
) {}
