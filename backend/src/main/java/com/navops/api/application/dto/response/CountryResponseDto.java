package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Devuelve todos los países existente")
public record CountryResponseDto(

        @Schema(example = "550e8400-e29b-41d4-a716-446655440000", description = "Identificador único del país en formato UUID")
        UUID id,

        @Schema(example = "Argentia", description = "Nombre del país")
        String name
){}
