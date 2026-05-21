package com.navops.api.application.dto.request.port;

import com.navops.api.domain.enums.DockTypeEnum;
import com.navops.api.domain.enums.PortStatusEnum;
import com.navops.api.domain.enums.TypePortEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;

import java.util.List;
import java.util.UUID;

@Schema(description = "Request DTO para filtros avanzados de puertos.")
public record PortFilterRequest(

        @Schema(description = "Filtrar por país", implementation = UUID.class)
        UUID countryId,

        @Schema(description = "Filtrar por provincia", implementation = UUID.class)
        UUID provinceId,

        @Schema(description = "Filtrar por ciudad", implementation = UUID.class)
        UUID cityId,

        @Schema(description = "Tipos de puerto (COMMERCIAL, INDUSTRIAL, LOGISTIC, TOURISTIC, FISHING)")
        List<TypePortEnum> portTypes,

        @Schema(description = "Tipos de muelle (SOLID_STRUCTURE, FLOATING, PIER_JETTY, DOLPHIN)")
        List<DockTypeEnum> dockTypes,

        @Schema(description = "Estados del puerto (OPERATIONAL, UNDER_MAINTENANCE, CLOSED, FULL, INACTIVE)")
        List<PortStatusEnum> statuses,

        @Schema(description = "Cantidad mínima de muelles", implementation = Integer.class)
        @Min(value = 0, message = "La cantidad mínima de muelles no puede ser negativa")
        Integer minDockCount,

        @Schema(description = "Cantidad máxima de muelles", implementation = Integer.class)
        @Min(value = 0, message = "La cantidad máxima de muelles no puede ser negativa")
        Integer maxDockCount,

        @Schema(description = "Eslora máxima mínima en metros", implementation = Double.class)
        @Min(value = 0, message = "La eslora máxima mínima no puede ser negativa")
        Double minMaxLength,

        @Schema(description = "Eslora máxima máxima en metros", implementation = Double.class)
        @Min(value = 0, message = "La eslora máxima máxima no puede ser negativa")
        Double maxMaxLength,

        @Schema(description = "Calado máximo mínimo en metros", implementation = Double.class)
        @Min(value = 0, message = "El calado máximo mínimo no puede ser negativa")
        Double minMaxDraft,

        @Schema(description = "Calado máximo máximo en metros", implementation = Double.class)
        @Min(value = 0, message = "El calado máximo máximo no puede ser negativa")
        Double maxMaxDraft,

        @Schema(description = "Página (0-indexed)", implementation = Integer.class)
        @Min(value = 0, message = "La página no puede ser negativa")
        Integer page,

        @Schema(description = "Cantidad de elementos por página", implementation = Integer.class)
        @Min(value = 1, message = "El tamaño debe ser al menos 1")
        Integer size,

        @Schema(description = "Campo por el cual ordenar (name, status, dockCount, maxLength, maxDraft)")
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
        return sortBy != null ? sortBy.toLowerCase() : "name";
    }
}
