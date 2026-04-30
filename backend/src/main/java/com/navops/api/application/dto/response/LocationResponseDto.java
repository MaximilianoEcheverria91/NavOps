package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "DTO que representa Provincia o Ciudad")
public record LocationResponseDto(

        @Schema(description = "ID único de la ubicación", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Nombre de la provincia o localidad", example = "Buenos Aires")
        String name
) {}
