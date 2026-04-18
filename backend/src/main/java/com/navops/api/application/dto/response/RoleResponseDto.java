package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Devuelve todos los roles existente")
public record RoleResponseDto(

        @Schema(example = "550e8400-e29b-41d4-a716-446655440000", description = "Identificador único del Rol en formato UUID")
        UUID id,

        @Schema(example = "Administrador", description = "Nombre de los roles")
        String name
) {}
