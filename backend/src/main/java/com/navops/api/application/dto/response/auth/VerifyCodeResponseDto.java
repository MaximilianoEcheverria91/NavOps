package com.navops.api.application.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de validación de código de recuperación")
public record VerifyCodeResponseDto(

        @Schema(example = "Código verificado correctamente", description = "Mensaje informativo del estado de la operación")
        String message,

        @Schema(example = "eyJhbGciOiJIUzUxMiJ9.eyJyZXNldCI6dHJ1ZSwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU3ODYzNzIsImV4cCI6MTc3NTc4NzI3Mn0.mPHfaM7QHKvgXFwvhHbeuBBMUKBALXkG_8WJZ2gaZZz_PQVNJ8s6vSshZKK5PVmZlgcGgu1QHEsZPHf-9WzG0w",
                description = "Token temporal con vida útil corta para autorizar el cambio de contraseña. Debe enviarse en el endpoint de reset-password."
        )
        String resetToken
) {
}
