package com.navops.api.application.dto.response.auth;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con datos del perfil del usuario autenticado")
public record ProfileResponseDto(

        @Schema(example = "Carlos Alberto", description = "Nombre completo de la persona")
        String fullName,

        @Schema(example = "Gómez", description = "Apellido de la persona")
        String surname,

        @Schema(example = "https://res.cloudinary.com/demo/image/upload/sample.jpg", description = "URL del avatar o foto de perfil")
        String avatarUrl,

        @Schema(example = "ADMIN", description = "Rol del usuario en el sistema")
        String role
) {}
