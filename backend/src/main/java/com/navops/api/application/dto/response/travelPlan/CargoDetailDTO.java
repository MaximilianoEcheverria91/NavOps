package com.navops.api.application.dto.response.travelPlan;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Detalle de la carga del plan de travesía")
public record CargoDetailDTO(

    @Schema(description = "Total de carga en toneladas")
    double totalCargoTonnes,

    @Schema(description = "Capacidad máxima de carga del buque en toneladas")
    double shipCargoCapacityTonnes,

    @Schema(description = "Lista de items de carga")
    List<CargoItemDTO> items

) {}
