package com.navops.api.application.dto.response.travelPlanCargo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Respuesta paginada para filtros avanzados de cargas.")
public record TravelPlanCargoFilterResponse(

        @Schema(description = "Lista de cargas que coinciden con los filtros")
        List<TravelPlanCargoResponseDTO> content,

        @Schema(description = "Número de página actual (0-indexed)")
        int page,

        @Schema(description = "Cantidad de elementos por página")
        int size,

        @Schema(description = "Total de elementos que coinciden con los filtros")
        long totalElements,

        @Schema(description = "Total de páginas disponibles")
        int totalPages,

        @Schema(description = "Indica si esta es la última página")
        boolean last,

        @Schema(description = "Indica si esta es la primera página")
        boolean first
) {
}
