package com.navops.api.application.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta genérica para procesos de recuperación de cuenta")
public record ForgotPasswordResponseDto(

        @Schema(example = "Se ha enviado un enlace a tu correo electrónico", description = "Mensaje de confirmación de la acción solicitada")
        String message
){}