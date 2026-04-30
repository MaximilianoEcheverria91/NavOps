package com.navops.api.application.dto.response.user;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Respuesta detallada estructurada para la edición de un usuario.")
public record PersonnelEditResponse(

        @Schema(description = "Identificador único de la persona")
        UUID id,

        @Schema(description = "URL de la fotografía del usuario")
        String avatarUrl,

        GeneralInfo generalInfo,
        ResidenceInfo residenceInfo,
        ContactInfo contactInfo,
        LaborData laborData,
        SystemAccessData systemAccessData
) {
    public record GeneralInfo(
            String name,
            String surname,
            String documentType,
            String documentNumber,
            String cuil,
            LocalDate birthDate,
            String nationality,
            String maritalStatus,
            UUID nationalityCountryId,
            String gender,
            String status
    ) {}

    public record ResidenceInfo(
            UUID countryId,
            UUID provinceId,
            UUID cityId,
            String postalCode,
            String street,
            String number,
            String department,
            String floor
    ) {}

    public record ContactInfo(
            String particularPhone,
            String cellPhone,
            String email
    ) {}

    public record LaborData(
            String fileNumber,
            String navigationRole,
            String category,
            LocalDate hireDate,
            String maritimeBookNumber,
            String status
    ) {}

    public record SystemAccessData(
            boolean belongsToSystem,
            String username,
            UUID roleId,
            boolean isActive,
            boolean is_blocked
    ) {}
}
