package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Respuesta tras un inicio de sesión exitoso")
public record LoginResponseDto(

        @Schema(example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description = "Token JWT para autenticar peticiones posteriores")
        String token,

        @Schema(example = "550e8400-e29b-41d4-a716-446655440000", description = "Identificador único del usuario en formato UUID")
        UUID userId,

        @Schema(example = "ADMIN", description = "Rol asignado al usuario (ej: ADMIN, CHIEF_NAVIGATION, CHIEF_OPERATIONS)")
        String role,

        @Schema(example = "/dashboard/admin", description = "Ruta sugerida para el frontend basada en el rol del usuario")
        String redirectUrl
) {}
