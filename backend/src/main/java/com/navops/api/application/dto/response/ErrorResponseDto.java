package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;

@Schema(description = "Estructura universal de errores de la API")
public record ErrorResponseDto(

        @Schema(example = "Bad Request")
        String error,

        @Schema(example = "El código de verificación ha expirado")
        String message,

        @Schema(example = "400")
        int status,

        @Schema(example = "2026-04-11T10:15:30Z")
        OffsetDateTime timestamp
) {}
