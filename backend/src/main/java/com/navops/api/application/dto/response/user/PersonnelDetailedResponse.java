package com.navops.api.application.dto.response.user;

import java.time.LocalDate;
import java.util.UUID;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta detallada con toda la información completa de una persona, su labor y su usuario.")
public record PersonnelDetailedResponse(

                @Schema(description = "Identificador único", example = "550e8400-e29b-41d4-a716-446655440000") UUID id,

                @Schema(description = "Tipo de documento (Ej. DNI, PASSPORT)", example = "DNI") String documentType,

                @Schema(description = "Número de documento de identidad", example = "35123456") String documentNumber,

                @Schema(description = "CUIL o CUIT de la persona", example = "20-35123456-1") String cuil,

                @Schema(description = "Nombre completo o de pila", example = "Carlos Alberto") String name,

                @Schema(description = "Apellidos", example = "Gómez") String surname,

                @Schema(description = "Nacionalidad", example = "Argentina") String nationality,

                @Schema(description = "Estado civil (Ej. SINGLE, MARRIED)", example = "SINGLE") String maritalStatus,

                @Schema(description = "Género (Ej. MALE, FEMALE)", example = "MALE") String gender,

                @Schema(description = "Fecha de nacimiento", example = "1990-05-24") LocalDate birthDate,

                @Schema(description = "Correo electrónico de contacto", example = "carlos.gomez@example.com") String email,

                @Schema(description = "Teléfono celular", example = "+5491112345678") String mobile,

                @Schema(description = "Teléfono fijo", example = "+541143218765") String homePhone,

                @Schema(description = "Calle de residencia", example = "Av. Corrientes") String addressStreet,

                @Schema(description = "Número de calle", example = "1234") String addressNumber,

                @Schema(description = "Piso del departamento", example = "5") String addressFloor,

                @Schema(description = "Número de departamento", example = "B") String addressDepartment,

                @Schema(description = "Ciudad de residencia", example = "CABA") String addressCity,

                @Schema(description = "Provincia de residencia", example = "Buenos Aires") String addressProvince,

                @Schema(description = "Código postal", example = "C1043AAZ") String addressPostalCode,

                @Schema(description = "País de residencia", example = "Argentina") String countryName,

                @Schema(description = "Número de legajo laboral", example = "LG00001") String fileNumber,

                @Schema(description = "Número de libreta marítima", example = "AR-12345678") String maritimeBookNumber,

                @Schema(description = "Rol de navegación (Ej. Marinero, Capitán)", example = "Capitán") String navigationRole,

                @Schema(description = "Categoría o especialidad laboral", example = "Oficial") String category,

                @Schema(description = "Fecha de ingreso a laborar", example = "2018-03-10") LocalDate hireDate,

                @Schema(description = "Años de antigüedad (calculado automáticamente)", example = "8") int yearsOfService,

                @Schema(description = "Estado actual del tripulante", example = "ACTIVE") String crewMemberStatus,

                @Schema(description = "Nombre de usuario del sistema (credencial)", example = "cgomez") String username,

                @Schema(description = "Rol de seguridad en el sistema", example = "ADMIN") String systemRole,

                @Schema(description = "URL de la imagen de perfil o avatar", example = "https://res.cloudinary.com/demo/image/upload/sample.jpg") String avatarUrl,

                @Schema(description = "Indica si el usuario tiene acceso activo al sistema", example = "true") boolean isActive) {
}
