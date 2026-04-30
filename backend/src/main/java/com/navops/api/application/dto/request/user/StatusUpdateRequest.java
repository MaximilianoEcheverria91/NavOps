package com.navops.api.application.dto.request.user;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "DTO para la actualización de estado del usuario/personal")
public record StatusUpdateRequest(
        @NotBlank(message = "El estado no puede estar vacío")
        @Schema(description = "Nuevo estado del personal", example = "INACTIVE")
        String status
) {
}
