package com.navops.api.application.dto.response.navigation;

import java.util.UUID;

public record PlanCrewResponse(
        UUID crewMemberId,
        String fullName,
        String assignedRole
) {}
