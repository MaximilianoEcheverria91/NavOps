package com.navops.api.application.dto.request.user;

import com.navops.api.domain.enums.*;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Schema(description = "Request DTO para filtros avanzados de personal.")
public record PersonnelFilterRequest(

        @Schema(description = "Filtrar por país de residencia", implementation = UUID.class)
        UUID countryId,

        @Schema(description = "Filtrar por provincia de residencia", implementation = UUID.class)
        UUID provinceId,

        @Schema(description = "Filtrar por ciudad de residencia", implementation = UUID.class)
        UUID cityId,

        @Schema(description = "Edad mínima del personal", implementation = Integer.class)
        @Min(value = 0, message = "La edad mínima no puede ser negativa")
        Integer minAge,

        @Schema(description = "Edad máxima del personal", implementation = Integer.class)
        @Min(value = 0, message = "La edad máxima no puede ser negativa")
        Integer maxAge,

        @Schema(description = "Estados personales del personal (ACTIVE, INACTIVE, VACATION, SUSPENDED, MEDICAL_LEAVE)")
        List<PeopleStatusEnum> personalStatuses,

        @Schema(description = "Estados laborales del tripulante (AVAILABLE, ON_BOARD, RESTING, MATERNITY_LEAVE, UNAVAILABLE)")
        List<CrewMemberStatusEnum> workStatuses,

        @Schema(description = "Posiciones marítimas (CAPTAIN, HELMSMAN, FIRST_OFFICER, etc.)")
        List<NavigationRoleEnum> positions,

        @Schema(description = "Antigüedad mínima en años", implementation = Integer.class)
        @Min(value = 0, message = "La antigüedad mínima no puede ser negativa")
        Integer minSeniority,

        @Schema(description = "Antigüedad máxima en años", implementation = Integer.class)
        @Min(value = 0, message = "La antigüedad máxima no puede ser negativa")
        Integer maxSeniority,

        @Schema(description = "Fecha de ingreso desde", implementation = LocalDate.class)
        LocalDate entryDateFrom,

        @Schema(description = "Fecha de ingreso hasta", implementation = LocalDate.class)
        LocalDate entryDateTo,

        @Schema(description = "Indica si el personal tiene acceso al sistema (null = todos)")
        Boolean hasSystemAccess,

        @Schema(description = "Estados de acceso al sistema (ACTIVE, INACTIVE, BLOCKED)")
        List<AccessStatusEnum> accessStatuses,

        @Schema(description = "Roles del sistema (JEFE_NAVEGACION, JEFE_OPERACIONES, ADMINISTRADOR)")
        @Size(max = 10, message = "Máximo 10 roles permitidos")
        List<SystemRoleFilterEnum> roles,

        @Schema(description = "Página (0-indexed)", implementation = Integer.class)
        @Min(value = 0, message = "La página no puede ser negativa")
        Integer page,

        @Schema(description = "Cantidad de elementos por página", implementation = Integer.class)
        @Min(value = 1, message = "El tamaño debe ser al menos 1")
        Integer size,

        @Schema(description = "Campo por el cual ordenar (name, surname, fileNumber, hireDate, etc.)")
        String sortBy,

        @Schema(description = "Dirección de ordenamiento (ASC o DESC)")
        String sortDirection
) {
    @Override
    public Integer page() {
        return page != null ? page : 0;
    }

    @Override
    public Integer size() {
        return size != null ? size : 10;
    }

    @Override
    public String sortDirection() {
        return sortDirection != null ? sortDirection.toUpperCase() : "ASC";
    }

    @Override
    public String sortBy() {
        return sortBy != null ? sortBy.toLowerCase() : "surname";
    }
}
