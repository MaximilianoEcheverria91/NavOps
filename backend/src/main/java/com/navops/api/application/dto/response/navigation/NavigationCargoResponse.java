package com.navops.api.application.dto.response.navigation;

import java.math.BigDecimal;
import java.util.UUID;

public record NavigationCargoResponse(
        UUID id,
        String cargoType,
        BigDecimal weightTonnes,
        String description
) {}
