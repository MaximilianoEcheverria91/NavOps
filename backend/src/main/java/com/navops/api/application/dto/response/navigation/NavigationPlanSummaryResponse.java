package com.navops.api.application.dto.response.navigation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record NavigationPlanSummaryResponse(
        UUID id,
        String name,
        String status,
        String shipName,
        String originPortName,
        String destinationPortName,
        OffsetDateTime departureTime,
        OffsetDateTime createdAt
) {}
