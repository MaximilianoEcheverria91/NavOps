package com.navops.api.application.dto.response.navigation;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record NavigationPlanDetailResponse(
        UUID id,
        String name,
        String status,
        UUID shipId,
        String shipName,
        String shipRegistration,
        String shipStatus,
        NavigationRouteResponse route,
        List<PlanCrewResponse> crew,
        int totalCrewCount,
        List<NavigationCargoResponse> cargo,
        String notes,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
